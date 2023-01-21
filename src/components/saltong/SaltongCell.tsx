import { Box, Flex, FlexProps, Text } from '@chakra-ui/react';
import { motion, Variants } from 'framer-motion';
import React, { ReactNode, useMemo } from 'react';

import { useSaltongTheme } from '../../hooks/useSaltongTheme';
import { LetterStatus } from '../../models/saltong/types';

// TODO: MOVE
export const STATUSES: Record<
  LetterStatus | 'initial' | 'active' | 'active-blur',
  {
    base: FlexProps;
    highContrast?: FlexProps;
  }
> = {
  [LetterStatus.wrong]: {
    base: {
      bg: 'gray.400',
    },
  },
  [LetterStatus.correct]: {
    base: {
      bg: 'green.400',
    },
    highContrast: {
      bg: '#0077bb',
    },
  },
  [LetterStatus.wrongSpot]: {
    base: {
      bg: 'orange.400',
    },
    highContrast: {
      bg: '#ee7733',
    },
  },
  [LetterStatus.none]: {
    base: {
      bg: 'gray.100',
    },
  },
  initial: {
    base: {
      bg: 'gray.100',
    },
  },
  active: {
    base: {
      bg: 'blue.300',
    },
  },
  'active-blur': {
    base: {
      bg: 'blue.100',
    },
  },
};

const SIZES = {
  sm: { boxSize: 10 },
  md: { boxSize: 12 },
};

interface Props {
  size?: keyof typeof SIZES;
  status?: LetterStatus | 'initial' | 'active' | 'active-blur';
  isHighContrast?: boolean;
  children?: ReactNode;
}

const variants: Variants = {
  hide: {
    width: 0,
    height: 0,
  },
  show: {
    width: 'var(--chakra-sizes-16)',
    height: 'var(--chakra-sizes-16)',
    transition: {
      duration: 0.5,
      ease: [1, 0, 0, 1],
      staggerChildren: 1,
    },
  },
};

const SaltongCell: React.FC<Props> = ({ status = 'initial', children }) => {
  // const statusPropsGroup = STATUSES[status];
  // const statusProps =
  //   isHighContrast && statusPropsGroup?.highContrast
  //     ? statusPropsGroup.highContrast
  //     : statusPropsGroup.base;

  const { getCellStyle, getLetterStatusBaseColor } = useSaltongTheme();
  const statusProps = useMemo(
    () => getCellStyle(status),
    [getCellStyle, status]
  );

  return (
    <Flex
      align="center"
      justify="center"
      borderRadius={4}
      fontWeight="semibold"
      pos="relative"
      overflow="hidden"
      as={motion.div}
      variants={{
        hide: {
          scale: 1,
        },
        show: {
          scale: [1, 1.05, 1],
          transition: {
            duration: 0.6,
            ease: [1, 0, 0, 1],
            staggerChildren: 0.2,
          },
        },
      }}
      boxSize={{ base: 10, md: 12 }}
      {...(status === 'active' || status === 'active-blur'
        ? statusProps
        : getCellStyle(LetterStatus.none))}
    >
      <Box
        as={motion.div}
        borderRadius="full"
        pos="absolute"
        zIndex={0}
        variants={variants}
        bg={getLetterStatusBaseColor(status)}
      />
      <Text
        as={motion.p}
        pos="absolute"
        zIndex={1}
        userSelect="none"
        textTransform="uppercase"
        variants={{
          hide: {
            color: '#1A365D',
          },
          show: {
            color: '#FFFFFF',
            transition: {
              duration: 0.125,
              ease: [0, 1, 1, 0],
            },
          },
        }}
        fontSize={{
          base: '2xl',
          md: '3xl',
        }}
      >
        {children}
      </Text>
    </Flex>
  );
};

export default SaltongCell;
