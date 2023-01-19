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
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  SimpleGrid,
  BoxProps,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Portal,
  Stack,
  Text,
  Grid,
  FormControl,
  FormLabel,
  Switch,
} from '@chakra-ui/react';
import {
  motion,
  useMotionValueEvent,
  useScroll,
  Variants,
} from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import {
  BugBeetle,
  HandWaving,
  Lifebuoy,
  List,
  List as ListIcon,
  SignIn,
  SignOut,
} from 'phosphor-react';
import React, { ReactElement, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import GAME_MODE_LIST, { ARCHIVES_DATA } from '../constants/gameList';
import useLogin from '../hooks/useLogin';
import { auth } from '../lib/firebase';
import { GameButton } from './GameButton';

const AUTH_ERR_TOAST = 'auth-err-toast';

const NAVBAR_LIST = [...GAME_MODE_LIST, ARCHIVES_DATA];

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

  if (user) {
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
        router.push('/login');
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

const MENU_OPTIONS = [
  {
    icon: BugBeetle,
    header: 'Report Issues',
    subheader: 'Report bugs and missing words',
    color: 'teal',
  },
  {
    icon: HandWaving,
    header: 'About',
    subheader: 'More info about Saltong Hub',
    color: 'red',
  },
  {
    icon: Lifebuoy,
    header: 'Contribute',
    subheader: 'Help keep the site running!',
    color: 'purple',
  },
];

const NavbarDrawer: React.FC = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const router = useRouter();
  const trans = useTranslation('common');
  const i18n = trans[1];

  const onToggleLanguageClick = (newLocale: string) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  const Content = (
    <>
      <Box w="full">
        <SimpleGrid
          columns={{
            base: 3,
            lg: 6,
          }}
          bg="gray.50"
          mx={{ base: -6, md: -3 }}
          px={{ base: 6, md: 3 }}
          pt={{ base: 8, md: 4 }}
          pb={{ base: 6, md: 4 }}
        >
          {NAVBAR_LIST.map((game) => (
            <GameButton
              key={game.name}
              onClick={() => {
                router.push(game.path);
                onClose();
              }}
              size="sm"
              {...game}
            />
          ))}
          <GameButton
            size="sm"
            name="See All"
            color="blue"
            icon={List}
            path=""
          />
        </SimpleGrid>
      </Box>

      <Grid gridTemplateColumns={{ base: '1fr', lg: '0.55fr 0.45fr' }}>
        <Stack
          my={3}
          borderRight={{
            base: undefined,
            md: '1px solid var(--chakra-colors-gray-200)',
          }}
          pr={2}
          spacing={1}
        >
          <Heading fontSize="sm" ml={3} py={1} letterSpacing="wider">
            PAGES
          </Heading>
          {MENU_OPTIONS.map(({ icon, header, subheader, color }) => (
            <HStack
              borderRadius="md"
              p={3}
              userSelect="none"
              cursor="pointer"
              spacing={3}
              _hover={{ bg: 'gray.100' }}
              key={`menu-option-${header}`}
            >
              <Flex
                align="center"
                justify="center"
                borderRadius="md"
                boxSize="40px"
                bg={`${color}.300`}
              >
                <Icon
                  as={icon}
                  weight="duotone"
                  color={`var(--chakra-colors-${color}-800)`}
                  fontSize="2xl"
                />
              </Flex>
              <Stack spacing={0}>
                <Text fontWeight="bold">{header}</Text>
                <Text fontSize="sm">{subheader}</Text>
              </Stack>
            </HStack>
          ))}
        </Stack>
        <Stack my={3} pl={4} spacing={1}>
          <Heading fontSize="sm" py={1} mb={2} letterSpacing="wider">
            SETTINGS
          </Heading>
          <Stack spacing={6}>
            <FormControl as={Flex} justify="center">
              <FormLabel m={0} mt={0.5} fontWeight="normal">
                Language
              </FormLabel>
              <Spacer />
              <HStack>
                <Button
                  size="sm"
                  colorScheme={i18n.language === 'ph' ? 'teal' : 'gray'}
                  onClick={() => {
                    onToggleLanguageClick('ph');
                  }}
                >
                  🇵🇭
                </Button>
                <Button
                  size="sm"
                  colorScheme={i18n.language === 'en' ? 'teal' : 'gray'}
                  onClick={() => {
                    onToggleLanguageClick('en');
                  }}
                >
                  🇺🇸
                </Button>
              </HStack>
            </FormControl>
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="dark-mode" mb="0" fontWeight="normal">
                Dark Mode
              </FormLabel>
              <Spacer />
              <Switch id="dark-mode" />
            </FormControl>
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="dark-mode" mb="0" fontWeight="normal">
                Colorblind Mode
              </FormLabel>
              <Spacer />
              <Switch id="dark-mode" />
            </FormControl>
          </Stack>
        </Stack>
      </Grid>
    </>
  );

  const Trigger = (
    <IconButton
      as={motion.button}
      variants={{
        small: {
          height: 'var(--chakra-sizes-8)',
        },
      }}
      aria-label="menu"
      onClick={onToggle}
    >
      <Icon as={ListIcon} />
    </IconButton>
  );

  return (
    <>
      <Show below="md">
        {Trigger}
        <Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerBody my={0} pt={0}>
              {Content}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Show>
      <Show above="md">
        <Popover isOpen={isOpen} onClose={onClose}>
          <PopoverTrigger>{Trigger}</PopoverTrigger>
          <Portal>
            <PopoverContent w="full" maxW="600px" right={8} top={4}>
              <PopoverArrow ml={8} />
              <PopoverBody my={0} pt={0}>
                {Content}
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
      </Show>
    </>
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
