import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalProps,
  ModalHeader,
  Box,
  Text,
  Button,
  Flex,
  Link,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import { Download } from 'phosphor-react';
import React from 'react';

import { DONATE_LINK } from '../../constants/links';

const ContributeModal: React.FC<Omit<ModalProps, 'children'>> = (props) => {
  const bg = useColorModeValue('gray.200', 'gray.800');
  return (
    <Modal size="xl" {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Contribute</ModalHeader>
        <ModalCloseButton />
        <ModalBody mb={4}>
          <Box bg={bg} py={4} px={6} borderRadius={8}>
            <Text>
              Saltong started as a fun weekend project that I did while in
              quarantine not expecting that hundreds of thousands of people will
              play the game.
            </Text>

            <br />

            <Text>
              If you enjoyed the game, help contribute to the server costs to
              keep the game ad-free and open for everyone!
            </Text>

            <br />
            <Text>- Carl</Text>
          </Box>
          <Stack direction={{ base: 'column', lg: 'row' }} mt={8} spacing={2}>
            <Link isExternal href={DONATE_LINK} w="full">
              <Button colorScheme="linkedin" bg="#29abe0" size="lg" w="full">
                <Image
                  alt="kofi-logo"
                  src="https://uploads-ssl.webflow.com/5c14e387dab576fe667689cf/61e111774d3a2f67c827cd25_Frame%205.png"
                  w="40px"
                  h="40px"
                  mr={1}
                />
                Ko-fi
              </Button>
            </Link>

            <Popover isLazy>
              <PopoverTrigger>
                <Button colorScheme="facebook" bg="#015add" size="lg" w="full">
                  GCash
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverCloseButton />
                <PopoverBody alignItems="center" as={Flex} flexDir="column">
                  <Image src="/qr.png" alt="qr" />
                  <Button
                    colorScheme="green"
                    leftIcon={<Download fontWeight="bold" />}
                    as="a"
                    href="/qr.png"
                    download="saltong-qr.png"
                    mt={4}
                  >
                    Download QR Code
                  </Button>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ContributeModal;
