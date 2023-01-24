import {
  Container,
  Tab,
  Tabs,
  TabList,
  TabPanels,
  Select,
  HStack,
  Button,
  IconButton,
  Text,
  Stack,
  Heading,
  useColorMode,
} from '@chakra-ui/react';
import { differenceInYears, getMonth, getYear } from 'date-fns';
import Head from 'next/head';
import Link from 'next/link';
import { CaretLeft, CaretRight } from 'phosphor-react';
import React, { useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { Loader } from '../../components/Loader';
import { MonthlyCalendar } from '../../components/archives/MonthlyCalendar';
import GAME_MODE_LIST from '../../constants/gameList';
import { auth } from '../../lib/firebase';

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
