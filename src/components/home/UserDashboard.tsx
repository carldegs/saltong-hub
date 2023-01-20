import { Container, Heading, Skeleton, Grid } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from '../../lib/firebase';
import { getTimeOfDay } from '../../utils/time';
import { BiWeeklyCountdown } from './BiWeeklyCountdown';
import { DailyCountdown } from './DailyCountdown';

export const UserDashboard = () => {
  const [user] = useAuthState(auth);

  const [welcomeMessage, setWelcomeMessage] = useState('');

  useEffect(() => {
    if (user?.displayName) {
      setWelcomeMessage(
        `Magandang ${getTimeOfDay()} ${user.displayName?.split(' ')?.[0]}!`
      );
    }
  }, [user?.displayName]);

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
          {welcomeMessage}
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
