import { Text, Stack, Image } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { GameModeData } from '../../constants/gameList';

export const GameRoundButton: React.FC<
  GameModeData & { round: number | string }
> = ({
  name,
  color,
  path,
  icon,
  // round,
}) => {
  const router = useRouter();
  return (
    <Stack
      align="center"
      p={3}
      w="full"
      maxW="120px"
      borderRadius="lg"
      cursor="pointer"
      onClick={() => {
        router.push(path);
      }}
      _hover={{
        bg: `gray.200`,
      }}
      transition="background 0.3s ease"
    >
      <Image src={icon} alt={`icon-${name}`} boxSize="48px" />
      <Stack spacing={-1}>
        <Text
          letterSpacing="wider"
          fontWeight="bold"
          color={`${color}.600`}
          textAlign="center"
        >
          {`${name.toUpperCase()}`}
        </Text>
      </Stack>
    </Stack>
  );
};
