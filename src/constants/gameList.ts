import { ThemingProps } from '@chakra-ui/react';
import { Archive } from 'phosphor-react';

// import { Archive } from 'phosphor-react';

export interface GameModeData {
  name: string;
  path: string;
  color: ThemingProps['colorScheme'];
  icon: string;
  fullName?: string;
}

export const GAME_MODE_DATA: Record<string, GameModeData> = {
  main: {
    name: 'Saltong',
    path: '/play',
    color: 'green',
    icon: '/icon-192.png',
  },
  max: {
    name: 'Max',
    fullName: 'Saltong Max',
    path: '/play/max',
    color: 'red',
    icon: '/max.png',
  },
  mini: {
    name: 'Mini',
    fullName: 'Saltong Mini',
    path: '/play/mini',
    color: 'blue',
    icon: '/mini.png',
  },
  hex: {
    name: 'Hex',
    fullName: 'Saltong Hex',
    path: '/play/hex',
    color: 'purple',
    icon: '/hex.png',
  },
};

export const ARCHIVES_DATA = {
  name: 'Archives',
  path: '/archives',
  color: 'teal',
  icon: Archive,
};

const GAME_MODE_LIST = Object.values(GAME_MODE_DATA);

export default GAME_MODE_LIST;
