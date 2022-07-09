import {useState} from 'react';
import {digestMessage} from 'src/digestMessage';
import {DriveFile} from 'src/googledrive/DriveFile';
import styled from 'styled-components';
import {DriveFileList} from './DriveFileList';
import {useGoogleDriveApi} from './useGoogleDriveApi';

export const GoogleDriveView = () => {
  const {canSearch, isSignIn, onClickSearch, onClickSignOut, fileListState,
    fileName,
    fileSize,
    fileContents,
    fileHash,
    onClickFile} = useGoogleDriveView();

  return <>
    <Header>
      {canSearch && (
        <button onClick={onClickSearch}>구글 드라이브 조회</button>
      )}
      {isSignIn && <button onClick={onClickSignOut}>로그 아웃</button>}
    </Header>
    <Body>
      <DocList>
        {fileListState?.status === 'error' ? 'error' : (
          <DriveFileList driveFileList={fileListState?.list} onClickFile={onClickFile} />
        )}
      </DocList>
      <EditorContainer>
        <div>{fileName} / {fileSize}</div>
        <div>{fileHash}</div>
        <TextArea readOnly value={fileContents} />
      </EditorContainer>
    </Body>
  </>;
};

const Header = styled.div`
`;

const Body = styled.div`
  display: flex;
  width: 100%;
  height: 600px;
`;

const DocList = styled.div`
  width: 200px;
  flex: none;
`;

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  min-width: 600px;
  flex: 1;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100%;
`;

const useGoogleDriveView = () => {
  const {canSearch, searchFiles, isSignIn, signOut, fileListState} = useGoogleDriveApi();
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [fileHash, setFileHash] = useState<string>('');
  const [fileContents, setFileContents] = useState<string>('');

  const onClickFile = async (driveFile: DriveFile) => {
    const link = document.createElement('a');
    link.setAttribute('href', driveFile.webContentLink);
    link.setAttribute('download', driveFile.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setFileName(driveFile.name);
    setFileSize(driveFile.size);
  };

  return {
    canSearch,
    isSignIn,
    onClickSearch: searchFiles,
    onClickSignOut: signOut,
    fileListState,
    fileName,
    fileSize,
    fileHash,
    onClickFile,
    fileContents,
  };
};
