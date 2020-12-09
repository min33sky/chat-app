import React, { useRef, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { FaRegSmileWink, FaPlus } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import firebase from '../../../../firebase';

/**
 * 채팅방 생성 컴포넌트
 */
export default function ChatRooms() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
