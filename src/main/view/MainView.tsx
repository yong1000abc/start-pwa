import {Link, Route, Routes} from 'react-router-dom';
import {BuildEnv} from 'src/BuildEnv';
import {FileSystemView} from 'src/filesystem/view/FileSystemView';
import {FileSystem2View} from 'src/filesystem2/FileSystem2View';
import {GoogleDriveView} from 'src/googledrive/GoogleDriveView';
import {MenuView} from 'src/main/view/MenuView';
import styled from 'styled-components';

export function MainView() {
  return (
    <div>
      <Header>
        <Link to="/">메인으로</Link>
        - {BuildEnv.version}
      </Header>
      <Routes>
        <Route path="/" element={<MenuView />} />
        <Route path="/filesystem" element={<FileSystemView />} />
        <Route path="/filesystem2" element={<FileSystem2View />} />
        <Route path="/googledrive" element={<GoogleDriveView />} />
      </Routes>
    </div>
  );
}

const Header = styled.div`
  padding: 20px 0;
`;