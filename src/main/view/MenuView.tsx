import {Link} from 'react-router-dom';
import styled from 'styled-components';

export function MenuView() {
  return (
    <Container>
      {/* <Link to="/filesystem">파일 시스템</Link> */}
      <Link to="/filesystem2">파일 시스템2</Link>
      <Link to="/googledrive">구글 드라이브</Link>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;