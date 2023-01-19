import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  HStack,
  Circle,
  Icon,
  Stack,
  Button,
  Skeleton,
  useInterval,
  Flex,
  Image,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Archive, ArrowsClockwise, Medal, Trophy } from 'phosphor-react';
import { useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { GameButton } from '../components/GameButton';
import GAME_MODE_LIST, {
  ARCHIVES_DATA,
  GameModeData,
  GAME_MODE_DATA,
} from '../constants/gameList';
import { auth } from '../lib/firebase';
import {
  formatShortDuration,
  getDurationToNextDay,
  getDurationToNextHexGame,
  getTimeOfDay,
} from '../utils/time';

const GAME_SELECTION_LIST = [...GAME_MODE_LIST, ARCHIVES_DATA];

const GameSelection = () => {
  const router = useRouter();
  return (
    <Box bg="gray.100" pt="72px" mt="-72px">
      <Container maxW="container.xl" centerContent py={6}>
        <Text fontWeight="bold" letterSpacing="wider">
          SELECT A GAME TO PLAY
        </Text>
        <SimpleGrid
          columns={[3, 4, Math.min(GAME_SELECTION_LIST.length, 6)]}
          py={6}
          gap={4}
        >
          {GAME_SELECTION_LIST.map((game) => (
            <GameButton
              key={game.name}
              onClick={() => {
                router.push(game.path);
              }}
              {...game}
            />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

const PERKS = [
  {
    title: 'Tuloy ang Laban',
    description:
      'The Cloud Save feature lets you continue your progress on multiple devices - say goodbye to broken streaks!',
    icon: ArrowsClockwise,
    color: 'orange',
  },
  {
    title: 'Competitive yarn?',
    description: 'Get access to the Leaderboard and play against your friends',
    icon: Trophy,
    color: 'orange',
  },
  {
    title: 'Achieve na Achieve!',
    description: 'Earn and collect badges.',
    icon: Medal,
    color: 'orange',
  },
  {
    title: 'Buksan ang Baul',
    description:
      'Unlock the Baul and play previous Saltong games anytime you want',
    icon: Archive,
    color: 'orange',
  },
];

const AccountPerks = () => {
  const router = useRouter();

  return (
    <Container maxW="container.xl" py={8} centerContent>
      <Heading>Wala pang account?</Heading>
      <Text fontSize="xl" mt={2}>
        Create one now and get the following perks
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} pt={8}>
        {PERKS.map(({ title, description, icon: PerkIcon, color }, i) => (
          <HStack
            px={6}
            py={3}
            bg={`${color}.100`}
            key={`perk-${title}`}
            borderRadius="lg"
            spacing={6}
            boxShadow="xs"
            _hover={{
              boxShadow: 'sm',
              transform: `scale(1.05) rotate(${i % 2 ? '-' : ''}0.5deg)`,
            }}
            transition="transform 0.3s cubic-bezier(0.68,-0.55,0.27,1.55); box-shadow 0.3s cubic-bezier(0.68,-0.55,0.27,1.55)"
          >
            <Circle bg={`${color}.100`} color={`${color}.600`} fontSize="4xl">
              <Icon as={() => <PerkIcon weight="duotone" />} />
            </Circle>
            <Stack spacing={1}>
              <Heading fontSize="xl" color={`${color}.600`}>
                {title}
              </Heading>
              <Text maxW="400px" color={`${color}.900`}>
                {description}
              </Text>
            </Stack>
          </HStack>
        ))}
      </SimpleGrid>

      <Button
        colorScheme="green"
        size="lg"
        onClick={() => {
          router.push('/signup');
        }}
        w="full"
        maxW="600px"
        mt={{ base: 4, md: 8 }}
      >
        Sign Up Now!
      </Button>
    </Container>
  );
};

const GameRoundButton: React.FC<GameModeData & { round: number | string }> = ({
  name,
  color,
  path,
  icon,
  // round,
}) => {
  const router = useRouter();
  return (
    <Stack
      align="center"
      p={3}
      w="full"
      maxW="120px"
      borderRadius="lg"
      cursor="pointer"
      onClick={() => {
        router.push(path);
      }}
      _hover={{
        bg: `gray.200`,
      }}
      transition="background 0.3s ease"
    >
      <Image src={icon} alt={`icon-${name}`} boxSize="48px" />
      <Stack spacing={-1}>
        <Text
          letterSpacing="wider"
          fontWeight="bold"
          color={`${color}.600`}
          textAlign="center"
        >
          {`${name.toUpperCase()}`}
        </Text>
        {/* <Text
          letterSpacing="wider"
          fontWeight="bold"
          color={`${color}.600`}
          textAlign="center"
        >
          {`#${round}`}
        </Text> */}
      </Stack>
    </Stack>
  );
};

const DAILY_DASHBOARD_DATA = [
  GAME_MODE_DATA.main,
  GAME_MODE_DATA.max,
  GAME_MODE_DATA.mini,
];

function DailyCountdown() {
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

function BiWeeklyCountdown() {
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

const UserDashboard = () => {
  const [user] = useAuthState(auth);

  return (
    <Container
      maxW="container.xl"
      py={8}
      justifyContent={{ base: 'center', md: 'flex-start' }}
    >
      <Skeleton isLoaded={!!user} w="full" maxW="500px">
        <Heading
          fontSize="2xl"
          textAlign={{ base: 'center', md: 'left' }}
          mb={4}
        >
          Magandang {getTimeOfDay()} {user?.displayName?.split(' ')?.[0]}!
        </Heading>
      </Skeleton>
      <Grid
        gridTemplateColumns={{ base: '1fr', md: '1fr 1fr', lg: '2fr 1fr' }}
        gap={4}
      >
        <DailyCountdown />
        <BiWeeklyCountdown />
      </Grid>
    </Container>
  );
};

export default function Home() {
  const [user, loading] = useAuthState(auth);

  return (
    <>
      <Head>
        <title>Saltong Hub</title>
        <meta name="description" content="The place for Filipino word games" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GameSelection />
      {!user && !loading && <AccountPerks />}
      {(user || (!user && loading)) && <UserDashboard />}
    </>
  );
}
