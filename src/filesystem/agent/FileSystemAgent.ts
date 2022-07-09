type ContentType = 'text/plain';
type WellKnownSystemDirectories = 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos';

type OpenFilePickerOption = {
  types?: {description?: string, accept?: Record<ContentType, string[]>}[];
  startIn?: WellKnownSystemDirectories | FileSystemDirectoryHandle;
}

type FileSystemWritableFileStream = WritableStream & {
  write: (contents: Blob | string) => Promise<void>;
};

type FilePermissionOption = {
  mode?: 'read' | 'readwrite'
};

type FilePermissionResult = 'granted' | 'denied' | 'prompt';

export type ExtendedFileSystemFileHandle = FileSystemFileHandle & {
  createWritable: () => Promise<FileSystemWritableFileStream>;
  queryPermission: (option: FilePermissionOption) => Promise<FilePermissionResult>;
  requestPermission: (option: FilePermissionOption) => Promise<FilePermissionResult>;
}

export type ExtendedFileSystemEntry = ExtendedFileSystemFileEntry | ExtendedFileSystemDirectoryEntry;

type ExtendedFileSystemFileEntry = FileSystemFileEntry & {
  kind: 'file';
  getFile(): Promise<File>;
}

type ExtendedFileSystemDirectoryEntry = FileSystemDirectoryEntry & {
  kind: 'directory';
}

type ExtendedFileSystemDirectoryHandle = FileSystemDirectoryHandle & {
  values: () => ExtendedFileSystemEntry[];
};

interface ExtendedWindow {
  showOpenFilePicker(option?: OpenFilePickerOption): Promise<ExtendedFileSystemFileHandle[]>;
  showDirectoryPicker(): Promise<ExtendedFileSystemDirectoryHandle>;
}

declare const window: Window & ExtendedWindow;

export class FileSystemAgent {
  public static async showOpenFilePicker(option?: OpenFilePickerOption) {
    const [fileHandle] = await window.showOpenFilePicker(option);
    return fileHandle;
  }

  public static async writeFile(fileHandle: ExtendedFileSystemFileHandle, contents: Blob | string) {
    const hasWritablePermission = await this.verifyWritePermission(fileHandle);
    if (!hasWritablePermission) {
      return;
    }
    // Create a FileSystemWritableFileStream to write to.
    const writable = await fileHandle.createWritable();
    // Write the contents of the file to the stream.
    await writable.write(contents);
    // Close the file and write the contents to disk.
    await writable.close();
  }

  public static async writeURLToFile(fileHandle: ExtendedFileSystemFileHandle, url: string) {
    // Create a FileSystemWritableFileStream to write to.
    const writable = await fileHandle.createWritable();
    // Make an HTTP request for the contents.
    const response = await fetch(url);
    // Stream the response into the file.
    await response.body?.pipeTo(writable);
    // pipeTo() closes the destination pipe by default, no need to close it.
  }

  private static async verifyWritePermission(fileHandle: ExtendedFileSystemFileHandle) {
    const options: FilePermissionOption = {mode: 'readwrite'};

    // Check if permission was already granted. If so, return true.
    if ((await fileHandle.queryPermission(options)) === 'granted') {
      return true;
    }
    // Request permission. If the user grants permission, return true.
    if ((await fileHandle.requestPermission(options)) === 'granted') {
      return true;
    }
    // The user didn't grant permission, so return false.
    return false;
  }

  public static async showDirectoryPicker(): Promise<ExtendedFileSystemDirectoryHandle> {
    return await window.showDirectoryPicker();
  }
}