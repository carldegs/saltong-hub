import {
  Flex,
  Icon,
  Image,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

import { GameModeData } from '../constants/gameList';

export const GameButton: React.FC<
  Omit<GameModeData, 'icon' | 'startDate' | 'key'> & {
    icon: any;
    onClick?: () => void;
    size?: 'sm' | 'md';
  }
> = ({ name, icon, color, onClick, size = 'md' }) => {
  const hoverBg = useColorModeValue('gray.200', 'gray.700');
  return (
    <Stack
      p={3}
      borderRadius="lg"
      _hover={{
        bg: hoverBg,
      }}
      transition="background 0.3s ease"
      align="center"
      cursor="pointer"
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    >
      {typeof icon === 'string' ? (
        <Image
          src={icon}
          alt={`icon-${name}`}
          boxSize={size === 'sm' ? '36px' : '52px'}
        />
      ) : (
        <Flex
          borderRadius="md"
          bg={`${color}.600`}
          boxSize={size === 'sm' ? '36px' : '52px'}
          color="white"
          align="center"
          justify="center"
        >
          <Icon as={icon} fontSize="3xl" />
        </Flex>
      )}
      <Text
        letterSpacing="wider"
        fontWeight="bold"
        color={`${color}.600`}
        textAlign="center"
        fontSize={size === 'sm' ? 'sm' : 'md'}
      >
        {name.toUpperCase()}
      </Text>
    </Stack>
  );
};
