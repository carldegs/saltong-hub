import {
  Text,
  HStack,
  Skeleton,
  useInterval,
  Flex,
  GridItem,
} from '@chakra-ui/react';
import { useState } from 'react';

import { GAME_MODE_DATA } from '../../constants/gameList';
import {
  formatShortDuration,
  getDurationToNextHexGame,
} from '../../utils/time';
import { GameRoundButton } from './GameRoundButton';

export function BiWeeklyCountdown() {
  const [biWeeklyTimeLeft, setBiWeeklyTimeLeft] = useState<string>();

  useInterval(() => {
    setBiWeeklyTimeLeft(formatShortDuration(getDurationToNextHexGame()));
  }, 1000);

  return (
    <Skeleton isLoaded={!!biWeeklyTimeLeft} as={GridItem}>
      <Flex
        flexDir={{
          base: 'column',
        }}
        px={{
          base: 8,
          md: 12,
        }}
        py={6}
        bg="gray.100"
        borderRadius="lg"
      >
        <Text mb={4} fontSize="lg">
          Ends in <b>{biWeeklyTimeLeft}</b>
        </Text>
        <HStack spacing={0} justify="center" w="full">
          <GameRoundButton {...GAME_MODE_DATA.hex} round={123} />
        </HStack>
      </Flex>
    </Skeleton>
  );
}
