import {DriveFile} from './DriveFile';
import {DriveFileListItem} from './DriveFileListItem';

export function DriveFileList({
  driveFileList = [],
  onClickFile,
}: {
  driveFileList?: DriveFile[];
  onClickFile: (driveFile: DriveFile) => void;
}) {
  return (
    <div>
      {driveFileList.map(driveFile => (
        <DriveFileListItem key={driveFile.id} driveFile={driveFile} onClick={onClickFile} />
      ))}
    </div>
  );
}
