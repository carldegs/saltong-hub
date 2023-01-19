import { useCallback } from 'react';

import { LetterStatus } from '../models/saltong/types';

const STATUSES: Record<
  LetterStatus | 'initial' | 'active' | 'active-blur',
  {
    base: string;
    highContrast?: string;
  }
> = {
  [LetterStatus.wrong]: {
    base: 'gray.400',
    // color: 'white',
  },
  [LetterStatus.correct]: {
    base: 'green.400',
    // color: 'white',
    highContrast: '#0077bb',
    // color: 'white',
  },
  [LetterStatus.wrongSpot]: {
    base: 'orange.400',
    // color: 'white',
    highContrast: '#ee7733',
    // color: 'white',
  },
  [LetterStatus.none]: {
    base: 'gray.100',
  },
  initial: {
    base: 'gray.100',
  },
  active: {
    base: 'blue.300',
  },
  'active-blur': {
    base: 'blue.100',
  },
};

export const useSaltongTheme = () => {
  const getLetterStatusBaseColor = useCallback(
    (status: LetterStatus, isHighContrast?: boolean) =>
      STATUSES[status][isHighContrast ? 'highContrast' : 'base'],
    []
  );

  return {
    getLetterStatusBaseColor,
  };
};
