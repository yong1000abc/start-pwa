import {useCallback, useState} from 'react';
import {DriveFile} from './DriveFile';
import {useGoogleApi} from './useGoogleApi';
import {useGoogleSignIn} from './useGoogleSignIn';

/* eslint-disable */
// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC =
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive';

type FileListState = {
  status: 'loading' | 'error' | 'fetched';
  list: DriveFile[];
};

export const useGoogleDriveApi = () => {
  const [isSignIn, setIsSignIn] = useState<boolean>(false);
  const {isFetched, getToken, setToken, gapi} = useGoogleApi([DISCOVERY_DOC]);
  const {tokenClient, requestAccessToken, revoke} = useGoogleSignIn(SCOPES);
  const [fileListState, setFileListState] = useState<FileListState>();

  const fetchFileList = useCallback(() => {
    (async () => {
      try {
        const res = await gapi.client.drive.files.list({
          pageSize: 30,
          fields: 'files(id, name, size, webContentLink)',
        });
        setFileListState({status: 'fetched', list: res.result.files});
      } catch (err) {
        setFileListState({status: 'error', list: []});
      }
    })();
  }, [gapi]);

  const searchFiles = useCallback(() => {
    if (!isFetched || !tokenClient) {
      return;
    }

    requestAccessToken((res: any) => {
      if (res.error !== undefined) {
        throw res;
      }
      setIsSignIn(true);

      fetchFileList();
    }, getToken());
  }, [tokenClient, isFetched, getToken, requestAccessToken, fetchFileList]);

  const signOut = useCallback(() => {
    const token = getToken();
    if (token !== null) {
      revoke(token.access_token);
      setToken('');
    }
  }, [revoke, setToken, getToken]);

  return {
    canSearch: isFetched && tokenClient,
    searchFiles,
    isSignIn,
    signOut,
    fileListState,
  };
};