import {useState, ChangeEvent, useEffect, useRef} from 'react';
import {digestMessage} from 'src/digestMessage';
import styled from 'styled-components';
import JSZip from 'jszip';

export function FileSystem2View() {
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [fileHash, setFileHash] = useState<string>('');
  const [fileContents, setFileContents] = useState<string>('');
  const [zip, setZip] = useState<JSZip>();
  const [zipFileNames, setZipFileNames] = useState<string[]>([]);

  const onChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) {
      return;
    }
    try {
      mountFile(files[0]);
    } catch(e) {
      unmountFile();
    }
  };

  const mountFile = async (file: File) => {
    unmountFile(false);

    switch (file.type) {
    case 'text/plain':
      const contents = await file.text();
      const _fileHash = await digestMessage(contents);
      setFileHash(_fileHash);
      setFileName(file.name);
      setFileSize(file.size);
      setFileContents(contents);
      break;
    case 'application/zip':
      new JSZip().loadAsync(file)
        .then(async function(_zip) {
          const zipFiles: JSZip.JSZipObject[] = [];
          _zip.forEach((relativePath, file) => {
            if (!file.name.startsWith('__MACOSX/')) {
              zipFiles.push(file);
            }
          });
          zipFiles.sort((a, b) => {
            return a.date.getTime() - b.date.getTime();
          });
          const _zipFileNames = zipFiles.map(file => file.name);
          setZip(_zip);
          setZipFileNames(_zipFileNames);
          mountZipFile(_zipFileNames[0]);
        });
      break;
    }
  };

  const mountZipFile = async (_zipFileName: string) => {
    console.log(_zipFileName);
    const _contents = await zip?.file(_zipFileName)?.async('string');
    if (_contents) {
      console.log(_contents);
      const _fileHash = await digestMessage(_contents);
      setFileHash(_fileHash);
      setFileName(_zipFileName);
      setFileSize(_contents.length);
      setFileContents(_contents);
    }
  };

  const unmountFile = (clearInput = true) => {
    if (clearInput && inputRef.current) {
      inputRef.current.value = '';
    }
    setZip(undefined);
    setZipFileNames([]);
    setFileHash('');
    setFileName('');
    setFileSize(0);
    setFileContents('');
  };

  useEffect(() => {
    showFileSelector();
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);
  const showFileSelector = () => {
    inputRef.current?.click();
  };

  return (
    <Container>
      {
        zip && zipFileNames.length &&
        <ZipFilesContainer>
          {zipFileNames.map(zipFileName => {
            return (
              <ClickableDiv key={zipFileName} onClick={() => mountZipFile(zipFileName)}>{zipFileName}</ClickableDiv>
            );
          })}
        </ZipFilesContainer>
      }
      <EditorContainer>
        <div>
          <button onClick={showFileSelector}>텍스트 파일 선택</button>
          <HiddenInput ref={inputRef} type={'file'} onChange={onChangeFile} />
        </div>
        <div>{fileName} / {fileSize}</div>
        <div>{fileHash}</div>
        <TextArea readOnly value={fileContents} />
        <EditorFooter>
          <button disabled={!fileName} onClick={() => unmountFile()}>언마운트</button>
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

const ZipFilesContainer = styled.div`
  width: 200;
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

const HiddenInput = styled.input`
  display: none;
`;

const ClickableDiv = styled.div`
  cursor: pointer;
`;