import { useCallback, useEffect, useState } from 'react';
import {
  clearAuthSession,
  loadAuthSession,
  subscribeToAuthSession
} from '../../../shared/utils/authSession';

export default function useAuth() {
  const [session, setSession] = useState(loadAuthSession);

  const refreshSession = useCallback(() => {
    setSession(loadAuthSession());
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToAuthSession(refreshSession);
    return unsubscribe;
  }, [refreshSession]);

  const logout = useCallback(() => {
    clearAuthSession();
    setSession(null);
  }, []);

  return {
    session,
    token: session?.token || '',
    user: session?.user || null,
    isAuthenticated: Boolean(session?.token),
    logout
  };
}
