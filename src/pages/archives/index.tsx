import {
  Container,
  Tab,
  Tabs,
  TabList,
  TabPanels,
  Box,
  Select,
  HStack,
  Button,
  IconButton,
  SimpleGrid,
  Text,
  Divider,
  Stack,
  useBreakpointValue,
  Heading,
  useColorMode,
} from '@chakra-ui/react';
import {
  differenceInDays,
  differenceInMilliseconds,
  differenceInYears,
  getDay,
  getDaysInMonth,
  getMonth,
  getYear,
  isSameDay,
  format,
  isTuesday,
  isFriday,
  differenceInCalendarWeeks,
} from 'date-fns';
import Head from 'next/head';
import Link from 'next/link';
import { CaretLeft, CaretRight } from 'phosphor-react';
import React, { useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { Loader } from '../../components/Loader';
import GAME_MODE_LIST, { GAME_MODE_DATA } from '../../constants/gameList';
import { auth } from '../../lib/firebase';
import { getPhTime } from '../../utils/time';

const WEEK_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const WeeklyHeader: React.FC = () => {
  const weekList = useBreakpointValue([
    WEEK_DAYS.map((w) => w[0]),
    WEEK_DAYS,
  ]) as string[];

  return (
    <>
      {weekList.map((day, i) => (
        <Text
          key={`${day}-${i}`}
          color="gray.500"
          fontWeight="bold"
          textAlign="center"
          letterSpacing="widest"
        >
          {day}
        </Text>
      ))}
    </>
  );
};

const getDate = (month: number, day: number, year: number) =>
  new Date(`${month + 1}-${day}-${year}`);

const MonthlyCalendar: React.FC<{
  month: number;
  year: number;
  currDate?: Date;
  mode: string;
}> = ({ month, year, currDate = getPhTime(), mode }) => {
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

            const diffFromStartRound = differenceInDays(
              getPhTime(cDate),
              new Date(gameModeData.startDate)
            );

            if (mode !== 'hex') {
              roundNum = diffFromStartRound;
            } else if (
              mode === 'hex' &&
              (isTuesday(cDate) || isFriday(cDate)) &&
              diffFromStartRound >= 0
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
                as={Link}
                href={{
                  pathname: gameModeData.path,
                  query: isSameDay(currDate, date)
                    ? {}
                    : { date: format(date, 'yyyy-MM-dd') },
                }}
                boxSize={{ base: '45px', md: '52px' }}
                borderRadius="full"
                userSelect="none"
                cursor="pointer"
                isDisabled={!roundNum || isFuture}
                variant={!roundNum || isFuture ? 'ghost' : 'solid'}
                colorScheme={isSameDay(currDate, date) ? 'blue' : 'gray'}
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

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const YEARS = [
  ...Array(differenceInYears(new Date(), new Date('01-01-2022')) + 1).keys(),
].map((_, i) => i + 2022);

const INIT_MONTH = 0;
const INIT_YEAR = 2022;

const ArchivesPage: React.FC = () => {
  const currMonth = useMemo(() => getMonth(new Date()), []);
  const currYear = useMemo(() => getYear(new Date()), []);
  const [user, loading] = useAuthState(auth);

  const [tabIndex, setTabIndex] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(currMonth);
  const [selectedYear, setSelectedYear] = useState(currYear);
  const selectedGameMode = useMemo(
    () => GAME_MODE_LIST[tabIndex].key,
    [tabIndex]
  );
  const { colorMode } = useColorMode();

  const monthOptions = useMemo(
    () =>
      selectedYear === getYear(new Date())
        ? MONTHS.slice(0, getMonth(new Date()) + 1)
        : MONTHS,
    [selectedYear]
  );

  if (loading) {
    return <Loader />;
  }

  if (!loading && (!user || user.isAnonymous)) {
    return (
      <Container maxW="container.sm" centerContent mt={8}>
        <Stack
          spacing={0}
          bg={colorMode === 'light' ? 'teal.50' : 'teal.600'}
          color={colorMode === 'light' ? 'teal.700' : 'teal.100'}
          w="full"
          py={8}
          borderRadius="lg"
        >
          <Heading textAlign="center">OOPS!</Heading>
          <Text fontSize="lg" textAlign="center">
            Create an account to access this page
          </Text>
        </Stack>
        <Stack spacing={4} mt={8} w="full">
          <Link href={{ pathname: '/signup', query: { from: '/archives' } }}>
            <Button w="full" colorScheme="teal">
              Create Account
            </Button>
          </Link>
          <Link href={{ pathname: '/login', query: { from: '/archives' } }}>
            <Button w="full">Log In</Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" w="full">
              Back to Home
            </Button>
          </Link>
        </Stack>
      </Container>
    );
  }

  return (
    <>
      <Head>
        <title>Archives | Saltong Hub</title>
        {/* TODO: Update Description */}
        <meta name="description" content="The place for Filipino word games" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Tabs
        align="center"
        isFitted
        index={tabIndex}
        onChange={(index) => {
          setTabIndex(index);
        }}
      >
        <TabList px={4}>
          {GAME_MODE_LIST.map(({ name }) => (
            <Tab key={name}>{name}</Tab>
          ))}
        </TabList>

        <TabPanels>
          <Container maxW="container.md">
            <HStack my={8} justify="center">
              <IconButton
                icon={<CaretLeft />}
                aria-label="Prev Month"
                isDisabled={
                  INIT_YEAR === selectedYear && INIT_MONTH === selectedMonth
                }
                onClick={() => {
                  if (selectedMonth === 0) {
                    setSelectedMonth(11);
                    setSelectedYear((curr) => curr - 1);
                  } else {
                    setSelectedMonth((curr) => curr - 1);
                  }
                }}
              />
              <Select
                maxW="150px"
                w="full"
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(+e.target.value);
                }}
              >
                {monthOptions.map((month, i) => (
                  <option value={i} key={month}>
                    {month}
                  </option>
                ))}
              </Select>
              <Select
                maxW="150px"
                w="full"
                value={selectedYear}
                onChange={(e) => {
                  const newYear = +e.target.value;
                  setSelectedYear(newYear);

                  if (currYear === newYear && selectedMonth > currMonth) {
                    setSelectedMonth(currMonth);
                  }
                }}
              >
                {YEARS.map((year) => (
                  <option value={year} key={year}>
                    {year}
                  </option>
                ))}
              </Select>{' '}
              <IconButton
                icon={<CaretRight />}
                aria-label="Next Month"
                isDisabled={
                  selectedMonth === currMonth && selectedYear === currYear
                }
                onClick={() => {
                  if (selectedMonth === 11) {
                    setSelectedMonth(0);
                    setSelectedYear((curr) => curr + 1);
                  } else {
                    setSelectedMonth((curr) => curr + 1);
                  }
                }}
              />
            </HStack>
            <MonthlyCalendar
              month={selectedMonth}
              year={selectedYear}
              mode={selectedGameMode}
            />
          </Container>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default ArchivesPage;
