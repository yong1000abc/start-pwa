import {DriveFile} from './DriveFile';
import {DriveFileListItem} from './DriveFileListItem';

export function DriveFileList({
  driveFileList = [],
}: {
  driveFileList?: DriveFile[];
}) {
  return (
    <div>
      {driveFileList.map(driveFile => (
        <DriveFileListItem key={driveFile.id} driveFile={driveFile} />
      ))}
    </div>
  );
}
