import { BoxProps, Container, Flex, Spacer, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ArrowElbowDownLeft, Backspace } from 'phosphor-react';
import React from 'react';

interface Props {
  letterProps?: Record<string, BoxProps>;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onClick?: (letter: 'Enter' | 'Backspace' | String) => void;
}
const keyboardRows = ['qwertyuiop', '_asdfghjkl_', '*zxcvbnm<'];
export const Keyboard: React.FC<Props> = ({ letterProps, onClick }) => {
  return (
    <Container
      maxW="container.sm"
      centerContent
      py={1}
      px={{ base: 1 }}
      bg="white"
    >
      {keyboardRows.map((row, i) => (
        <Flex key={i} w="full" justify="center" align="center" my={1}>
          {row.split('').map((key, i) =>
            key === '_' ? (
              <Spacer w="15px" key={`${key}-${i}`} />
            ) : (
              <Flex
                key={key}
                as={motion.div}
                textTransform="capitalize"
                maxW={{
                  base: '43px',
                  md: key === '<' || key === '*' ? '70px' : '43px',
                }}
                minW={key === '<' || key === '*' ? '40px' : ''}
                w="full"
                h="58px"
                align="center"
                justify="center"
                cursor="pointer"
                bg="gray.100"
                mx={1}
                borderRadius="md"
                whileHover={{ scale: 1.1 }}
                onClick={() => {
                  if (onClick) {
                    onClick(
                      key === '<' ? 'Backspace' : key === '*' ? 'Enter' : key
                    );
                  }
                }}
                {...(letterProps?.[key] || {})}
              >
                {key === '<' ? (
                  <Backspace weight="bold" />
                ) : key === '*' ? (
                  <ArrowElbowDownLeft weight="bold" />
                ) : (
                  <Text
                    textAlign="center"
                    fontSize="xl"
                    fontWeight="semibold"
                    userSelect="none"
                  >
                    {key}
                  </Text>
                )}
              </Flex>
            )
          )}
        </Flex>
      ))}
    </Container>
  );
};
