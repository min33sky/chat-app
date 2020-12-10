import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { FaRegSmileWink, FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import firebase from '../../../../firebase';
import { Actions } from '../../state';

/**
 * 채팅방 생성 컴포넌트
 */
export default function ChatRooms() {
  const dispatch = useDispatch();
  const [name, setName] = useState(''); // 채팅방 이름
  const [description, setDescription] = useState(''); // 채팅방 설명

  // 모달 가시성 부분
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // 채팅창 생성 버튼 핸들러
  const handleSubmit = e => {
    e.preventDefault();
    if (isFormValid(name, description)) addChatRoom();
  };

  const isFormValid = (name, description) => name && description;

  // 채팅방 생성 관련
  const displayName = useSelector(state => state.auth.currentUser?.displayName);
  const photoURL = useSelector(state => state.auth.currentUser?.photoURL);
  const chatRoomsRef = useRef(null);
  chatRoomsRef.current = firebase.database().ref('chatRooms');

  const addChatRoom = async () => {
    const key = await chatRoomsRef.current.push().key; // firebase에서 unique key값 발급
    const newChatRoom = {
      id: key,
      name,
      description,
      createdBy: {
        name: displayName,
        image: photoURL,
      },
    };

    try {
      await chatRoomsRef.current.child(key).update(newChatRoom);
      setName('');
      setDescription('');
      setShow(false);
    } catch (error) {
      console.log(error);
    }
  };

  // 채팅방 생성 이후 채팅방 목록 업데이트 관련
  const [chatRooms, setChatRooms] = useState([]);
  const [firstLoad, setFirstLoad] = useState(true);
  const [activeChatRoomId, setActiveChatRoomId] = useState('');
  const setFirstChatRoom = useCallback(() => {
    if (firstLoad && chatRooms.length > 0) {
      dispatch(Actions.setCurrentChatRoom(chatRooms[0]));
      setActiveChatRoomId(chatRooms[0].id);
      setFirstLoad(false);
    }
  }, [chatRooms, dispatch, firstLoad]);

  useEffect(() => {
    let chatRoomsArray = [];
    // Firebase의 Listener가 채팅방이 생성되는 것을 알려준다.
    chatRoomsRef.current.on('child_added', DataSnapshot => {
      chatRoomsArray.push(DataSnapshot.val());
      // console.log('chatRoomsArray', chatRoomsArray);
      setChatRooms(chatRoomsArray);
    });
    console.log('chat useEffect - 1');
  }, [chatRooms.length]); //? 채팅방의 개수가 늘어날 때마다 리랜더링

  useEffect(() => {
    setFirstChatRoom();
    console.log('chat useEffect - 2');
  }, [setFirstChatRoom]);

  const renderChatRooms = chatRooms => {
    return (
      chatRooms.length > 0 &&
      chatRooms.map(chatRoom => (
        <li
          key={chatRoom.id}
          style={{
            backgroundColor: chatRoom.id === activeChatRoomId && '#ffffff45',
            cursor: 'pointer',
          }}
          onClick={() => changeChatRoom(chatRoom)}
        >
          # {chatRoom.name}
        </li>
      ))
    );
  };

  const changeChatRoom = chatRoom => {
    dispatch(Actions.setCurrentChatRoom(chatRoom));
    setActiveChatRoomId(chatRoom.id);
  };

  // --------------------------------------------------- Render ------------------------------------------ //

  return (
    <div>
      <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
        <FaRegSmileWink style={{ marginRight: 8 }} />
        CHAT ROOMS
        <FaPlus
          style={{ position: 'absolute', right: 0, cursor: 'pointer' }}
          onClick={handleShow}
        />
      </div>
      <ul style={{ listStyleType: 'none', padding: 0 }}>{renderChatRooms(chatRooms)}</ul>

      {/* findDOMNode 경고를 없애기 위해서 animation을 false로 설정 */}
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Create a Chat Room</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>방 이름</Form.Label>
              <Form.Control
                type='text'
                onChange={e => setName(e.target.value)}
                placeholder='방제를 입력하세요.'
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>방 설명</Form.Label>
              <Form.Control
                type='text'
                onChange={e => setDescription(e.target.value)}
                placeholder='채팅방 소개글을 입력하세요.'
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            닫기
          </Button>
          <Button variant='primary' onClick={handleSubmit}>
            생성
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
