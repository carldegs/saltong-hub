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
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import { collection, orderBy, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import { GAME_MODE_DATA } from '../../constants/gameList';
import { auth, firestore } from '../../lib/firebase';
import { SaltongMode } from '../../models/saltong/types';
import {
  getGameCollectionName,
  saltongGameConverter,
} from '../../models/saltong/useSaltongGame';
import { getPhTime } from '../../utils/time';
import { Loader } from '../Loader';
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

  const [user] = useAuthState(auth);
  const gameModeData = useMemo(() => GAME_MODE_DATA[mode], [mode]);

  const [data = [], isLoading] = useCollectionData(
    mode && user?.uid
      ? query(
          collection(firestore, getGameCollectionName(mode as SaltongMode)),
          where('uid', '==', user.uid),
          where('dateId', '<=', format(endOfMonth(date), 'yyyy-MM-dd')),
          where('dateId', '>=', format(startOfMonth(date), 'yyyy-MM-dd')),
          orderBy('dateId')
        ).withConverter(saltongGameConverter)
      : undefined
  );

  const results = useMemo(() => {
    return Object.fromEntries(data?.map((r) => [r.dateId, r]));
  }, [data]);

  if (isLoading) {
    return <Loader />;
  }

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

            const cDateId = format(cDate, 'yyyy-MM-dd');

            return {
              day: currDay,
              date: cDate,
              roundNum: roundNum >= 0 ? roundNum : undefined,
              isFuture: differenceInMilliseconds(currDate, cDate) < 0,
              dateId: cDateId,
              result: results[cDateId],
            };
          })
          .map(({ day, date, roundNum, isFuture, dateId, result }) => (
            <Box key={date.toISOString()} p={2}>
              <Button
                boxSize={{ base: '45px', md: '52px' }}
                borderRadius="full"
                userSelect="none"
                cursor="pointer"
                isDisabled={!roundNum || isFuture}
                variant={!roundNum || isFuture ? 'ghost' : 'solid'}
                colorScheme={
                  result?.isSolved
                    ? 'green'
                    : result?.history?.length
                    ? 'orange'
                    : isSameDay(currDate, date)
                    ? 'blue'
                    : 'gray'
                }
                onClick={() => {
                  router.push({
                    pathname: gameModeData.path,
                    query: isSameDay(currDate, date) ? {} : { date: dateId },
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
