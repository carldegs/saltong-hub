import { AuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { useCallback, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth, authProviders } from '../lib/firebase';

const useLogin = () => {
  const authState = useAuthState(auth);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const handleLogin = useCallback(
    async (provider: AuthProvider | keyof typeof authProviders) => {
      try {
        setPopupOpen(true);
        await signInWithPopup(
          auth,
          typeof provider === 'string'
            ? authProviders[provider].provider
            : provider
        );
      } catch (err: any) {
        if (
          err?.code === 'auth/cancelled-popup-request' ||
          err?.code === 'auth/popup-closed-by-user'
        ) {
          setPopupOpen(false);
          return;
        }

        throw err;
      }
    },
    []
  );

  const handleLogout = useCallback(() => {
    signOut(auth);
  }, []);

  return {
    handleLogin,
    handleLogout,
    isPopupOpen,
    authState,
  };
};

export default useLogin;
