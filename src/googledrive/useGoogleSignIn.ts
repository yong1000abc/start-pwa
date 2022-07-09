import {useCallback, useEffect, useState} from 'react';
import {useGoogleCredentials} from './useGoogleCredentials';
import {useScript} from './useScript';

/* eslint-disable */
declare const window: Window & {google?: any};

const GOOGLE_SIGN_IN_SCRIPT_URL = 'https://accounts.google.com/gsi/client';

export const useGoogleSignIn = (scope: string) => {
  const [tokenClient, setTokenClient] = useState<any>();
  const {isFetched: isScriptFetched} = useScript(GOOGLE_SIGN_IN_SCRIPT_URL);
  const {clientId} = useGoogleCredentials();

  useEffect(() => {
    if (!isScriptFetched) {
      return;
    }
    setTokenClient(
      window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope,
        callback: '', // defined later
      }),
    );
  }, [isScriptFetched, scope, clientId]);

  const requestAccessToken = useCallback(
    (callback: (res: any) => void, token: any) => {
      tokenClient.callback = callback;

      if (token === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        tokenClient.requestAccessToken({prompt: 'consent'});
      } else {
        // Skip display of account chooser and consent dialog for an existing session.
        tokenClient.requestAccessToken({prompt: ''});
      }
    },
    [tokenClient],
  );

  const revoke = useCallback((accessToken: any) => {
    window.google.accounts.oauth2.revoke(accessToken);
  }, []);

  return {tokenClient, requestAccessToken, revoke};
};
