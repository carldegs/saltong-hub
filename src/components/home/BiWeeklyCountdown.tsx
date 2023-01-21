import {
  Text,
  HStack,
  Skeleton,
  useInterval,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { GAME_MODE_DATA } from '../../constants/gameList';
import {
  formatShortDuration,
  getDurationToNextHexGame,
} from '../../utils/time';
import { GameRoundButton } from './GameRoundButton';

export function BiWeeklyCountdown() {
  const [biWeeklyTimeLeft, setBiWeeklyTimeLeft] = useState<string>();
  const bg = useColorModeValue('gray.100', 'gray.700');

  useEffect(() => {
    setBiWeeklyTimeLeft(formatShortDuration(getDurationToNextHexGame()));
  }, []);

  useInterval(() => {
    setBiWeeklyTimeLeft(formatShortDuration(getDurationToNextHexGame()));
  }, 1000);

  return (
    <Flex
      flexDir={{
        base: 'column',
      }}
      px={{
        base: 8,
        md: 10,
      }}
      py={6}
      bg={bg}
      borderRadius="lg"
    >
      <Skeleton isLoaded={!!biWeeklyTimeLeft} maxW="250px">
        <Text fontSize="lg">
          Ends in <b>{biWeeklyTimeLeft}</b>
        </Text>
      </Skeleton>
      <HStack spacing={0} justify="center" w="full">
        <GameRoundButton {...GAME_MODE_DATA.hex} round={123} />
      </HStack>
    </Flex>
  );
}
