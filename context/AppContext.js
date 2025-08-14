// context/AppContext.js
import { createContext, useContext, useReducer, useMemo } from 'react';

// Actions constants
export const ACTIONS = {
 SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
 SET_SEARCH_TERM: 'SET_SEARCH_TERM',
 SET_FILTER_STATUS: 'SET_FILTER_STATUS',
 SET_SORT_BY: 'SET_SORT_BY',
 CANCEL_SUBSCRIPTION: 'CANCEL_SUBSCRIPTION',
 PAUSE_SUBSCRIPTION: 'PAUSE_SUBSCRIPTION',
 ACTIVATE_SUBSCRIPTION: 'ACTIVATE_SUBSCRIPTION',
 UNSUBSCRIBE_EMAIL: 'UNSUBSCRIBE_EMAIL',
 RESUBSCRIBE_EMAIL: 'RESUBSCRIBE_EMAIL',
 ARCHIVE_EMAIL: 'ARCHIVE_EMAIL',
 SET_PWA_INSTALLABLE: 'SET_PWA_INSTALLABLE',
 SET_PWA_INSTALLED: 'SET_PWA_INSTALLED',
 IMPORT_SUBSCRIPTIONS: 'IMPORT_SUBSCRIPTIONS'
};

// Initial state
const initialState = {
 user: {
   name: 'Alex Johnson',
   totalSaved: 247.80,
   savingsGoal: 300,
   email: 'alex@example.com'
 },
 ui: {
   activeTab: 'dashboard',
   searchTerm: '',
   filterStatus: 'all',
   sortBy: 'amount'
 },
 pwa: {
   isInstallable: false,
   isInstalled: false,
   showInstallPrompt: false
 },
 subscriptions: [
   { 
     id: 1, 
     name: 'Netflix', 
     amount: 15.99, 
     status: 'active', 
     lastUsed: '2 days ago', 
     category: 'Entertainment', 
     logo: '🎬', 
     nextBilling: '2025-08-15', 
     yearlyDiscount: 0 
   },
   { 
     id: 2, 
     name: 'Spotify Premium', 
     amount: 9.99, 
     status: 'active', 
     lastUsed: '1 hour ago', 
     category: 'Music', 
     logo: '🎵', 
     nextBilling: '2025-08-12', 
     yearlyDiscount: 20 
   },
   { 
     id: 3, 
     name: 'Adobe Creative Cloud', 
     amount: 52.99, 
     status: 'unused', 
     lastUsed: '3 months ago', 
     category: 'Software', 
     logo: '🎨', 
     nextBilling: '2025-08-20', 
     yearlyDiscount: 16 
   },
   { 
     id: 4, 
     name: 'Disney+', 
     amount: 7.99, 
     status: 'forgotten', 
     lastUsed: '6 months ago', 
     category: 'Entertainment', 
     logo: '🏰', 
     nextBilling: '2025-08-18', 
     yearlyDiscount: 0 
   },
   { 
     id: 5, 
     name: 'LinkedIn Premium', 
     amount: 29.99, 
     status: 'unused', 
     lastUsed: '2 months ago', 
     category: 'Professional', 
     logo: '💼', 
     nextBilling: '2025-08-25', 
     yearlyDiscount: 25 
   },
   { 
     id: 6, 
     name: 'Canva Pro', 
     amount: 12.99, 
     status: 'paused', 
     lastUsed: '1 month ago', 
     category: 'Design', 
     logo: '🎯', 
     nextBilling: 'Paused', 
     yearlyDiscount: 10 
   },
   { 
     id: 7, 
     name: 'GitHub Pro', 
     amount: 4.00, 
     status: 'active', 
     lastUsed: 'Today', 
     category: 'Development', 
     logo: '💻', 
     nextBilling: '2025-08-11', 
     yearlyDiscount: 16 
   },
   { 
     id: 8, 
     name: 'Notion Pro', 
     amount: 8.00, 
     status: 'active', 
     lastUsed: 'Yesterday', 
     category: 'Productivity', 
     logo: '📝', 
     nextBilling: '2025-08-14', 
     yearlyDiscount: 20 
   }
 ],
 emails: [
   { 
     id: 1, 
     sender: 'TechCrunch', 
     type: 'newsletter', 
     frequency: 'daily', 
     unsubscribed: false, 
     emailsPerWeek: 7, 
     category: 'Tech News', 
     importance: 'medium',
     logo: '📱',
     description: 'Latest startup and technology news'
   },
   { 
     id: 2, 
     sender: 'The Verge', 
     type: 'newsletter', 
     frequency: 'daily', 
     unsubscribed: false, 
     emailsPerWeek: 5, 
     category: 'Tech News', 
     importance: 'medium',
     logo: '⚡',
     description: 'Technology, science, art, and culture'
   },
   { 
     id: 3, 
     sender: 'Amazon', 
     type: 'promotional', 
     frequency: 'weekly', 
     unsubscribed: false, 
     emailsPerWeek: 3, 
     category: 'Shopping', 
     importance: 'medium',
     logo: '📦',
     description: 'Product recommendations and deals'
   },
   { 
     id: 4, 
     sender: 'Groupon', 
     type: 'promotional', 
     frequency: 'daily', 
     unsubscribed: false, 
     emailsPerWeek: 14, 
     category: 'Deals', 
     importance: 'low',
     logo: '🎫',
     description: 'Local deals and discounts'
   }
 ]
};

// Reducer function
function appReducer(state, action) {
 switch (action.type) {
   case ACTIONS.SET_ACTIVE_TAB:
     return {
       ...state,
       ui: { ...state.ui, activeTab: action.payload }
     };

   case ACTIONS.SET_SEARCH_TERM:
     return {
       ...state,
       ui: { ...state.ui, searchTerm: action.payload }
     };

   case ACTIONS.SET_FILTER_STATUS:
     return {
       ...state,
       ui: { ...state.ui, filterStatus: action.payload }
     };

   case ACTIONS.SET_SORT_BY:
     return {
       ...state,
       ui: { ...state.ui, sortBy: action.payload }
     };

   case ACTIONS.CANCEL_SUBSCRIPTION:
     return {
       ...state,
       subscriptions: state.subscriptions.map(sub =>
         sub.id === action.payload 
           ? { ...sub, status: 'cancelled' }
           : sub
       )
     };

   case ACTIONS.PAUSE_SUBSCRIPTION:
     return {
       ...state,
       subscriptions: state.subscriptions.map(sub =>
         sub.id === action.payload 
           ? { ...sub, status: 'paused', nextBilling: 'Paused' }
           : sub
       )
     };

   case ACTIONS.ACTIVATE_SUBSCRIPTION:
     return {
       ...state,
       subscriptions: state.subscriptions.map(sub =>
         sub.id === action.payload 
           ? { ...sub, status: 'active', nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
           : sub
       )
     };

   case ACTIONS.UNSUBSCRIBE_EMAIL:
     return {
       ...state,
       emails: state.emails.map(email =>
         email.id === action.payload 
           ? { ...email, unsubscribed: true }
           : email
       )
     };

   case ACTIONS.RESUBSCRIBE_EMAIL:
     return {
       ...state,
       emails: state.emails.map(email =>
         email.id === action.payload 
           ? { ...email, unsubscribed: false }
           : email
       )
     };

   case ACTIONS.ARCHIVE_EMAIL:
     return {
       ...state,
       emails: state.emails.filter(email => email.id !== action.payload)
     };

   case ACTIONS.SET_PWA_INSTALLABLE:
     return {
       ...state,
       pwa: { ...state.pwa, isInstallable: action.payload }
     };

   case ACTIONS.SET_PWA_INSTALLED:
     return {
       ...state,
       pwa: { ...state.pwa, isInstalled: action.payload, showInstallPrompt: false }
     };

   case ACTIONS.IMPORT_SUBSCRIPTIONS:
     const newSubscriptions = action.payload.map((sub, index) => ({
       id: Date.now() + index,
       name: sub.name,
       amount: sub.amount,
       status: 'active',
       lastUsed: 'Today',
       category: sub.category || 'Other',
       logo: sub.logo || '📊',
       nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
       yearlyDiscount: 0
     }));
     
     // Check for duplicates before adding
     const existingNames = state.subscriptions.map(s => s.name.toLowerCase());
     const uniqueNewSubs = newSubscriptions.filter(
       sub => !existingNames.includes(sub.name.toLowerCase())
     );
     
     return {
       ...state,
       subscriptions: [...state.subscriptions, ...uniqueNewSubs]
     };

   default:
     return state;
 }
}

// Create Context
const AppContext = createContext(null);

// Provider Component
export function AppProvider({ children }) {
 const [state, dispatch] = useReducer(appReducer, initialState);

 // Action creators
 const actions = useMemo(() => ({
   setActiveTab: (tab) => dispatch({ type: ACTIONS.SET_ACTIVE_TAB, payload: tab }),
   setSearchTerm: (term) => dispatch({ type: ACTIONS.SET_SEARCH_TERM, payload: term }),
   setFilterStatus: (status) => dispatch({ type: ACTIONS.SET_FILTER_STATUS, payload: status }),
   setSortBy: (sortBy) => dispatch({ type: ACTIONS.SET_SORT_BY, payload: sortBy }),
   cancelSubscription: (id) => dispatch({ type: ACTIONS.CANCEL_SUBSCRIPTION, payload: id }),
   pauseSubscription: (id) => dispatch({ type: ACTIONS.PAUSE_SUBSCRIPTION, payload: id }),
   activateSubscription: (id) => dispatch({ type: ACTIONS.ACTIVATE_SUBSCRIPTION, payload: id }),
   unsubscribeEmail: (id) => dispatch({ type: ACTIONS.UNSUBSCRIBE_EMAIL, payload: id }),
   resubscribeEmail: (id) => dispatch({ type: ACTIONS.RESUBSCRIBE_EMAIL, payload: id }),
   archiveEmail: (id) => dispatch({ type: ACTIONS.ARCHIVE_EMAIL, payload: id }),
   setPWAInstallable: (installable) => dispatch({ type: ACTIONS.SET_PWA_INSTALLABLE, payload: installable }),
   setPWAInstalled: (installed) => dispatch({ type: ACTIONS.SET_PWA_INSTALLED, payload: installed }),
   importSubscriptions: (subs) => dispatch({ type: ACTIONS.IMPORT_SUBSCRIPTIONS, payload: subs })
 }), []);

 const value = useMemo(() => ({
   state,
   actions,
   dispatch
 }), [state, actions]);

 return (
   <AppContext.Provider value={value}>
     {children}
   </AppContext.Provider>
 );
}

// Custom hook
export function useApp() {
 const context = useContext(AppContext);
 if (!context) {
   throw new Error('useApp must be used within AppProvider');
 }
 return context;
}
