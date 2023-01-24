import {
  Box,
  Button,
  SimpleGrid,
  Text,
  Divider,
  Stack,
} from '@chakra-ui/react';
import {
  differenceInMilliseconds,
  getDay,
  getDaysInMonth,
  isSameDay,
  format,
  isTuesday,
  isFriday,
  differenceInCalendarWeeks,
  differenceInCalendarDays,
} from 'date-fns';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';

import { GAME_MODE_DATA } from '../../constants/gameList';
import { getPhTime } from '../../utils/time';
import { WeeklyHeader } from './WeeklyHeader';

const getDate = (month: number, day: number, year: number) =>
  new Date(`${month + 1}-${day}-${year}`);
export const MonthlyCalendar: React.FC<{
  month: number;
  year: number;
  currDate?: Date;
  mode: string;
}> = ({ month, year, currDate = getPhTime(), mode }) => {
  const router = useRouter();
  const date = new Date(`${month + 1}-01-${year}`);
  const numDaysInMonth = getDaysInMonth(date);
  const firstDay = getDay(date);

  const gameModeData = useMemo(() => GAME_MODE_DATA[mode], [mode]);

  return (
    <>
      <SimpleGrid columns={7}>
        <WeeklyHeader />
      </SimpleGrid>
      <Divider my={4} />
      <SimpleGrid columns={7}>
        {[...Array(firstDay).keys()].map((i) => (
          <Box key={i} />
        ))}
        {[...Array(numDaysInMonth).keys()]
          .map((day) => {
            const currDay = day + 1;
            const cDate = getDate(month, currDay, year);
            let roundNum = -1;

            const diffFromStartRound =
              differenceInCalendarDays(
                getPhTime(cDate),
                getPhTime(new Date(gameModeData.startDate))
              ) + 1;

            if (mode !== 'hex') {
              roundNum = diffFromStartRound;
            } else if (
              mode === 'hex' &&
              (isTuesday(cDate) || isFriday(cDate)) &&
              diffFromStartRound > 0
            ) {
              roundNum =
                differenceInCalendarWeeks(
                  getPhTime(cDate),
                  new Date(gameModeData.startDate),
                  {
                    weekStartsOn: 2,
                  }
                ) +
                differenceInCalendarWeeks(
                  getPhTime(cDate),
                  new Date(gameModeData.startDate),
                  {
                    weekStartsOn: 5,
                  }
                ) +
                1;
            }

            return {
              day: currDay,
              date: cDate,
              roundNum: roundNum >= 0 ? roundNum : undefined,
              isFuture: differenceInMilliseconds(currDate, cDate) < 0,
            };
          })
          .map(({ day, date, roundNum, isFuture }) => (
            <Box key={date.toISOString()} p={2}>
              <Button
                boxSize={{ base: '45px', md: '52px' }}
                borderRadius="full"
                userSelect="none"
                cursor="pointer"
                isDisabled={!roundNum || isFuture}
                variant={!roundNum || isFuture ? 'ghost' : 'solid'}
                colorScheme={isSameDay(currDate, date) ? 'blue' : 'gray'}
                onClick={() => {
                  router.push({
                    pathname: gameModeData.path,
                    query: isSameDay(currDate, date)
                      ? {}
                      : { date: format(date, 'yyyy-MM-dd') },
                  });
                }}
              >
                <Stack spacing={0}>
                  <Text>{day}</Text>
                  {!!roundNum && !isFuture && (
                    <Text fontSize="xs" opacity={0.7}>
                      {roundNum}
                    </Text>
                  )}
                </Stack>
              </Button>
            </Box>
          ))}
      </SimpleGrid>
    </>
  );
};
