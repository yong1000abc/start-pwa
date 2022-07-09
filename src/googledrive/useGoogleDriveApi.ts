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

  const fetchFileContents = async (fileId: string) => {
    try {
      const res = await gapi.client.drive.files.get({
        fileId: fileId,
        alt: 'media',
      });
      const isGZip = res.headers['content-encoding'] === 'gzip';
      return {contents: isGZip ? '파일 사이즈가 커서 다운로드로 대체합니다.' : res.body, isGZip};
    } catch (err) {
      console.error(err);
      return {contents: '', isGZip: false}; 
    }
  };

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
    fetchFileContents,
  };
};
function decodeUnicode(unicodeString: string) {
	var r = /\\u([\d\w]{4})/gi;
	unicodeString = unicodeString.replace(r, function (match, grp) {
	    return String.fromCharCode(parseInt(grp, 16)); } );
	return unescape(unicodeString);
}
