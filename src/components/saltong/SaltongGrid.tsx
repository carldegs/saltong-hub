import { Input, Stack, useToast } from '@chakra-ui/react';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useClickAnyWhere } from 'usehooks-ts';

import { useSaltong } from '../../hooks/useSaltong';
import { LetterData, LetterStatus } from '../../models/saltong/types';
import SaltongRow from './SaltongRow';

const SaltongGrid: React.FC<
  ReturnType<typeof useSaltong> & { onGameDone: () => void }
> = ({
  wordLen,
  maxTurns,
  turn,
  inputValue,
  solveWord,
  handleInputChange,
  history,
  onGameDone,
  isSolved,
  isGameOver,
}) => {
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [isBlurred, setBlurred] = useState(false);
  const toast = useToast();

  const emptyLetters: LetterData[] = useMemo(
    () => [...Array(wordLen)].map(() => ['', LetterStatus.none]),
    [wordLen]
  );

  const activeLetters: LetterData[] = useMemo(
    () =>
      Object.assign([...new Array(wordLen)], inputValue.split('')).map(
        (val) => [val || '', LetterStatus.none]
      ),
    [inputValue, wordLen]
  );

  const gridLetters = useMemo(() => {
    return Object.assign(
      [...new Array(maxTurns)].map(() => emptyLetters),
      history
    );
  }, [emptyLetters, history, maxTurns]);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useClickAnyWhere(() => {
    if (!isSolved && !isGameOver) {
      inputRef.current.focus();
    }
  });

  return (
    <Stack spacing={2}>
      <Input
        inputMode="none"
        ref={inputRef}
        value={inputValue}
        onChange={(e) => {
          handleInputChange(e.target.value);
        }}
        onKeyDown={(e) => {
          if (
            !e.key.match(/[a-zA-Z]/) ||
            (e.key.length > 1 && e.key !== 'Backspace' && e.key !== 'Enter')
          ) {
            e.preventDefault();
            return;
          }

          if (e.key === 'Enter' && wordLen === inputValue.length) {
            try {
              const { isSolved, isGameOver } = solveWord();
              if (isSolved || isGameOver) {
                onGameDone();
              }
            } catch (err) {
              toast({
                description: (err as Error)?.message,
                status: 'error',
                position: 'top-left',
                isClosable: true,
              });
            }
          }
        }}
        onCut={(e) => e.preventDefault()}
        onCopy={(e) => e.preventDefault()}
        onPaste={(e) => e.preventDefault()}
        opacity={'0 !important'}
        height={0}
        width={0}
        onFocus={() => {
          setBlurred(false);
        }}
        onBlur={() => {
          setTimeout(() => {
            setBlurred(document.activeElement === inputRef.current);
          }, 0);
        }}
        disabled={isSolved || isGameOver}
      />
      {gridLetters.map((val, rowNum) => (
        <SaltongRow
          key={rowNum}
          status={
            turn === rowNum && !(isSolved || isGameOver)
              ? isBlurred
                ? 'active-blur'
                : 'active'
              : rowNum < turn
              ? 'done'
              : 'initial'
          }
          letters={turn === rowNum ? activeLetters : val}
        />
      ))}
    </Stack>
  );
};

export default SaltongGrid;
