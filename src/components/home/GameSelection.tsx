import {
  Box,
  Container,
  SimpleGrid,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

import GAME_MODE_LIST, { ARCHIVES_DATA } from '../../constants/gameList';
import { GameButton } from '../GameButton';

const GAME_SELECTION_LIST = [...GAME_MODE_LIST, ARCHIVES_DATA];
export const GameSelection = () => {
  const router = useRouter();
  const bg = useColorModeValue('gray.100', 'gray.900');
  return (
    <Box bg={bg} pt="72px" mt="-72px">
      <Container maxW="container.xl" centerContent py={6}>
        <Text fontWeight="bold" letterSpacing="wider">
          SELECT A GAME TO PLAY
        </Text>
        <SimpleGrid
          columns={[3, 4, Math.min(GAME_SELECTION_LIST.length, 6)]}
          py={6}
          gap={4}
        >
          {GAME_SELECTION_LIST.map((game) => (
            <GameButton
              key={game.name}
              onClick={() => {
                router.push(game.path);
              }}
              {...game}
            />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};
