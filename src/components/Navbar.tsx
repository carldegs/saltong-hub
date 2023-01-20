import {
  Container,
  Heading,
  Box,
  Button,
  Avatar,
  HStack,
  IconButton,
  useToast,
  Spinner,
  Icon,
  Spacer,
  Show,
  BoxProps,
  Flex,
} from '@chakra-ui/react';
import {
  motion,
  useMotionValueEvent,
  useScroll,
  Variants,
} from 'framer-motion';
import { useRouter } from 'next/router';
import { SignIn, SignOut } from 'phosphor-react';
import React, { ReactElement, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import GAME_MODE_LIST, { ARCHIVES_DATA } from '../constants/gameList';
import useLogin from '../hooks/useLogin';
import { auth } from '../lib/firebase';
import { NavbarDrawer } from './NavbarDrawer';

const AUTH_ERR_TOAST = 'auth-err-toast';

export const NAVBAR_LIST = [...GAME_MODE_LIST, ARCHIVES_DATA];

const ButtonVariants: Variants = {
  large: {
    height: 'var(--chakra-sizes-10)',
    width: 'var(--chakra-sizes-10)',
  },
  small: {
    height: 'var(--chakra-sizes-8)',
    width: 'var(--chakra-sizes-8)',
  },
};

const AuthNav: React.FC = () => {
  const toast = useToast();
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const { handleLogout } = useLogin();

  useEffect(() => {
    if (error && !toast.isActive(AUTH_ERR_TOAST)) {
      toast({
        id: AUTH_ERR_TOAST,
        title: 'Authentication Error',
        description: error.message,
      });
    }
  }, [error, toast]);

  if (loading) {
    return (
      <Spinner
        as={motion.div}
        color="teal"
        variants={{
          large: {
            height: 'var(--chakra-sizes-10)',
            width: 'var(--chakra-sizes-10)',
          },
          small: {
            height: 'var(--chakra-sizes-8)',
            width: 'var(--chakra-sizes-8)',
          },
        }}
      />
    );
  }

  if (user && !user.isAnonymous) {
    return (
      <HStack>
        <Avatar
          as={motion.span}
          name={user.displayName || ''}
          src={user.photoURL || ''}
          variants={ButtonVariants}
        />
        <IconButton
          as={motion.button}
          aria-label="Logout"
          title="Logout"
          colorScheme="teal"
          borderRadius="full"
          onClick={handleLogout}
          variants={ButtonVariants}
        >
          <SignOut />
        </IconButton>
      </HStack>
    );
  }

  return (
    <Button
      as={motion.button}
      rightIcon={<Icon as={SignIn} mt={0.5} />}
      title="Login"
      colorScheme="teal"
      borderRadius="xl"
      onClick={() => {
        router.push({
          pathname: '/login',
          query: { from: router.asPath },
        });
      }}
      variants={{
        large: {
          height: 'var(--chakra-sizes-10)',
        },
        small: {
          height: 'var(--chakra-sizes-8)',
        },
      }}
    >
      Log In
    </Button>
  );
};

const wrapperVariants: Variants = {
  large: {
    paddingTop: 'var(--chakra-space-4)',
    paddingBottom: 'var(--chakra-space-4)',
    background: 'rgba(255,255,255,0)',
  },
  small: {
    paddingTop: 'var(--chakra-space-2)',
    paddingBottom: 'var(--chakra-space-2)',
    background: 'rgba(255,255,255,1)',
  },
};

const DefaultNavbarTitle = (
  <Flex>
    <Heading
      as={motion.h1}
      letterSpacing="tighter"
      color="teal.500"
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
    <Heading
      as={motion.h1}
      letterSpacing="tighter"
      color="teal.500"
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
      Hub
    </Heading>
  </Flex>
);

const Navbar: React.FC<
  BoxProps & { isSmall?: boolean; title?: ReactElement }
> = ({ isSmall, title = DefaultNavbarTitle, ...props }) => {
  const router = useRouter();
  const { scrollY } = useScroll();
  const [small, setSmall] = useState(isSmall);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setSmall(isSmall ? true : latest > 50);
  });

  useEffect(() => {
    setSmall(!!isSmall);
  }, [isSmall]);

  return (
    <Box
      as={motion.nav}
      pos="sticky"
      top={0}
      variants={wrapperVariants}
      initial="large"
      animate={small ? 'small' : 'large'}
      zIndex="banner"
      {...props}
    >
      <Container
        maxW="container.xl"
        as={HStack}
        alignItems="center"
        spacing={3}
      >
        <Box
          as={motion.div}
          userSelect="none"
          cursor="pointer"
          onClick={() => {
            router.push('/');
          }}
        >
          {title}
        </Box>
        <Spacer />
        <Show above="md">
          {NAVBAR_LIST.map((game) => (
            <Button
              variant="ghost"
              colorScheme={game.color}
              letterSpacing="wider"
              fontWeight="bold"
              fontSize="sm"
              key={game.name}
              onClick={() => {
                router.push(game.path);
              }}
            >
              {game.name.toUpperCase()}
            </Button>
          ))}
        </Show>
        <AuthNav />
        <NavbarDrawer />
      </Container>
    </Box>
  );
};

export default Navbar;
