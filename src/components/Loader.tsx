import { Spinner, Stack, Text, TextProps } from '@chakra-ui/react';
import React from 'react';

export const Loader: React.FC<{ color?: TextProps['color'] }> = ({ color }) => (
  <Stack align="center" my={8}>
    <Spinner color={color as any} size="lg" />
    <Text color={color}>Loading...</Text>
  </Stack>
);
