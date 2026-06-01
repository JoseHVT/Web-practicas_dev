import { useMemo } from 'react';

export default function useAdmin(user) {
  const isAdmin = useMemo(() => user?.role === 'admin', [user]);

  return { isAdmin };
}
