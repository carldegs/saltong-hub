import {
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import { SALTONG_DATA } from '../../constants/saltong';
import {
  LetterData,
  LetterStatus,
  SaltongMode,
} from '../../models/saltong/types';
import SaltongRow from './SaltongRow';

const EXAMPLE_1: Record<SaltongMode, LetterData[]> = {
  main: [
    ['S', LetterStatus.wrong],
    ['A', LetterStatus.wrong],
    ['M', LetterStatus.wrong],
    ['P', LetterStatus.correct],
    ['U', LetterStatus.wrong],
  ],
  mini: [
    ['A', LetterStatus.wrong],
    ['N', LetterStatus.correct],
    ['I', LetterStatus.wrong],
    ['M', LetterStatus.wrong],
  ],
  max: [
    ['L', LetterStatus.wrong],
    ['A', LetterStatus.wrong],
    ['B', LetterStatus.wrong],
    ['A', LetterStatus.correct],
    ['N', LetterStatus.wrong],
    ['A', LetterStatus.wrong],
    ['N', LetterStatus.wrong],
  ],
};
const EXAMPLE_1_LETTER = { main: 'P', mini: 'N', max: 'A' };
const EXAMPLE_2: Record<SaltongMode, LetterData[]> = {
  main: [
    ['L', LetterStatus.wrong],
    ['U', LetterStatus.wrongSpot],
    ['P', LetterStatus.wrong],
    ['I', LetterStatus.wrong],
    ['T', LetterStatus.wrong],
  ],
  mini: [
    ['A', LetterStatus.wrong],
    ['R', LetterStatus.wrongSpot],
    ['A', LetterStatus.wrong],
    ['W', LetterStatus.wrong],
  ],
  max: [
    ['A', LetterStatus.wrong],
    ['B', LetterStatus.wrongSpot],
    ['A', LetterStatus.wrong],
    ['N', LetterStatus.wrong],
    ['G', LetterStatus.wrong],
    ['A', LetterStatus.wrong],
    ['N', LetterStatus.wrong],
  ],
};
const EXAMPLE_2_LETTER = { main: 'U', mini: 'R', max: 'B' };
const EXAMPLE_3: Record<SaltongMode, LetterData[]> = {
  main: [
    ['P', LetterStatus.wrong],
    ['U', LetterStatus.wrong],
    ['N', LetterStatus.wrong],
    ['T', LetterStatus.wrong],
    ['A', LetterStatus.wrong],
  ],
  mini: [
    ['M', LetterStatus.wrong],
    ['U', LetterStatus.wrong],
    ['N', LetterStatus.wrong],
    ['A', LetterStatus.wrong],
  ],
  max: [
    ['K', LetterStatus.wrong],
    ['U', LetterStatus.wrong],
    ['T', LetterStatus.wrong],
    ['S', LetterStatus.wrong],
    ['A', LetterStatus.wrong],
    ['R', LetterStatus.wrong],
    ['A', LetterStatus.wrong],
  ],
};

const SaltongHelpModal: React.FC<
  Omit<ModalProps, 'children'> & { gameMode: SaltongMode }
> = ({ isOpen, onClose, gameMode }) => {
  const { t } = useTranslation();
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent pb={4}>
        <ModalCloseButton />
        <ModalHeader>{t('how-to-play')}</ModalHeader>
        <ModalBody>
          <Stack>
            {t('saltong-help.summary', {
              numTries: SALTONG_DATA[gameMode].maxTurns,
              wordLength: SALTONG_DATA[gameMode].wordLen,
            })
              .split('\n\n')
              .map((text) => (
                <Text key={text}>{text}</Text>
              ))}
          </Stack>

          <Divider w="full" my={4} />

          <Text fontWeight="bold" mb={4}>
            {t('examples')}
          </Text>
          <Stack spacing={4}>
            <SaltongRow
              justify="flex-start"
              letters={EXAMPLE_1[gameMode]}
              status="done"
            />
            <Text>
              {t('saltong-help.ex1', {
                letter: EXAMPLE_1_LETTER[gameMode],
              })}
            </Text>

            <SaltongRow
              justify="flex-start"
              letters={EXAMPLE_2[gameMode]}
              status="done"
            />
            <Text>
              {t('saltong-help.ex2', {
                letter: EXAMPLE_2_LETTER[gameMode],
              })}
            </Text>

            <SaltongRow
              justify="flex-start"
              letters={EXAMPLE_3[gameMode]}
              status="done"
            />
            <Text>{t('saltong-help.ex3')}</Text>
          </Stack>

          <Divider w="full" my={4} />

          <Text>{t('saltong-help.schedule')}</Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SaltongHelpModal;
