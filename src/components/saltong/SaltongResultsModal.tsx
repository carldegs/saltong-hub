import {
  Box,
  Button,
  Divider,
  Heading,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalProps,
  Show,
  SimpleGrid,
  Skeleton,
  Stat,
  StatLabel,
  StatNumber,
  StatProps, // useClipboard,
  useColorModeValue,
} from '@chakra-ui/react';
import { intervalToDuration } from 'date-fns';
import { shuffle } from 'lodash';
import { useRouter } from 'next/router';
import { Coins, Share } from 'phosphor-react';
import React, { PropsWithChildren, useMemo, useState } from 'react';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  RadarChart,
} from 'recharts';
import { useInterval } from 'usehooks-ts';

import GAME_MODE_LIST, { GAME_MODE_DATA } from '../../constants/gameList';
import { SALTONG_DATA } from '../../constants/saltong';
import { FirestoreData } from '../../lib/firebase';
import {
  LetterStatus,
  SaltongGame,
  SaltongMode,
  SaltongRound,
} from '../../models/saltong/types';
import { SaltongStatistics } from '../../models/user/types';
import { formatShortDuration } from '../../utils/time';

const CStat: React.FC<
  PropsWithChildren & { colorScheme?: StatProps['colorScheme'] }
> = ({ colorScheme = 'gray', children }) => {
  const bgVal = useColorModeValue('200', '800');
  const textVal = useColorModeValue('700', '200');

  return (
    <Stat
      textAlign="center"
      bg={`${colorScheme}.${bgVal}`}
      color={`${colorScheme}.${textVal}`}
      py={2}
      borderRadius="md"
      userSelect="none"
    >
      {children}
    </Stat>
  );
};

// gameData?: Omit<SaltongGame, keyof FirestoreData>;
// roundData?: SaltongRound;
// gameModeData?: GameModeData;

const getShareStatus = ({
  gameMode,
  history,
  gameId,
  colorMode,
  isSolved,
  timeSolved,
}: {
  gameMode: SaltongMode;
  history: SaltongGame['history'];
  gameId: SaltongRound['id'];
  colorMode: 'dark' | 'light';
  isSolved?: boolean;
  timeSolved?: string;
}) => {
  const grid = history
    .map((row) =>
      row
        .map((cell) => {
          switch (cell[1]) {
            case LetterStatus.correct:
              return '🟩';
            case LetterStatus.wrongSpot:
              return '🟨';
            case LetterStatus.wrong:
              return colorMode === 'dark' ? '⬛' : '⬜';
          }
        })
        .join('')
    )
    .join('\n');

  let gameModeTitle = 'Saltong';

  if (gameMode === 'max') {
    gameModeTitle = 'Saltong Max';
  }

  if (gameMode === 'mini') {
    gameModeTitle = 'Saltong Mini';
  }

  const scoreText = `${isSolved ? history.length : 'X'}/${
    SALTONG_DATA[gameMode].maxTurns
  }`;

  const timeSolvedText = `⌛${timeSolved}`;

  const winStateText = `\n🏅${scoreText}  ${timeSolvedText}`;

  return `${gameModeTitle} ${gameId}${
    isSolved ? winStateText : ` (${scoreText})`
  }

${grid}

${process.env.VERCEL_URL}/play${gameMode !== 'main' ? `/${gameMode}` : ''}`;
};

const Playtime: React.FC<{
  startDate?: number;
  endDate?: number;
  interval: number | null;
}> = ({ startDate, endDate, interval }) => {
  const [currTime, setCurrTime] = useState<Date>(new Date());

  const playtime = useMemo(
    () =>
      startDate
        ? formatShortDuration(
            intervalToDuration({
              start: new Date(startDate || 0),
              end: new Date(endDate || currTime),
            })
          )
        : 'Not Started',
    [currTime, endDate, startDate]
  );

  useInterval(() => {
    setCurrTime(new Date());
  }, interval);

  return (
    <CStat colorScheme="teal">
      <StatLabel opacity={0.7}>PLAYTIME</StatLabel>
      <StatNumber>{playtime || '0s'}</StatNumber>
    </CStat>
  );
};

const SaltongResultsModal: React.FC<
  Omit<ModalProps, 'children'> & {
    gameData?: Omit<SaltongGame, keyof FirestoreData>;
    roundData?: SaltongRound;
    gameMode: SaltongMode;
    statistics?: SaltongStatistics;
  }
> = ({ isOpen, onClose, gameData, roundData, gameMode, statistics }) => {
  const gameModeData = useMemo(() => GAME_MODE_DATA[gameMode], [gameMode]);
  const isDone = useMemo(
    () => !!gameData?.endDate && !!gameData?.startDate,
    [gameData?.endDate, gameData?.startDate]
  );
  const router = useRouter();
  const initialRef = React.useRef(null);
  const randomGames = useMemo(
    () =>
      shuffle(
        GAME_MODE_LIST.filter(({ name }) => gameModeData?.name !== name)
      ).slice(0, 2),
    [gameModeData?.name]
  );
  const colorMode = useColorModeValue('light', 'dark');

  const shareMessage = useMemo(
    () =>
      getShareStatus({
        gameMode,
        history: gameData?.history || [],
        gameId: `${roundData?.roundNum || 0}`,
        colorMode,
        isSolved: gameData?.isSolved,
        timeSolved: formatShortDuration(
          intervalToDuration({
            start: new Date(gameData?.startDate || 0),
            end: new Date(gameData?.endDate || 0),
          })
        ),
      }),
    [
      colorMode,
      gameData?.endDate,
      gameData?.history,
      gameData?.isSolved,
      gameData?.startDate,
      gameMode,
      roundData?.roundNum,
    ]
  );
  // TODO: Implement Share button
  // const { hasCopied, onCopy } = useClipboard(shareMessage);

  const radarData = useMemo(
    () =>
      statistics?.turnWins?.map((winRate, i) => ({
        turnNum: `Turn ${i + 1}`,
        winRate: Math.max(0.05, winRate),
      })),
    [statistics?.turnWins]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      initialFocusRef={initialRef}
    >
      <ModalOverlay />
      <ModalContent pb={4}>
        <ModalCloseButton />
        <ModalBody>
          <Heading fontSize="2xl" textAlign="center" pt={6} pb={4}>
            {isDone ? (gameData?.isSolved ? 'NICE ONE!' : 'AWTSU') : 'PLAYING'}
          </Heading>
          <SimpleGrid columns={isDone ? 2 : 1} spacing={2}>
            {isDone && (
              <CStat colorScheme={gameData?.isSolved ? 'green' : 'red'}>
                <StatLabel opacity={0.7}>TODAY&apos;S WORD</StatLabel>
                <Skeleton isLoaded={!!roundData}>
                  <StatNumber>{roundData?.word?.toUpperCase()}</StatNumber>
                </Skeleton>
              </CStat>
            )}
            <Playtime
              startDate={gameData?.startDate}
              endDate={gameData?.endDate}
              interval={!isDone ? 1000 : null}
            />
          </SimpleGrid>
          <Show below="md">
            <Button
              w="full"
              colorScheme="green"
              leftIcon={<Icon as={Share} />}
              mt={4}
              disabled={isDone}
              onClick={async () => {
                try {
                  await navigator.share({
                    title: `${GAME_MODE_DATA[gameMode].fullName} #${roundData?.roundNum}`,
                    text: shareMessage,
                  });
                } catch (err) {
                  console.error(err);
                }
              }}
            >
              Share
            </Button>
          </Show>
          <Divider mt={6} mb={4} />
          <Heading fontSize="md" letterSpacing="widest" textAlign="center">
            STATISTICS
          </Heading>
          <SimpleGrid columns={3} spacing={2} my={4}>
            <CStat>
              <StatLabel opacity={0.7} fontSize="xs">
                WINS
              </StatLabel>
              <StatNumber fontSize="xl">{statistics?.wins || 0}</StatNumber>
            </CStat>

            <CStat>
              <StatLabel opacity={0.7} fontSize="xs">
                WIN RATE
              </StatLabel>
              <StatNumber fontSize="xl">{`${
                statistics?.gamesPlayed
                  ? (
                      ((statistics?.wins || 0) / statistics?.gamesPlayed) *
                      100
                    ).toFixed(0)
                  : 0
              }%`}</StatNumber>
            </CStat>

            <CStat>
              <StatLabel opacity={0.7} fontSize="xs">
                STREAK
              </StatLabel>
              <StatNumber fontSize="xl">
                {statistics?.winStreak || 0}
              </StatNumber>
            </CStat>
          </SimpleGrid>
          {radarData?.length ? (
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="turnNum" />
                <PolarRadiusAxis />
                <Radar
                  name="Win Rate"
                  dataKey="winRate"
                  stroke="var(--chakra-colors-teal-600)"
                  fill="var(--chakra-colors-teal-600)"
                  fillOpacity={0.7}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <Box py={4} />
          )}
          <Divider mt={0} mb={4} />
          <Heading fontSize="md" letterSpacing="widest" textAlign="center">
            WHAT NEXT
          </Heading>
          {/* TODO: Add share functionality */}
          {/* TODO: Add share options */}
          <SimpleGrid columns={2} mt={4} spacing={2}>
            <Button
              w="full"
              colorScheme="green"
              leftIcon={<Icon as={Share} />}
              disabled={isDone}
            >
              Share
            </Button>
            <Button
              leftIcon={<Icon as={Coins} weight="fill" fontSize="lg" />}
              colorScheme="telegram"
              onClick={() => {
                router.push({ hash: 'contribute' });
              }}
            >
              Contribute
            </Button>
          </SimpleGrid>
          <SimpleGrid columns={{ base: 2, lg: 4 }} mt={3} spacing={2}>
            <Button
              size="sm"
              variant="outline"
              colorScheme="teal"
              onClick={() => {
                router.push('/archives');
              }}
            >
              Archives
            </Button>
            {randomGames.map((gameMode) => (
              <Button
                key={gameMode.name}
                size="sm"
                colorScheme={gameMode.color}
                variant="outline"
                onClick={() => {
                  router.push(gameMode.path);
                }}
              >
                {gameMode.name}
              </Button>
            ))}
            <Button size="sm" colorScheme="twitter" variant="outline">
              Other Games
            </Button>
          </SimpleGrid>
        </ModalBody>
        <Button ref={initialRef} opacity={0} h={0} w={0} p={0} m={0} />
      </ModalContent>
    </Modal>
  );
};

export default SaltongResultsModal;
