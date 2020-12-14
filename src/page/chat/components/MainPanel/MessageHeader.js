import React from 'react';
import {
  Accordion,
  Button,
  Card,
  Col,
  Container,
  FormControl,
  InputGroup,
  Row,
} from 'react-bootstrap';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { MdFavoriteBorder } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';
import { useSelector } from 'react-redux';

/**
 * 채팅방 헤더 컴포넌트
 * @param {object} param
 * @param {() => void} param.onChange 검색창 핸들러
 */
export default function MessageHeader({ onChange }) {
  const chatRoomName = useSelector(state => state.chatRoom.currentChatRoom?.name);
  const isPrivateChatRoom = useSelector(state => state.chatRoom?.isPrivateChatRoom);

  return (
    <div
      style={{
        width: '100%',
        height: 170,
        border: '.2rem solid #ececec',
        padding: '1rem',
        marginBottom: '1rem',
      }}
    >
      <Container>
        <Row>
          <Col>
            <h2 style={{ display: 'flex', alignItems: 'center' }}>
              {isPrivateChatRoom ? <FaLock /> : <FaLockOpen />} {chatRoomName} <MdFavoriteBorder />
            </h2>
          </Col>
          <Col>
            <InputGroup className='mb-3'>
              <InputGroup.Prepend>
                <InputGroup.Text id='basic-addon1'>
                  <AiOutlineSearch />
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                onChange={onChange}
                placeholder='Search Messages'
                aria-label='Search'
                aria-describedby='basic-addon1'
              />
            </InputGroup>
          </Col>
        </Row>

        <Row>
          <Col md={{ span: 4, offset: 8 }}>
            <p style={{ textAlign: 'end' }}>[icon] username</p>
          </Col>
        </Row>

        <Row>
          <Col>
            <Accordion defaultActiveKey='1'>
              <Card>
                <Card.Header style={{ padding: '0 1rem' }}>
                  <Accordion.Toggle as={Button} variant='link' eventKey='0'>
                    Description
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey='0'>
                  <Card.Body style={{ padding: '1rem 1rem' }}>Hello! I'm the body</Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Col>
          <Col>
            <Accordion defaultActiveKey='1'>
              <Card>
                <Card.Header style={{ padding: '0 1rem' }}>
                  <Accordion.Toggle as={Button} variant='link' eventKey='0'>
                    Count
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey='0'>
                  <Card.Body>Hello! I'm the body</Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
