import {useState, ChangeEvent, useEffect, useRef} from 'react';
import styled from 'styled-components';

export function FileSystem2View() {
  const [fileName, setFileName] = useState<string>('');
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
    console.log(file, file.name, file.size, await digestMessage(contents));
    setFileName(file.name);
    setFileContents(contents);
  };

  const unmountFile = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setFileName('');
    setFileContents('');
  };

  useEffect(() => {
    inputRef.current?.click();
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Container>
      <EditorContainer>
        <div>
          텍스트 파일 마운트
          <input ref={inputRef} type={'file'} onChange={onChangeFile} />
          {fileName}
        </div>
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

async function digestMessage(message: string) {
  const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}