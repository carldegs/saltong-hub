import {
  HStack,
  Skeleton,
  useInterval,
  Card,
  CardHeader,
  CardBody,
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
    <Card>
      <CardHeader fontSize="lg" pb={0}>
        <Skeleton isLoaded={!!dailyTimeLeft} maxW="250px">
          Ends in <b>{dailyTimeLeft}</b>
        </Skeleton>
      </CardHeader>

      <CardBody>
        <HStack spacing={0} justify="center" w="full">
          {dailyDashboardData.map((data) => (
            <GameRoundButton key={data.name} {...data} />
          ))}
        </HStack>
      </CardBody>
    </Card>
  );
}
