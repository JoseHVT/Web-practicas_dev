const AUTH_TOKEN_KEY = 'authToken';
const AUTH_USER_KEY = 'authUser';
const AUTH_SESSION_EVENT = 'auth-session-changed';

const emitAuthSessionChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
  }
};

export const loadAuthSession = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const rawUser = localStorage.getItem(AUTH_USER_KEY);

  if (!token) {
    return null;
  }

  try {
    const user = rawUser ? JSON.parse(rawUser) : null;
    return { token, user };
  } catch {
    return { token, user: null };
  }
};

export const saveAuthSession = (token, user) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user || null));
  emitAuthSessionChange();
};

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  emitAuthSessionChange();
};

export const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY) || '';

export const getAuthUser = () => {
  try {
    return JSON.parse(localStorage.getItem(AUTH_USER_KEY) || 'null');
  } catch {
    return null;
  }
};

export const updateAuthUser = (user) => {
  if (!localStorage.getItem(AUTH_TOKEN_KEY)) {
    return;
  }

  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user || null));
  emitAuthSessionChange();
};

export const subscribeToAuthSession = (listener) => {
  if (typeof window === 'undefined') {
    return () => {};
  }

  window.addEventListener(AUTH_SESSION_EVENT, listener);
  return () => window.removeEventListener(AUTH_SESSION_EVENT, listener);
};
