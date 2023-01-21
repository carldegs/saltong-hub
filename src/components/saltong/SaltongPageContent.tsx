import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Spacer,
  Stack,
  Text,
  useDisclosure,
  Icon,
} from '@chakra-ui/react';
import { signInAnonymously } from 'firebase/auth';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { X } from 'phosphor-react';
import React, { ReactElement, useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { GAME_MODE_DATA } from '../../constants/gameList';
import { SALTONG_DATA } from '../../constants/saltong';
import { useSaltong } from '../../hooks/useSaltong';
import { useSaltongTheme } from '../../hooks/useSaltongTheme';
import { auth } from '../../lib/firebase';
import {
  LetterData,
  LetterStatus,
  SaltongMode,
} from '../../models/saltong/types';
import { Keyboard } from '../Keyboard';
import { Loader } from '../Loader';
import NavbarLayout from '../layouts/NavbarLayout';
import SaltongGrid from './SaltongGrid';
import { SaltongHeader } from './SaltongHeader';
import SaltongRow from './SaltongRow';

const EXAMPLE_1: Record<SaltongMode, LetterData[]> = {
  main: [
    ['S', LetterStatus.wrong],
    ['A', LetterStatus.wrong],
    ['M', LetterStatus.wrong],
    ['P', LetterStatus.correct],
    ['U', LetterStatus.wrong],
  ],
  mini: [
    ['A', LetterStatus.wrong],
    ['N', LetterStatus.correct],
    ['I', LetterStatus.wrong],
    ['M', LetterStatus.wrong],
  ],
  max: [
    ['L', LetterStatus.wrong],
    ['A', LetterStatus.wrong],
    ['B', LetterStatus.wrong],
    ['A', LetterStatus.correct],
    ['N', LetterStatus.wrong],
    ['A', LetterStatus.wrong],
    ['N', LetterStatus.wrong],
  ],
};

const EXAMPLE_1_LETTER = { main: 'P', mini: 'N', max: 'A' };

const EXAMPLE_2: Record<SaltongMode, LetterData[]> = {
  main: [
    ['L', LetterStatus.wrong],
    ['U', LetterStatus.wrongSpot],
    ['P', LetterStatus.wrong],
    ['I', LetterStatus.wrong],
    ['T', LetterStatus.wrong],
  ],
  mini: [
    ['A', LetterStatus.wrong],
    ['R', LetterStatus.wrongSpot],
    ['A', LetterStatus.wrong],
    ['W', LetterStatus.wrong],
  ],
  max: [
    ['A', LetterStatus.wrong],
    ['B', LetterStatus.wrongSpot],
    ['A', LetterStatus.wrong],
    ['N', LetterStatus.wrong],
    ['G', LetterStatus.wrong],
    ['A', LetterStatus.wrong],
    ['N', LetterStatus.wrong],
  ],
};

const EXAMPLE_2_LETTER = { main: 'U', mini: 'R', max: 'B' };

const EXAMPLE_3: Record<SaltongMode, LetterData[]> = {
  main: [
    ['P', LetterStatus.wrong],
    ['U', LetterStatus.wrong],
    ['N', LetterStatus.wrong],
    ['T', LetterStatus.wrong],
    ['A', LetterStatus.wrong],
  ],
  mini: [
    ['M', LetterStatus.wrong],
    ['U', LetterStatus.wrong],
    ['N', LetterStatus.wrong],
    ['A', LetterStatus.wrong],
  ],
  max: [
    ['K', LetterStatus.wrong],
    ['U', LetterStatus.wrong],
    ['T', LetterStatus.wrong],
    ['S', LetterStatus.wrong],
    ['A', LetterStatus.wrong],
    ['R', LetterStatus.wrong],
    ['A', LetterStatus.wrong],
  ],
};

export const SaltongHelpModal: React.FC<
  Omit<ModalProps, 'children'> & { gameMode: SaltongMode }
> = ({ isOpen, onClose, gameMode }) => {
  const { t } = useTranslation();
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent pb={4}>
        <ModalCloseButton />
        <ModalHeader>{t('how-to-play')}</ModalHeader>
        <ModalBody>
          <Stack>
            {t('saltong-help.summary', {
              numTries: SALTONG_DATA[gameMode].maxTurns,
              wordLength: SALTONG_DATA[gameMode].wordLen,
            })
              .split('\n\n')
              .map((text) => (
                <Text key={text}>{text}</Text>
              ))}
          </Stack>

          <Divider w="full" my={4} />

          <Text fontWeight="bold" mb={4}>
            {t('examples')}
          </Text>
          <Stack spacing={4}>
            <SaltongRow
              justify="flex-start"
              letters={EXAMPLE_1[gameMode]}
              status="done"
            />
            <Text>
              {t('saltong-help.ex1', {
                letter: EXAMPLE_1_LETTER[gameMode],
              })}
            </Text>

            <SaltongRow
              justify="flex-start"
              letters={EXAMPLE_2[gameMode]}
              status="done"
            />
            <Text>
              {t('saltong-help.ex2', {
                letter: EXAMPLE_2_LETTER[gameMode],
              })}
            </Text>

            <SaltongRow
              justify="flex-start"
              letters={EXAMPLE_3[gameMode]}
              status="done"
            />
            <Text>{t('saltong-help.ex3')}</Text>
          </Stack>

          <Divider w="full" my={4} />

          <Text>{t('saltong-help.schedule')}</Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export const SaltongPageContent: React.FC<{
  mode: SaltongMode;
  dateId?: string;
}> = ({ mode, dateId }) => {
  const router = useRouter();
  const data = useSaltong(mode, dateId);
  const { getLetterStatusBaseColor } = useSaltongTheme();
  const keyboardProps = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(data.letterListStatus).map(([key, val]) => [
          key,
          {
            bg: getLetterStatusBaseColor(val),
            color: val !== LetterStatus.none ? 'white' : undefined,
          },
        ])
      ),
    [data.letterListStatus, getLetterStatusBaseColor]
  );
  const helpModal = useDisclosure();
  const [userClosedSignupBanner, setUserClosedSignupBanner] = useState(false);
  const [user, authLoading] = useAuthState(auth, {
    onUserChanged: async (user) => {
      if (!user) {
        await signInAnonymously(auth);
      }
    },
  });
  const showSignupBanner = useMemo(
    () =>
      !userClosedSignupBanner && !authLoading && (!user || user.isAnonymous),
    [authLoading, user, userClosedSignupBanner]
  );

  return (
    <>
      <Head>
        <title>{`${
          data.gameModeData.fullName || data.gameModeData.name
        } | Saltong Hub`}</title>
        {/* TODO: Update Description */}
        <meta name="description" content="The place for Filipino word games" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {showSignupBanner && (
        <Box w="full" bg="blue.200" py={1} fontSize={{ base: 'sm', sm: 'md' }}>
          <Container maxW="container.xl" as={Flex} align="center">
            <Text color="blue.800">
              Sync your stats across multiple devices
            </Text>
            <Spacer />
            <Button
              colorScheme="blue"
              variant="ghost"
              size="sm"
              onClick={() => {
                router.push({
                  pathname: '/signup',
                  query: { from: router.asPath },
                });
              }}
            >
              Sign Up
            </Button>
            <IconButton
              aria-label="close"
              icon={<Icon as={X} />}
              colorScheme="blue"
              variant="ghost"
              size="sm"
              onClick={() => {
                setUserClosedSignupBanner(true);
              }}
            />
          </Container>
        </Box>
      )}
      <SaltongHelpModal gameMode={mode} {...helpModal} />
      <Container
        maxW="container.xl"
        centerContent
        pt={{ base: 2, md: 3 }}
        borderTop={{ base: '1px solid' }}
        borderTopColor={{ base: 'blackAlpha.200' }}
        pb={64}
        overflowY="auto"
      >
        <SaltongHeader
          gameModeData={data?.gameModeData}
          isLoading={data?.isLoading}
          roundNum={data?.roundData?.roundNum}
          mb={{ base: 2, md: 4 }}
          onHelpClick={helpModal.onOpen}
        />
        {data.isLoading ? (
          <Loader color={data.gameModeData.color} />
        ) : (
          <SaltongGrid {...data} />
        )}
      </Container>

      <Box pos="fixed" zIndex={10} mx="auto" bottom={0} w="full">
        <Keyboard
          letterProps={keyboardProps}
          onClick={(key) => {
            if (key === 'Enter') {
              data.solveWord();
            } else {
              data.handleInputChange(
                key === 'Backspace'
                  ? data.inputValue.slice(0, -1)
                  : `${data.inputValue}${key}`
              );
            }
          }}
        />
      </Box>
    </>
  );
};

const SaltongNavbarTitle = (mode: SaltongMode): ReactElement => (
  <Flex>
    <Heading
      as={motion.h1}
      letterSpacing="tighter"
      color={`${GAME_MODE_DATA[mode].color}.500`}
      textTransform="capitalize"
      variants={{
        large: {
          fontSize: 'var(--chakra-fontSizes-2xl)',
        },
        small: {
          fontSize: 'var(--chakra-fontSizes-xl)',
        },
      }}
    >
      Saltong
    </Heading>
    {mode !== 'main' && (
      <Heading
        as={motion.h1}
        letterSpacing="tighter"
        color={`${GAME_MODE_DATA[mode].color}.500`}
        fontWeight="light"
        textTransform="capitalize"
        variants={{
          large: {
            fontSize: 'var(--chakra-fontSizes-2xl)',
          },
          small: {
            fontSize: 'var(--chakra-fontSizes-xl)',
          },
        }}
      >
        {mode}
      </Heading>
    )}
  </Flex>
);

export const getSaltongPageLayout = (mode: SaltongMode) => {
  const getLayout = (page: ReactElement) => (
    <NavbarLayout
      // TODO: Fix typing issue
      navbarProps={{ isSmall: true, title: SaltongNavbarTitle(mode) as any }}
    >
      {page}
    </NavbarLayout>
  );

  return getLayout;
};
