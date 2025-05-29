// src/hooks/useSupabaseSession.js
import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { userAtom } from '../store/userAtom';
import { tokenAtom } from '../store/tokenAtom';
import { supabase } from '../services/supabaseClient';
import Cookies from 'js-cookie';

export function useSupabaseSession() {
  const setUser = useSetAtom(userAtom);
  const setToken = useSetAtom(tokenAtom);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const user = data?.session?.user;
      const token = data?.session?.access_token;

      setUser(user || null);
      setToken(token || '');

      if (token) {
        Cookies.set('token', token, { expires: 30 });
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      const token = session?.access_token;

      setUser(user || null);
      setToken(token || '');

      if (token) {
        Cookies.set('token', token, { expires: 30 });
      } else {
        Cookies.remove('token');
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [setUser, setToken]);
}
