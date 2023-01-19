import { HStack, StackProps } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';

import { LetterData, LetterStatus } from '../../models/saltong/types';
import SaltongCell from './SaltongCell';

interface Props extends StackProps {
  status?: 'initial' | 'active' | 'active-blur' | 'done';
  letters: LetterData[];
}

const SaltongRow: React.FC<Props> = ({
  status = 'initial',
  letters,
  ...props
}) => {
  return (
    <HStack
      as={motion.div}
      variants={{
        hide: {},
        show: {
          transition: { staggerChildren: 0.1 },
        },
      }}
      initial={false}
      animate={status === 'done' ? 'show' : 'hide'}
      spacing={2}
      align="center"
      justify="center"
      {...props}
    >
      {letters
        .map(([letter, letterStatus], i) => [letter, letterStatus, i] as const)
        .map(([letter, letterStatus, i]) => (
          <SaltongCell
            key={`cell-${i}`}
            status={
              status === 'active' || status === 'active-blur'
                ? status
                : letterStatus === LetterStatus.none
                ? 'initial'
                : letterStatus
            }
          >
            {letter}
          </SaltongCell>
        ))}
    </HStack>
  );
};

export default SaltongRow;
