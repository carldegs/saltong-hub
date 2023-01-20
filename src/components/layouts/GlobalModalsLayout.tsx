import { useRouter } from 'next/router';
import React, {
  ReactNode,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  GLOBAL_MODALS,
  GLOBAL_MODALS_DATA,
} from '../../constants/globalModals';

const GlobalModalsLayout: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const router = useRouter();
  const [openModal, setOpenModal] = useState('');

  const onClose = useCallback(() => {
    router.push({ hash: '' });
  }, [router]);

  useEffect(() => {
    setOpenModal(router.asPath.split('#')?.[1]);
  }, [router.asPath]);

  return (
    <>
      <Suspense>
        {GLOBAL_MODALS_DATA.filter(({ hash }) => hash === openModal).map(
          ({ hash }) => {
            const Modal =
              GLOBAL_MODALS[openModal as keyof typeof GLOBAL_MODALS];

            return (
              <Modal
                key={`modal-${hash}`}
                isOpen={openModal === hash}
                onClose={onClose}
              />
            );
          }
        )}
      </Suspense>
      {children}
    </>
  );
};

export default GlobalModalsLayout;
