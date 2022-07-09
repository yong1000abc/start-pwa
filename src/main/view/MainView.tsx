import {Link, Route, Routes} from 'react-router-dom';
import {FileSystemView} from 'src/filesystem/view/FileSystemView';
import {MenuView} from 'src/main/view/MenuView';
import styled from 'styled-components';

export function MainView() {
  return (
    <div>
      <Header>
        <Link to="/">메인으로</Link>
      </Header>
      <Routes>
        <Route path="/" element={<MenuView />} />
        <Route path="/filesystem" element={<FileSystemView />} />
      </Routes>
    </div>
  );
}

const Header = styled.div`
  padding: 20px 0;
`;