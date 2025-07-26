import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { api } from '../utils/api';

export function useAuth({ redirectTo = '/login', redirectIfFound = false } = {}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      if (!redirectIfFound) router.replace(redirectTo);
      setLoading(false);
      return;
    }
    api.get('/auth/session')
      .then(() => {
        setUser({ token });
        if (redirectIfFound) router.replace('/');
      })
      .catch(() => {
        localStorage.removeItem('token');
        if (!redirectIfFound) router.replace(redirectTo);
      })
      .finally(() => setLoading(false));
  }, [redirectTo, redirectIfFound, router]);

  return { user, loading };
}
