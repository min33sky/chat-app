import React, { useEffect, useRef, useState } from 'react';
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
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import firebase from './../../../../firebase';

/**
 * 채팅방 헤더 컴포넌트
 * @param {object} param
 * @param {() => void} param.onChange 검색창 핸들러
 */
export default function MessageHeader({ onChange }) {
  const isPrivateChatRoom = useSelector(state => state.chatRoom.isPrivateChatRoom);
  const chatRoom = useSelector(state => state.chatRoom.currentChatRoom);
  const user = useSelector(state => state.auth.currentUser);

  const [isFavorited, setIsFavorited] = useState(false);

  const usersRef = useRef(null);
  usersRef.current = firebase.database().ref('users'); // firebase database users collections

  useEffect(() => {
    if (user && chatRoom) {
      // console.log('user', user);
      //       console.log('chatRoom', chatRoom);
      addFavoriteListener(chatRoom.id, user.uid);
    }
  }, [user, chatRoom]);

  // 좋아요 정보를 DB에서 가져오기
  const addFavoriteListener = (chatRoomId, userId) => {
    usersRef.current
      .child(userId)
      .child('favorited')
      .once('value') // ? 한번만 발생하는 이벤트
      .then(data => {
        if (data.val()) {
          const favoritedChatRooms = Object.keys(data.val()); // 좋아요를 누른 채팅방 ID들
          const isAlreadyFavorited = favoritedChatRooms.includes(chatRoomId);
          setIsFavorited(isAlreadyFavorited);
        }
      });
  };

  // 좋아요 아이콘 핸들러
  const handleFavorite = () => {
    if (isFavorited) {
      usersRef.current
        .child(`${user.uid}/favorited`)
        .child(chatRoom.id)
        .remove(err => {
          if (err) {
            console.error(err);
          }
        });
      setIsFavorited(prev => !prev);
    } else {
      usersRef.current.child(`${user.uid}/favorited`).update({
        [chatRoom.id]: {
          name: chatRoom.name,
          description: chatRoom.description,
          createdBy: {
            name: chatRoom.createdBy.name,
            image: chatRoom.createdBy.image,
          },
        },
      });
      setIsFavorited(prev => !prev);
    }
  };

  // ---------- Render -------------------------------------------------------- //

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
              {isPrivateChatRoom ? <FaLock /> : <FaLockOpen />} {chatRoom?.name}{' '}
              <span style={{ cursor: 'pointer' }} onClick={handleFavorite}>
                {isFavorited ? <MdFavorite /> : <MdFavoriteBorder />}
              </span>
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
