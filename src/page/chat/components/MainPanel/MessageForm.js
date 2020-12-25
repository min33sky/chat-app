import React, { useRef, useState } from 'react';
import { Col, Form, ProgressBar, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Button } from '../../style/Button';
import firebase from './../../../../firebase';

const messagesRef = firebase.database().ref('messages'); // firebase DB의 messages 컬렉션
const typingRef = firebase.database().ref('typing'); // firebase DB의 typing 컬렉션
const storageRef = firebase.storage().ref(); // firebase Storage

/**
 * 메세지 폼 컴포넌트
 */
export default function MessageForm() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const chatRoomId = useSelector(state => state.chatRoom.currentChatRoom?.id);
  const isPrivateChatRoom = useSelector(state => state.chatRoom?.isPrivateChatRoom);

  const uid = useSelector(state => state.auth.currentUser?.uid);
  const displayName = useSelector(state => state.auth.currentUser?.displayName);
  const photoURL = useSelector(state => state.auth.currentUser?.photoURL);

  const [percentage, setPercentage] = useState(0); // 이미지 전송 상태

  const inputOpenImageRef = useRef(null); // 이미지 업로드 버튼을 누르기 위한 Ref

  // ---------- Event Handler -------------------------------------------------------------- //

  const handleChange = e => setContent(e.target.value);

  // 메세지를 입력중일 때 상대방에게 보여주기 위한 처리
  const handleKeyDown = e => {
    if (e.ctrlKey && e.key === 'Enter') handleSubmit();

    if (content) {
      typingRef.child(chatRoomId).child(uid).set(displayName);
    } else {
      typingRef.child(chatRoomId).child(uid).remove();
    }
  };

  // DB에 저장할 메세지 형태를 생성하는 메서드
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

  // 메세지 전송
  const handleSubmit = async () => {
    if (!content) {
      setErrors(prev => [...prev, '메세지를 입력하세요!']);
      return;
    }

    setLoading(true);

    try {
      await messagesRef.child(chatRoomId).push().set(createMessage());
      typingRef.child(chatRoomId).child(uid).remove();
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

  // 이미지 업로드 버튼 클릭 핸들러
  const handleUploadImageButton = () => inputOpenImageRef && inputOpenImageRef.current.click();

  const getPath = () => {
    return isPrivateChatRoom ? `/message/private/${chatRoomId}` : '/message/public';
  };

  // 이미지 업로드 핸들러
  const handleUploadImage = e => {
    const file = e.target.files[0];
    console.log(file);
    if (!file) return;

    const filePath = `${getPath()}/${file.name}`;
    const metadata = { contentType: `${file.type}` };

    setLoading(true);

    try {
      // 파일을 먼저 스토리지에 저장
      const uploadTask = storageRef.child(filePath).put(file, metadata);

      // 리스너를 통해서 전송 상태를 확인한다.
      uploadTask.on(
        'state_changed',
        UploadTaskSnapshot => {
          const percentage = Math.round(
            (UploadTaskSnapshot.bytesTransferred / UploadTaskSnapshot.totalBytes) * 100,
          );
          // 상태값 저장
          setPercentage(percentage);
        },
        err => {
          setLoading(false);
          console.error(err);
        },
        () => {
          // 저장이 다 된 후에 파일 메세지 전송
          // 저장된 파일을 다운로드 받을 수 있는 URL 가져오기
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            // message collection에 파일 데이터 저장하기
            messagesRef.child(chatRoomId).push().set(createMessage(downloadURL));
            setLoading(false);
          });
        },
      );

      console.log('Image Upload Complete.......');
    } catch (error) {
      console.error(error);
    }
  };

  // ---------- Render ----------------------------------------------------------------- //

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId='exampleForm.ControlTextarea1'>
          <Form.Control
            as='textarea'
            rows={3}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder='단축키 Ctrl+Enter로 전송할 수 있습니다.'
          />
        </Form.Group>
      </Form>

      {!(percentage === 0 || percentage === 100) && (
        <ProgressBar animated variant='success' now={percentage} label={percentage} />
      )}

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
