import {
  AuthProvider,
  deleteUser,
  linkWithPopup,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { useCallback, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth, authProviders } from '../lib/firebase';

const useLogin = (allowLink = false) => {
  const authState = useAuthState(auth);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [error, setError] = useState<any>();
  const handleLogin = useCallback(
    async (provider: AuthProvider | keyof typeof authProviders) => {
      try {
        setPopupOpen(true);
        if (allowLink && auth.currentUser) {
          const cred = await linkWithPopup(
            auth.currentUser,
            typeof provider === 'string'
              ? authProviders[provider].provider
              : provider
          );

          await updateProfile(auth.currentUser, {
            displayName: cred.user.providerData?.[0].displayName,
            photoURL: cred.user.providerData?.[0].photoURL,
          });

          auth.currentUser?.reload();
        } else {
          if (auth.currentUser && auth.currentUser.isAnonymous) {
            await deleteUser(auth.currentUser);
          }

          await signInWithPopup(
            auth,
            typeof provider === 'string'
              ? authProviders[provider].provider
              : provider
          );
        }
      } catch (err: any) {
        if (
          err?.code === 'auth/cancelled-popup-request' ||
          err?.code === 'auth/popup-closed-by-user'
        ) {
          setPopupOpen(false);
          return;
        }

        setError(err);
        setPopupOpen(false);
      }
    },
    [allowLink]
  );

  const handleLogout = useCallback(() => {
    signOut(auth);
  }, []);

  return {
    handleLogin,
    handleLogout,
    isPopupOpen,
    authState,
    error,
  };
};

export default useLogin;
