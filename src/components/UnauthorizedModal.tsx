import {
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  ModalProps,
  Stack,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import React from 'react';

const SaltongUnauthorizedModal: React.FC<ModalProps> = ({
  children,
  ...props
}) => {
  const { colorMode } = useColorMode();

  return (
    <Modal size="xl" closeOnEsc={false} closeOnOverlayClick={false} {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody mt={8} mb={4}>
          <Stack
            spacing={0}
            bg={colorMode === 'light' ? 'teal.50' : 'teal.600'}
            color={colorMode === 'light' ? 'teal.700' : 'teal.100'}
            w="full"
            py={8}
            borderRadius="lg"
            mb={4}
          >
            <Heading textAlign="center">OOPS!</Heading>
            <Text fontSize="lg" textAlign="center">
              Create an account or login to access this page
            </Text>
          </Stack>
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SaltongUnauthorizedModal;
