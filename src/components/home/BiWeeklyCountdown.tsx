import {
  HStack,
  Skeleton,
  useInterval,
  Card,
  CardHeader,
  CardBody,
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

  useEffect(() => {
    setBiWeeklyTimeLeft(formatShortDuration(getDurationToNextHexGame()));
  }, []);

  useInterval(() => {
    setBiWeeklyTimeLeft(formatShortDuration(getDurationToNextHexGame()));
  }, 1000);

  return (
    <Card>
      <CardHeader fontSize="lg" pb={0}>
        <Skeleton isLoaded={!!biWeeklyTimeLeft} maxW="250px">
          Ends in <b>{biWeeklyTimeLeft}</b>
        </Skeleton>
      </CardHeader>
      <CardBody>
        <HStack spacing={0} justify="center" w="full">
          <GameRoundButton {...GAME_MODE_DATA.hex} round={123} />
        </HStack>
      </CardBody>
    </Card>
  );
}
