import React, { useState } from 'react';
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

  const messagesRef = firebase.database().ref('messages'); // firebase DB의 messages 컬렉션

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

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId='exampleForm.ControlTextarea1'>
          <Form.Label>Example textarea</Form.Label>
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
          <Button onClick={() => alert('준비중')} disabled={loading}>
            이미지 업로드
          </Button>
        </Col>
      </Row>
    </>
  );
}
