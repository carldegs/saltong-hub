import {
  Text,
  HStack,
  Skeleton,
  useInterval,
  Flex,
  GridItem,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';

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
    <Skeleton isLoaded={!!dailyTimeLeft} as={GridItem}>
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
          Ends in <b>{dailyTimeLeft}</b>
        </Text>
        <HStack spacing={0} justify="center" w="full">
          {dailyDashboardData.map((data) => (
            <GameRoundButton key={data.name} {...data} />
          ))}
        </HStack>
      </Flex>
    </Skeleton>
  );
}
