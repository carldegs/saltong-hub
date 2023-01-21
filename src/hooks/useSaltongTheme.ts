import { BoxProps, useColorMode } from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';

import { LetterStatus } from '../models/saltong/types';
import useColorblindMode from './useColorblindMode';

export const useSaltongTheme = () => {
  const { colorMode } = useColorMode();
  const [isHighContrast] = useColorblindMode();

  const isLight = useMemo(() => colorMode === 'light', [colorMode]);

  const statuses: Record<
    LetterStatus | 'initial' | 'active' | 'active-blur',
    {
      base: string;
      highContrast?: string;
    }
  > = useMemo(
    () => ({
      [LetterStatus.wrong]: {
        base: `gray.${isLight ? 400 : 700}`,
      },
      [LetterStatus.correct]: {
        base: `green.${isLight ? 400 : 600}`,
        highContrast: '#0077bb',
      },
      [LetterStatus.wrongSpot]: {
        base: `orange.${isLight ? 400 : 600}`,
        highContrast: '#ee7733',
      },
      [LetterStatus.none]: {
        base: `gray.${isLight ? 100 : 600}`,
      },
      initial: {
        base: `gray.${isLight ? 100 : 600}`,
      },
      active: {
        base: `blue.300`,
      },
      'active-blur': {
        base: `blue.300`,
      },
    }),
    [isLight]
  );

  const getLetterStatusBaseColor = useCallback(
    (status: LetterStatus | 'initial' | 'active' | 'active-blur') =>
      statuses[status][isHighContrast ? 'highContrast' : 'base'] ||
      statuses[status]['base'],
    [isHighContrast, statuses]
  );

  const getCellStyle = useCallback(
    (status: LetterStatus | 'initial' | 'active' | 'active-blur'): BoxProps => {
      const bg = getLetterStatusBaseColor(status);

      return {
        bg,
        border: isLight ? '' : '1px solid',
        borderColor: isLight ? '' : 'gray.900',
      };
    },
    [getLetterStatusBaseColor, isLight]
  );

  return {
    getLetterStatusBaseColor,
    getCellStyle,
  };
};
