import axios from 'axios';
import { gunzipSync } from 'fflate';
import { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';

const KEY = 'saltong-hub-dictionary';
const LATEST_DICTIONARY_VERSION = 1;

type Dictionary = Record<number, string[]>;

interface DictionaryLocalStorageData {
  dictionary: Dictionary;
  version: number;
}

const DEFAULT_DICTIONARY_DATA: DictionaryLocalStorageData = {
  dictionary: {
    4: [],
    5: [],
    6: [],
    7: [],
  },
  version: 0,
};

export const fetchDictionary = async () => {
  const { data } = await axios.get('/api/data/dict.gz');
  const unzippedData = gunzipSync(Buffer.from(data, 'base64'));
  const unzippedStr = new TextDecoder().decode(unzippedData);
  const parsed = JSON.parse(unzippedStr) as Record<number, string[]>;
  return parsed;
};

const useDictionary = () => {
  const [dictionary, setDictionary] = useLocalStorage(
    KEY,
    DEFAULT_DICTIONARY_DATA
  );
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const getDictionary = async () => {
      if (
        !dictionary.version ||
        dictionary.version < LATEST_DICTIONARY_VERSION
      ) {
        console.warn('Dictionary is out of date. Fetching latest version...');
        setIsFetching(true);
        const parsed = await fetchDictionary();
        setDictionary({
          dictionary: parsed,
          version: LATEST_DICTIONARY_VERSION,
        });

        setIsFetching(false);
      }
    };

    getDictionary();
  }, [dictionary.version, setDictionary]);

  return [dictionary?.dictionary || {}, isFetching] as const;
};

export default useDictionary;
