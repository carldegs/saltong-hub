import {
  Text,
  HStack,
  Skeleton,
  useInterval,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';

import { GAME_MODE_DATA } from '../../constants/gameList';
import { formatShortDuration, getDurationToNextDay } from '../../utils/time';
import { GameRoundButton } from './GameRoundButton';

export const DAILY_DASHBOARD_DATA = [
  GAME_MODE_DATA.main,
  GAME_MODE_DATA.max,
  GAME_MODE_DATA.mini,
];

export function DailyCountdown() {
  const [dailyTimeLeft, setDailyTimeLeft] = useState<string>();
  const bg = useColorModeValue('gray.100', 'gray.700');

  useEffect(() => {
    setDailyTimeLeft(formatShortDuration(getDurationToNextDay()));
  }, []);

  useInterval(() => {
    setDailyTimeLeft(formatShortDuration(getDurationToNextDay()));
  }, 1000);

  const dailyDashboardData = useMemo(() => {
    return DAILY_DASHBOARD_DATA.map((data) => ({
      ...data,
      round: 123,
    }));
  }, []);

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
      <Skeleton isLoaded={!!dailyTimeLeft} maxW="250px">
        <Text fontSize="lg">
          Ends in <b>{dailyTimeLeft}</b>
        </Text>
      </Skeleton>
      <HStack spacing={0} justify="center" w="full" mt={4}>
        {dailyDashboardData.map((data) => (
          <GameRoundButton key={data.name} {...data} />
        ))}
      </HStack>
    </Flex>
  );
}
