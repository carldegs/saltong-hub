import {
  Button,
  Divider,
  Icon,
  Link,
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
import { EnvelopeSimpleOpen, TwitterLogo } from 'phosphor-react';
import React from 'react';

import { MISSING_WORD_FORM, TWITTER_LINK } from '../../constants/links';

const ReportIssuesModal: React.FC<Omit<ModalProps, 'children'>> = (props) => (
  <Modal {...props}>
    <ModalOverlay />
    <ModalContent>
      <ModalCloseButton />
      <ModalHeader>Report Bug</ModalHeader>
      <ModalBody mb={4}>
        <Stack spacing={3}>
          <Text textAlign="center">
            You can report bugs you&apos;ve encountered via
          </Text>
          <Link isExternal href={TWITTER_LINK}>
            <Button
              colorScheme="twitter"
              leftIcon={<Icon as={TwitterLogo} weight="fill" />}
              w="full"
            >
              Twitter DM
            </Button>
          </Link>
          <Link isExternal href="mailto:carl@carldegs.com">
            <Button
              colorScheme="teal"
              leftIcon={<Icon as={EnvelopeSimpleOpen} weight="fill" mt={1} />}
              w="full"
            >
              Email
            </Button>
          </Link>

          <Divider pt={4} />

          <Text textAlign="center" pt={4}>
            Are there missing words from the dictionary? Report it at the
            Saltong Dictionary Reklamo Corner.
          </Text>
          <Link isExternal href={MISSING_WORD_FORM}>
            <Button colorScheme="yellow" w="full">
              Report Missing Word
            </Button>
          </Link>
        </Stack>
      </ModalBody>
    </ModalContent>
  </Modal>
);

export default ReportIssuesModal;
