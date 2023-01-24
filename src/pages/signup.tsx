import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
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
import { useInterval } from 'usehooks-ts';

import useLogin from '../hooks/useLogin';
import { authProviders } from '../lib/firebase';

const SignupPage: React.FC = () => {
  const router = useRouter();
  const {
    handleLogin,
    authState: [user, loading],
    isPopupOpen,
    error,
  } = useLogin(true);
  const errorMessage = useMemo(() => {
    switch (error?.code) {
      case 'auth/credential-already-in-use':
        return 'Account already created. Log in instead.';
      default:
        return error?.message;
    }
  }, [error?.code, error?.message]);
  const { colorMode } = useColorMode();
  const isLightMode = useMemo(() => colorMode === 'light', [colorMode]);

  useInterval(() => {
    if (user && !user.isAnonymous) {
      router.push((router.query.from as string) || '/');
    }
  }, 1000);

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
        <title>Sign Up | Saltong Hub</title>
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
            SIGN UP
          </Heading>
          {errorMessage && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
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
                onClick={async () => {
                  await handleLogin(provider);
                }}
                isDisabled={isPopupOpen}
              >
                {`Sign up with ${name}`}
              </Button>
            ))}
            <Link
              as={NextLink}
              href={
                {
                  pathname: '/login',
                  query: router.query.from && {
                    from: router.query.from,
                  },
                } as any
              }
              textAlign="center"
              color="teal"
            >
              Already have an account? Log in instead.
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default SignupPage;
