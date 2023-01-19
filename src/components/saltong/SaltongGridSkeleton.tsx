import { HStack, Skeleton } from '@chakra-ui/react';
import { Stack } from 'phosphor-react';
import React from 'react';

interface Props {
  wordLen: number;
  maxTurns: number;
}

const SaltongGridSkeleton: React.FC<Props> = ({ wordLen, maxTurns }) => (
  <Stack spacing={3}>
    {[...Array(maxTurns).keys()].map((rowNum) => (
      <HStack spacing={2} key={`skeleton-row-${rowNum}`}>
        {[...Array(wordLen).keys()].map((cellNum) => (
          <Skeleton boxSize={12} key={`skeleton-cell-${rowNum}-${cellNum}`} />
        ))}
      </HStack>
    ))}
  </Stack>
);

export default SaltongGridSkeleton;
