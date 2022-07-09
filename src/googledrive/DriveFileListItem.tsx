import {DriveFile} from './DriveFile';

export function DriveFileListItem({driveFile}: {driveFile: DriveFile}) {
  return (
    <a href={driveFile.webContentLink} target={'_blank'} rel="noreferrer">
      {driveFile.name}
    </a>
  );
}
