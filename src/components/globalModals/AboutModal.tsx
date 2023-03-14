import {
  Heading,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalProps,
  Text,
  Stack,
  Icon,
  Divider,
  HStack,
  Button,
  Center,
} from '@chakra-ui/react';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { ArrowSquareOut } from 'phosphor-react';
import React from 'react';

import { CONTACT_EMAIL } from '../../constants/links';
import CarldegsLogo from '../icons/CarldegsLogo';

const { publicRuntimeConfig } = getConfig();

const AboutModal: React.FC<Omit<ModalProps, 'children'>> = (props) => {
  const router = useRouter();
  return (
    <Modal size="xl" {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalBody mt={8} mb={4}>
          <Heading
            fontSize="3xl"
            letterSpacing="tighter"
            color="teal"
            textAlign="center"
          >
            Saltong Hub
          </Heading>
          <Text textAlign="center" mt={1} color="gray.500" fontSize="lg">
            v{publicRuntimeConfig?.version}
          </Text>

          <Stack spacing={4} my={6}>
            <Text>
              <b>Saltong</b>, <b>Saltong Mini</b>, and <b>Saltong Max</b> is
              based on the word game{' '}
              <Link
                isExternal
                href="https://www.nytimes.com/games/wordle/index.html"
                fontWeight="bold"
                color="teal"
              >
                Wordle <Icon as={ArrowSquareOut} />
              </Link>
            </Text>

            <Text>
              <b>Saltong Hex</b> is based on the New York Times game{' '}
              <Link
                isExternal
                href="https://www.nytimes.com/puzzles/spelling-bee"
                fontWeight="bold"
                color="teal"
              >
                Spelling Bee <Icon as={ArrowSquareOut} />
              </Link>
            </Text>

            <Text>
              Word list parsed from{' '}
              <Link
                isExternal
                href="https://tagalog.pinoydictionary.com/"
                fontWeight="bold"
                color="teal"
              >
                pinoydictionary.com
              </Link>
            </Text>

            <Text>Additional entries sourced from you!</Text>
          </Stack>

          <Divider />

          <Stack spacing={2} my={6}>
            <Text textAlign="center">
              Saltong Hub depends on your contributions to keep the site running
            </Text>
            <Button
              colorScheme="teal"
              onClick={() => {
                router.push({ hash: 'contribute' });
              }}
              w="full"
            >
              Contribute
            </Button>
          </Stack>

          <Divider />

          <Text
            fontWeight="bold"
            letterSpacing="widest"
            textTransform="uppercase"
            textAlign="center"
            py={6}
          >
            A project by Carl de Guia
          </Text>

          <Center w="full" mb={4}>
            <CarldegsLogo h="24px" />
          </Center>
        </ModalBody>

        <Stack spacing={6} alignItems="center" mb={8}>
          <HStack spacing={4}>
            <Link isExternal href="https://github.com/carldegs/saltong-hub">
              <Button colorScheme="gray">GitHub</Button>
            </Link>
            <Link
              isExternal
              href="https://www.linkedin.com/in/carl-justin-de-guia-b40a1b97/"
            >
              <Button colorScheme="linkedin">LinkedIn</Button>
            </Link>
            <Link isExternal href={`mailto:${CONTACT_EMAIL}`}>
              <Button colorScheme="purple">Email</Button>
            </Link>
          </HStack>
        </Stack>
      </ModalContent>
    </Modal>
  );
};

export default AboutModal;
