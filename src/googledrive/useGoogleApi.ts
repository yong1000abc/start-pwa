import {useCallback, useEffect, useState} from 'react';
import {useGoogleCredentials} from './useGoogleCredentials';
import {useScript} from './useScript';

/* eslint-disable */
declare const window: Window & {gapi?: any};

const GOOGLE_API_SCRIPT_URL = 'https://apis.google.com/js/api.js';

export const useGoogleApi = (discoveryDocs: string[]) => {
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const {isFetched: isScriptFetched} = useScript(GOOGLE_API_SCRIPT_URL);
  const {apiKey} = useGoogleCredentials();

  useEffect(() => {
    if (!isScriptFetched) {
      return;
    }

    (async () => {
      await new Promise<void>(resolve => {
        window.gapi.load('client', () => resolve());
      });

      await window.gapi.client.init({
        apiKey,
        discoveryDocs,
      });

      setIsFetched(true);
    })();
  }, [isScriptFetched, apiKey, discoveryDocs]);

  const getToken = useCallback<any>(() => {
    return window.gapi.client.getToken();
  }, []);

  const setToken = useCallback((token: any) => {
    window.gapi.client.setToken(token);
  }, []);

  return {
    isFetched,
    getToken,
    setToken,
    gapi: window.gapi,
  };
};
