import { Text, useBreakpointValue } from '@chakra-ui/react';
import React from 'react';

const WEEK_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
export const WeeklyHeader: React.FC = () => {
  const weekList = useBreakpointValue([
    WEEK_DAYS.map((w) => w[0]),
    WEEK_DAYS,
  ]) as string[];

  return (
    <>
      {weekList.map((day, i) => (
        <Text
          key={`${day}-${i}`}
          color="gray.500"
          fontWeight="bold"
          textAlign="center"
          letterSpacing="widest"
        >
          {day}
        </Text>
      ))}
    </>
  );
};
