import {useState, ChangeEvent, useEffect, useRef} from 'react';
import styled from 'styled-components';

export function FileSystem2View() {
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [fileHash, setFileHash] = useState<string>('');
  const [fileContents, setFileContents] = useState<string>('');

  const onChangeInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFileContents(e.target.value);
  };

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
    const contents = await file.text();
    // console.log(file, file.name, file.size, await digestMessage(contents));
    const _fileHash = await digestMessage(contents);
    setFileHash(_fileHash);
    setFileName(file.name);
    setFileSize(file.size);
    setFileContents(contents);
  };

  const unmountFile = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
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
      <EditorContainer>
        <div>
          <button onClick={showFileSelector}>텍스트 파일 선택</button>
          <HiddenInput ref={inputRef} type={'file'} onChange={onChangeFile} />
        </div>
        <div>{fileName} / {fileSize}</div>
        <div>{fileHash}</div>
        <TextArea onChange={onChangeInput} value={fileContents} />
        <EditorFooter>
          <button disabled={!fileName} onClick={unmountFile}>언마운트</button>
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

async function digestMessage(message: string) {
  const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}