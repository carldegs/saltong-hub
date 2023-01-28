import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
  Spacer,
  Stack,
  Text,
  useDisclosure,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { signInAnonymously } from 'firebase/auth';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { X } from 'phosphor-react';
import React, { ReactElement, useMemo, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { GAME_MODE_DATA } from '../../constants/gameList';
import { useSaltong } from '../../hooks/useSaltong';
import { useSaltongTheme } from '../../hooks/useSaltongTheme';
import { auth } from '../../lib/firebase';
import { LetterStatus, SaltongMode } from '../../models/saltong/types';
import { getPhTime } from '../../utils/time';
import { Keyboard } from '../Keyboard';
import { Loader } from '../Loader';
import NavbarLayout from '../layouts/NavbarLayout';
import SaltongGrid from './SaltongGrid';
import { SaltongHeader } from './SaltongHeader';
import SaltongHelpModal from './SaltongHelpModal';

const UnathorizedModal = React.lazy(() => import('../UnauthorizedModal'));

export const SaltongPageContent: React.FC<{
  mode: SaltongMode;
  dateId?: string;
}> = ({ mode, dateId }) => {
  const router = useRouter();
  const [user, authLoading] = useAuthState(auth, {
    onUserChanged: async (user) => {
      if (!user) {
        await signInAnonymously(auth);
      }
    },
  });

  const id = useMemo(() => {
    if (dateId) {
      return dateId;
    }

    if (router.query.date && typeof router.query.date === 'string') {
      if (!authLoading && (!user || user.isAnonymous)) {
        return undefined;
      }

      return router.query.date;
    }

    return format(getPhTime(), 'yyyy-MM-dd');
  }, [authLoading, dateId, router.query.date, user]);

  const data = useSaltong(mode, id);
  const { getLetterStatusBaseColor } = useSaltongTheme();
  const toast = useToast();
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

  const showSignupBanner = useMemo(
    () =>
      !userClosedSignupBanner && !authLoading && (!user || user.isAnonymous),
    [authLoading, user, userClosedSignupBanner]
  );

  const showUnauthorizedModal = useMemo(
    () => !!router.query.date && !authLoading && (!user || user?.isAnonymous),
    [authLoading, router.query.date, user]
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
      {showUnauthorizedModal && (
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        <UnathorizedModal isOpen={showUnauthorizedModal} onClose={() => {}}>
          <Stack w="full" spacing={2}>
            <Text textAlign="center" pb={4}>
              You need an account to play previous rounds of{' '}
              {data.gameModeData.fullName || data.gameModeData.name}
            </Text>
            <Stack
              direction={{ base: 'column', md: 'row' }}
              spacing={2}
              align="center"
            >
              <Button
                as={Link}
                href={{ pathname: '/signup', query: { from: router.asPath } }}
                colorScheme="teal"
                w="full"
              >
                Create Account
              </Button>
              <Button
                as={Link}
                href={{ pathname: '/login', query: { from: router.asPath } }}
                w="full"
              >
                Sign In
              </Button>
            </Stack>
            <Button as={Link} href={{ pathname: router.pathname }}>
              Play Today&apos;s Game
            </Button>
            <Button as={Link} href="/" variant="ghost" size="sm">
              Back To Home
            </Button>
          </Stack>
        </UnathorizedModal>
      )}
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
      {helpModal.isOpen && <SaltongHelpModal gameMode={mode} {...helpModal} />}
      <Container
        maxW="container.xl"
        centerContent
        pt={{ base: 2, md: 3 }}
        borderTop={{ base: '1px solid' }}
        borderTopColor={{ base: 'blackAlpha.200' }}
        pb={64}
        overflowY="auto"
        pos="relative"
      >
        <SaltongHeader
          gameModeData={data?.gameModeData}
          isLoading={data?.isLoading}
          isLoadingBg={data?.isLoadingBackground}
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
              try {
                data.solveWord();
              } catch (err) {
                toast({
                  description: (err as Error)?.message,
                  status: 'error',
                  position: 'top-left',
                  duration: 1000,
                  isClosable: true,
                });
              }
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
