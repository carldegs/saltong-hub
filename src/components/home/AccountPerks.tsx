import {
  Container,
  Heading,
  SimpleGrid,
  Text,
  HStack,
  Circle,
  Icon,
  Stack,
  Button,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { Archive, ArrowsClockwise, Medal, Trophy } from 'phosphor-react';

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
export const AccountPerks = () => {
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
          router.push({ pathname: '/signup', query: { from: router.asPath } });
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
