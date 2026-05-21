export const getApiErrorMessage = (error, fallback = 'error de servidor') => (
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  fallback
);
