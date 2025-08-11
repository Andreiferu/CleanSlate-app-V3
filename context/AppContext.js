import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { subscriptionsService, emailsService, localStorageService, analyticsCalculator } from '../services';

// Initial state
const initialState = {
  user: {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    totalSaved: 247.80,
    joinDate: '2024-01-15',
    savingsGoal: 300
  },
  subscriptions: [],
  emails: [],
  insights: [],
  ui: {
    loading: false,
    activeTab: 'dashboard',
    searchTerm: '',
    filterStatus: 'all',
    sortBy: 'amount'
  },
  pwa: {
    isInstalled: false,
    deferredPrompt: null,
    showInstallBanner: false
  }
};

// Action types
export const ACTIONS = {
  // Data actions
  SET_SUBSCRIPTIONS: 'SET_SUBSCRIPTIONS',
  UPDATE_SUBSCRIPTION: 'UPDATE_SUBSCRIPTION',
  SET_EMAILS: 'SET_EMAILS',
  UPDATE_EMAIL: 'UPDATE_EMAIL',
  SET_INSIGHTS: 'SET_INSIGHTS',
  DISMISS_INSIGHT: 'DISMISS_INSIGHT',
  
  // UI actions
  SET_LOADING: 'SET_LOADING',
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
  SET_FILTER_STATUS: 'SET_FILTER_STATUS',
  SET_SORT_BY: 'SET_SORT_BY',
  
  // PWA actions
  SET_PWA_STATE: 'SET_PWA_STATE',
  
  // User actions
  UPDATE_USER: 'UPDATE_USER',
  ADD_SAVINGS: 'ADD_SAVINGS'
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_SUBSCRIPTIONS:
      return { ...state, subscriptions: action.payload };
      
    case ACTIONS.UPDATE_SUBSCRIPTION:
      return {
        ...state,
        subscriptions: state.subscriptions.map(sub =>
          sub.id === action.payload.id ? { ...sub, ...action.payload.updates } : sub
        )
      };
      
    case ACTIONS.SET_EMAILS:
      return { ...state, emails: action.payload };
      
    case ACTIONS.UPDATE_EMAIL:
      return {
        ...state,
        emails: state.emails.map(email =>
          email.id === action.payload.id ? { ...email, ...action.payload.updates } : email
        )
      };
      
    case ACTIONS.SET_INSIGHTS:
      return { ...state, insights: action.payload };
      
    case ACTIONS.DISMISS_INSIGHT:
      return {
        ...state,
        insights: state.insights.filter(insight => insight.id !== action.payload)
      };
      
    case ACTIONS.SET_LOADING:
      return { ...state, ui: { ...state.ui, loading: action.payload } };
      
    case ACTIONS.SET_ACTIVE_TAB:
      return { ...state, ui: { ...state.ui, activeTab: action.payload } };
      
    case ACTIONS.SET_SEARCH_TERM:
      return { ...state, ui: { ...state.ui, searchTerm: action.payload } };
      
    case ACTIONS.SET_FILTER_STATUS:
      return { ...state, ui: { ...state.ui, filterStatus: action.payload } };
      
    case ACTIONS.SET_SORT_BY:
      return { ...state, ui: { ...state.ui, sortBy: action.payload } };
      
    case ACTIONS.SET_PWA_STATE:
      return { ...state, pwa: { ...state.pwa, ...action.payload } };
      
    case ACTIONS.UPDATE_USER:
      return { ...state, user: { ...state.user, ...action.payload } };
      
    case ACTIONS.ADD_SAVINGS:
      return {
        ...state,
        user: {
          ...state.user,
          totalSaved: state.user.totalSaved + action.payload
        }
      };
      
    default:
      return state;
  }
}

// Context creation
const AppContext = createContext();

// Context Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Persist state changes to localStorage
  useEffect(() => {
    if (state.subscriptions.length > 0) {
      localStorageService.saveAppState(state);
    }
  }, [state.user, state.subscriptions, state.emails]);

  const loadInitialData = async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    
    try {
      // Load from localStorage first
      const savedState = localStorageService.getAppState();
      if (savedState) {
        dispatch({ type: ACTIONS.UPDATE_USER, payload: savedState.user });
        dispatch({ type: ACTIONS.SET_SUBSCRIPTIONS, payload: savedState.subscriptions });
        dispatch({ type: ACTIONS.SET_EMAILS, payload: savedState.emails });
      } else {
        // Load default data
        const subscriptions = subscriptionsService.getDefaultSubscriptions();
        const emails = emailsService.getDefaultEmails();
        dispatch({ type: ACTIONS.SET_SUBSCRIPTIONS, payload: subscriptions });
        dispatch({ type: ACTIONS.SET_EMAILS, payload: emails });
      }
      
      // Generate insights based on loaded data
      const insights = analyticsCalculator.generateInsights(
        state.subscriptions.length > 0 ? state.subscriptions : subscriptionsService.getDefaultSubscriptions(),
        state.emails.length > 0 ? state.emails : emailsService.getDefaultEmails(),
        state.user
      );
      dispatch({ type: ACTIONS.SET_INSIGHTS, payload: insights });
      
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Action creators
  const actions = {
    // Subscription actions
    cancelSubscription: (id) => {
      const subscription = state.subscriptions.find(s => s.id === id);
      dispatch({
        type: ACTIONS.UPDATE_SUBSCRIPTION,
        payload: { id, updates: { status: 'cancelled' } }
      });
      dispatch({ type: ACTIONS.ADD_SAVINGS, payload: subscription.amount });
      
      // Show notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Subscription Cancelled', {
          body: `${subscription.name} cancelled. You'll save $${subscription.amount}/month!`,
          icon: '/icons/icon-192x192.png'
        });
      }
    },

    pauseSubscription: (id) => {
      dispatch({
        type: ACTIONS.UPDATE_SUBSCRIPTION,
        payload: { id, updates: { status: 'paused' } }
      });
    },

    activateSubscription: (id) => {
      dispatch({
        type: ACTIONS.UPDATE_SUBSCRIPTION,
        payload: { id, updates: { status: 'active' } }
      });
    },

    // Email actions
    unsubscribeEmail: (id) => {
      dispatch({
        type: ACTIONS.UPDATE_EMAIL,
        payload: { id, updates: { unsubscribed: true } }
      });
    },

    resubscribeEmail: (id) => {
      dispatch({
        type: ACTIONS.UPDATE_EMAIL,
        payload: { id, updates: { unsubscribed: false } }
      });
    },

    // Insight actions
    dismissInsight: (id) => {
      dispatch({ type: ACTIONS.DISMISS_INSIGHT, payload: id });
    },

    // UI actions
    setActiveTab: (tab) => {
      dispatch({ type: ACTIONS.SET_ACTIVE_TAB, payload: tab });
    },

    setSearchTerm: (term) => {
      dispatch({ type: ACTIONS.SET_SEARCH_TERM, payload: term });
    },

    setFilterStatus: (status) => {
      dispatch({ type: ACTIONS.SET_FILTER_STATUS, payload: status });
    },

    setSortBy: (sortBy) => {
      dispatch({ type: ACTIONS.SET_SORT_BY, payload: sortBy });
    },

    // PWA actions
    setPWAState: (pwaState) => {
      dispatch({ type: ACTIONS.SET_PWA_STATE, payload: pwaState });
    }
  };

  const value = {
    state,
    dispatch,
    actions
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook pentru utilizarea context-ului
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

export default AppContext;
