import { useLocalStorage } from 'usehooks-ts';

const useColorblindMode = () => {
  const state = useLocalStorage('saltong-colorblind-mode', false);

  return state;
};

export default useColorblindMode;
