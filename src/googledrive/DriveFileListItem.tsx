import styled from 'styled-components';
import {DriveFile} from './DriveFile';

export function DriveFileListItem({driveFile, onClick}: {driveFile: DriveFile; onClick: (driveFile: DriveFile) => void;}) {
  return (
    <Container onClick={() => onClick(driveFile)}>
      {driveFile.name}
    </Container>
  );
}

const Container = styled.div`
  cursor: pointer;
`;