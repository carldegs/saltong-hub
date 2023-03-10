import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Link,
  Stack,
  useColorMode,
} from '@chakra-ui/react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Spinner } from 'phosphor-react';
import React, { useMemo } from 'react';

import useLogin from '../hooks/useLogin';
import { authProviders } from '../lib/firebase';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const {
    handleLogin,
    authState: [user, loading],
    isPopupOpen,
  } = useLogin();
  const { colorMode } = useColorMode();
  const isLightMode = useMemo(() => colorMode === 'light', [colorMode]);

  if (loading) {
    return (
      <Flex w="full" h="100vh" align="center" justify="center">
        <Spinner />
      </Flex>
    );
  }

  if (user && !user.isAnonymous) {
    router.push((router.query.from as string) || '/');
  }

  return (
    <Box h="100vh" bg={isLightMode ? 'gray.100' : 'gray.800'}>
      <Head>
        <title>Log In | Saltong Hub</title>
        <meta name="description" content="The place for Filipino word games" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxW="container.xl" centerContent>
        <Stack
          my={16}
          bg={isLightMode ? 'white' : 'gray.900'}
          py={6}
          px={8}
          borderRadius="lg"
          align="center"
          w="full"
          maxW="500px"
          boxShadow="sm"
        >
          <Heading
            fontSize="2xl"
            letterSpacing="widest"
            color={isLightMode ? 'teal.600' : 'teal.400'}
            mb={8}
          >
            LOG IN
          </Heading>
          <Stack w="full" spacing={4}>
            {Object.values(authProviders).map(({ name, icon, provider }) => (
              <Button
                key={name}
                size="lg"
                w="full"
                fontSize="md"
                leftIcon={
                  <Image src={icon} alt={`${name}-icon`} boxSize="24px" />
                }
                onClick={() => {
                  handleLogin(provider);
                }}
                isDisabled={isPopupOpen}
              >
                {`Log in with ${name}`}
              </Button>
            ))}
            <Link
              as={NextLink}
              href={
                {
                  pathname: '/signup',
                  query: router.query.from && {
                    from: router.query.from,
                  },
                } as any
              }
              textAlign="center"
              color="teal"
            >
              Don&apos;t have an account? Create one now.
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default LoginPage;
