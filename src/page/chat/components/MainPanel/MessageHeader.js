import React, { useEffect, useRef, useState } from 'react';
import {
  Accordion,
  Button,
  Card,
  Col,
  Container,
  FormControl,
  Image,
  InputGroup,
  Media,
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
  const userPosts = useSelector(state => state.chatRoom?.userPosts);

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

  // 채팅창 메세지 개수 랜더링
  const renderUserPosts = userPosts =>
    Object.entries(userPosts)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([key, val], i) => (
        <Media key={key}>
          <img
            style={{ borderRadius: '25px' }}
            width={48}
            height={48}
            className='mr-3'
            src={val.image}
            alt={val.name}
          />
          <Media.Body>
            <h6>{key}</h6>
            <p>{val.count} 개</p>
          </Media.Body>
        </Media>
      ));

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
          {
            //? 공개방 일때만  방장 정보를 보여준다.
            !isPrivateChatRoom && (
              <Col md={{ span: 4, offset: 8 }}>
                <p style={{ textAlign: 'end' }}>
                  <Image
                    roundedCircle
                    width={40}
                    height={40}
                    className='mr-3'
                    src={user && user.photoURL}
                    alt={chatRoom && chatRoom.createdBy.name}
                  />
                  {chatRoom && chatRoom.createdBy.name}
                </p>
              </Col>
            )
          }
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
                  <Card.Body style={{ padding: '1rem 1rem' }}>
                    {chatRoom && chatRoom.description}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Col>
          <Col>
            <Accordion defaultActiveKey='1'>
              <Card>
                <Card.Header style={{ padding: '0 1rem' }}>
                  <Accordion.Toggle as={Button} variant='link' eventKey='0'>
                    Message Count
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey='0'>
                  <Card.Body>{userPosts && renderUserPosts(userPosts)}</Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
