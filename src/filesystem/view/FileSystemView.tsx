import {useState, ChangeEvent} from 'react';
import {ExtendedFileSystemEntry, ExtendedFileSystemFileHandle, FileSystemAgent} from 'src/filesystem/agent/FileSystemAgent';
import styled from 'styled-components';

export function FileSystemView() {
  const [fileHandle, setFileHandle] = useState<ExtendedFileSystemFileHandle>();
  const [fileName, setFileName] = useState<string>('');
  const [fileContents, setFileContents] = useState<string>('');
  const [directoryEntries, setDirectoryEntries] = useState<ExtendedFileSystemEntry[]>([]);

  const onChangeInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFileContents(e.target.value);
  };

  const onClickSelectFile = async () => {
    const _fileHandle = await FileSystemAgent.showOpenFilePicker({types: [{description: 'Select File', accept: {'text/plain': ['.txt']}}]});
    if (!_fileHandle) {
      return;
    }
    try {
      const file = await _fileHandle.getFile();
      mountFile(file, _fileHandle);
    } catch(e) {
      unmountFile();
    }
  };

  const mountFile = async (file: File, _fileHandle?: ExtendedFileSystemFileHandle) => {
    const contents = await file.text();
    setFileHandle(_fileHandle);
    setFileName(file.name);
    setFileContents(contents);
  };

  const unmountFile = () => {
    setFileHandle(undefined);
    setFileName('');
    setFileContents('');
  };

  const onClickSave = () => {
    if (fileHandle) {
      FileSystemAgent.writeFile(fileHandle, fileContents);
    }
  };

  const onClickShowDirectory = async () => {
    const dirHandle = await FileSystemAgent.showDirectoryPicker();
    const _directoryEntries = [];
    for await (const entry of dirHandle.values()) {
      _directoryEntries.push(entry);
    }
    setDirectoryEntries(_directoryEntries);
  };

  const onClickFileInDirectory = async (entry: ExtendedFileSystemEntry) => {
    if (entry.kind === 'file') {
      const _directoryEntries = directoryEntries;
      const file = await entry.getFile();
      if (_directoryEntries === directoryEntries) {
        mountFile(file);
      }
    }
  };

  return (
    <Container>
      <DirectoryContainer>
        <button onClick={onClickShowDirectory}>디렉토리 선택</button>
        <div>
          {directoryEntries.map(entry => {
            const description = `${entry.kind}-${entry.name}`;
            return (
              <div
                key={description}
                onClick={() => onClickFileInDirectory(entry)}
              >
                {description}
              </div>
            );
          })}
        </div>
      </DirectoryContainer>
      <EditorContainer>
        <div>
          <button onClick={onClickSelectFile}>텍스트 파일 마운트</button>
          {fileName}
        </div>
        <TextArea onChange={onChangeInput} value={fileContents} />
        <EditorFooter>
          <button disabled={!fileName} onClick={unmountFile}>언마운트</button>
          <button disabled={!fileHandle} onClick={onClickSave}>저장</button>
        </EditorFooter>
      </EditorContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 600px;
`;

const DirectoryContainer = styled.div`
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

const EditorFooter = styled.div`
  width: 100%;
  display: flex;
  justify-content: end;
`;