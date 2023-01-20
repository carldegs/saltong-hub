import {
  Heading,
  Box,
  Button,
  HStack,
  IconButton,
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
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import {
  BugBeetle,
  HandWaving,
  Lifebuoy,
  List,
  List as ListIcon,
} from 'phosphor-react';
import React from 'react';

import { GameButton } from './GameButton';
import { NAVBAR_LIST } from './Navbar';

// TODO: MOVE
export const MENU_OPTIONS = [
  {
    icon: BugBeetle,
    header: 'Report Issues',
    subheader: 'Report bugs and missing words',
    color: 'teal',
    hash: 'report',
  },
  {
    icon: HandWaving,
    header: 'About',
    subheader: 'More info about Saltong Hub',
    color: 'red',
    hash: 'about',
  },
  {
    icon: Lifebuoy,
    header: 'Contribute',
    subheader: 'Help keep the site running!',
    color: 'purple',
    hash: 'contribute',
  },
];

export const NavbarDrawer: React.FC = () => {
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
          {MENU_OPTIONS.map(({ icon, header, subheader, color, hash }) => (
            <HStack
              borderRadius="md"
              p={3}
              userSelect="none"
              cursor="pointer"
              spacing={3}
              _hover={{ bg: 'gray.100' }}
              key={`menu-option-${header}`}
              onClick={() => {
                router.push({ hash });
                onClose();
              }}
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
        <Drawer isOpen={isOpen} onClose={onClose} placement="top">
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
