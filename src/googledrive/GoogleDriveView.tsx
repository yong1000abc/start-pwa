import styled from 'styled-components';
import {DriveFileList} from './DriveFileList';
import {useGoogleDriveApi} from './useGoogleDriveApi';

export const GoogleDriveView = () => {
  const {canSearch, isSignIn, onClickSearch, onClickSignOut, fileListState} = useGoogleDriveView();

  return (
    <div>
      <ButtonRow>
        {canSearch && (
          <button onClick={onClickSearch}>구글 드라이브 조회</button>
        )}
        {isSignIn && <button onClick={onClickSignOut}>로그 아웃</button>}
      </ButtonRow>
      {fileListState?.status === 'error' ? 'error' : (
        <DriveFileList driveFileList={fileListState?.list} />
      )}
    </div>
  );
};

const ButtonRow = styled.div`
  flex-direction: row;
`;

const useGoogleDriveView = () => {
  const {canSearch, searchFiles, isSignIn, signOut, fileListState} =
    useGoogleDriveApi();

  return {
    canSearch,
    isSignIn,
    onClickSearch: searchFiles,
    onClickSignOut: signOut,
    fileListState,
  };
};
