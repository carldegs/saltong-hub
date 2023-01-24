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
  key: string;
}

export const GAME_MODE_DATA: Record<string, GameModeData> = {
  main: {
    name: 'Saltong',
    path: '/play',
    color: 'green',
    icon: '/icon-192.png',
    startDate: '2022-01-14',
    key: 'main',
  },
  max: {
    name: 'Max',
    fullName: 'Saltong Max',
    path: '/play/max',
    color: 'red',
    icon: '/max.png',
    startDate: '2022-01-16',
    key: 'max',
  },
  mini: {
    name: 'Mini',
    fullName: 'Saltong Mini',
    path: '/play/mini',
    color: 'blue',
    icon: '/mini.png',
    startDate: '2022-01-16',
    key: 'mini',
  },
  hex: {
    name: 'Hex',
    fullName: 'Saltong Hex',
    path: '/play/hex',
    color: 'purple',
    icon: '/hex.png',
    startDate: '2022-01-21',
    key: 'hex',
  },
} as const;

export const ARCHIVES_DATA = {
  name: 'Archives',
  path: '/archives',
  color: 'teal',
  icon: Archive,
};

const GAME_MODE_LIST = Object.values(GAME_MODE_DATA);

export default GAME_MODE_LIST;
