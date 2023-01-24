import { ThemingProps } from '@chakra-ui/react';
import { Archive } from 'phosphor-react';

// import { Archive } from 'phosphor-react';

export interface GameModeData {
  name: string;
  path: string;
  color: ThemingProps['colorScheme'];
  icon: string;
  fullName?: string;
  startDate: string;
}

export const GAME_MODE_DATA: Record<string, GameModeData> = {
  main: {
    name: 'Saltong',
    path: '/play',
    color: 'green',
    icon: '/icon-192.png',
    startDate: '2022-01-14',
  },
  max: {
    name: 'Max',
    fullName: 'Saltong Max',
    path: '/play/max',
    color: 'red',
    icon: '/max.png',
    startDate: '2022-01-16',
  },
  mini: {
    name: 'Mini',
    fullName: 'Saltong Mini',
    path: '/play/mini',
    color: 'blue',
    icon: '/mini.png',
    startDate: '2022-01-16',
  },
  hex: {
    name: 'Hex',
    fullName: 'Saltong Hex',
    path: '/play/hex',
    color: 'purple',
    icon: '/hex.png',
    startDate: '2022-01-21',
  },
} as const;

export const ARCHIVES_DATA = {
  name: 'Archives',
  path: '/archives',
  color: 'teal',
  icon: Archive,
};

const GAME_MODE_LIST = Object.entries(GAME_MODE_DATA).map(([key, values]) => ({
  key,
  ...values,
}));

export default GAME_MODE_LIST;
