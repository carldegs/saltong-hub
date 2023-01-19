import {
  Button,
  DarkMode,
  Heading,
  HStack,
  Icon,
  Skeleton,
  Spacer,
  StackProps,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { Question, Trophy } from 'phosphor-react';
import React from 'react';

import { GameModeData } from '../../constants/gameList';

export const SaltongHeader: React.FC<
  StackProps & {
    isLoading?: boolean;
    gameModeData?: GameModeData;
    roundNum?: number | string;
    onHelpClick?: () => void;
    onResultsClick?: () => void;
  }
> = ({
  isLoading,
  gameModeData = {} as GameModeData,
  roundNum,
  onHelpClick,
  onResultsClick,
  ...props
}) => {
  const { t } = useTranslation('common');
  return (
    <HStack
      w="full"
      spacing={1}
      // color={`${gameModeData.color || 'gray'}.500`}
      letterSpacing="tight"
      {...props}
    >
      <Skeleton isLoaded={!isLoading}>
        <Heading fontSize={{ base: 'md', md: 'xl' }} fontWeight="400">
          Round {`#${roundNum || '??'}`}
        </Heading>
      </Skeleton>
      <Spacer />
      <DarkMode>
        <Button
          size={{ base: 'sm', md: 'md' }}
          leftIcon={<Icon as={Question} weight="duotone" />}
          colorScheme={gameModeData.color}
          variant="solid"
          onClick={onHelpClick}
        >
          {t('saltong-help.help')}
        </Button>
        <Button
          size={{ base: 'sm', md: 'md' }}
          leftIcon={<Icon as={Trophy} weight="duotone" />}
          colorScheme={gameModeData.color}
          variant="solid"
          onClick={onResultsClick}
        >
          {t('results')}
        </Button>
      </DarkMode>
    </HStack>
  );
};
