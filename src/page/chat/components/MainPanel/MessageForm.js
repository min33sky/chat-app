import React, { useRef, useState } from 'react';
import { Col, Form, ProgressBar, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Button } from '../../style/Button';
import firebase from './../../../../firebase';

export default function MessageForm() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const chatRoomId = useSelector(state => state.chatRoom.currentChatRoom?.id);
  const uid = useSelector(state => state.auth.currentUser?.uid);
  const displayName = useSelector(state => state.auth.currentUser?.displayName);
  const photoURL = useSelector(state => state.auth.currentUser?.photoURL);

  const inputOpenImageRef = useRef(null); // 이미지 업로드 버튼 Ref

  const messagesRef = firebase.database().ref('messages'); // firebase DB의 messages 컬렉션
  const storageRef = firebase.storage().ref(); // firebase Storage

  const handleChange = e => {
    setContent(e.target.value);
  };

  const createMessage = (fileURL = null) => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: uid,
        name: displayName,
        image: photoURL,
      },
    };

    if (fileURL) {
      message['image'] = fileURL;
    } else {
      message['content'] = content;
    }

    return message;
  };

  const handleSubmit = async () => {
    if (!content) {
      setErrors(prev => [...prev, '메세지를 입력하세요!']);
      return;
    }
    setLoading(true);

    try {
      await messagesRef.child(chatRoomId).push().set(createMessage());

      setErrors([]);
      setContent('');
      setLoading(false);
      console.log('메세지 업로드 완료');
    } catch (error) {
      console.error(error);
      setErrors(prev => [...prev, error]);
      setLoading(false);
    }
  };

  // 업로드 버튼 클릭 핸들러
  const handleUploadImageButton = () => {
    if (inputOpenImageRef) {
      inputOpenImageRef.current.click();
    }
  };

  // 이미지 업로드 핸들러
  const handleUploadImage = async e => {
    const file = e.target.files[0];
    console.log(file);
    if (!file) return;

    const filePath = `message/public/${file.name}`;
    const metadata = { contentType: `${file.type}` };

    try {
      await storageRef.child(filePath).put(file, metadata);

      console.log('Image Upload Complete.......');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId='exampleForm.ControlTextarea1'>
          <Form.Control as='textarea' rows={3} value={content} onChange={handleChange} />
        </Form.Group>
      </Form>

      <ProgressBar animated now={60} label='60%' />

      {errors && <p style={{ color: 'red' }}>{errors}</p>}

      <Row style={{ marginTop: 10 }}>
        <Col>
          <Button onClick={handleSubmit} disabled={loading}>
            전송
          </Button>
        </Col>
        <Col>
          <Button onClick={handleUploadImageButton} disabled={loading}>
            이미지 업로드
          </Button>
        </Col>
      </Row>

      <input
        type='file'
        ref={inputOpenImageRef}
        accept='image/jpeg, image/png'
        onChange={handleUploadImage}
        style={{ display: 'none' }}
      />
    </>
  );
}
