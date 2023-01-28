import {
  Box,
  Button,
  DarkMode,
  Heading,
  HStack,
  Icon,
  Skeleton,
  Spacer,
  Spinner,
  StackProps,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { Question, Trophy } from 'phosphor-react';
import React from 'react';

import { GameModeData } from '../../constants/gameList';

export const SaltongHeader: React.FC<
  StackProps & {
    isLoading?: boolean;
    isLoadingBg?: boolean;
    gameModeData?: GameModeData;
    roundNum?: number | string;
    onHelpClick?: () => void;
    onResultsClick?: () => void;
  }
> = ({
  isLoading,
  isLoadingBg,
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
        <Box>{isLoadingBg && <Spinner color="gray.300" mr={4} mt={1} />}</Box>
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
