import { useApp } from '../context';

export function useEmails() {
  const { state, actions } = useApp();
  const { emails } = state;

  return {
    emails,
    unsubscribeEmail: actions.unsubscribeEmail,
    resubscribeEmail: actions.resubscribeEmail
  };
}
