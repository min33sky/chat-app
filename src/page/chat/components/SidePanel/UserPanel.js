import React, { useRef } from 'react';
import { Dropdown, Image } from 'react-bootstrap';
import { IoIosChatboxes } from 'react-icons/io';
import { useSelector } from 'react-redux';
import firebase from './../../../../firebase';

export default function UserPanel() {
  const displayName = useSelector(state => state.auth.currentUser?.displayName);
  const photoURL = useSelector(state => state.auth.currentUser?.photoURL);

  const uploadRef = useRef(null);

  const handleLogout = () => {
    firebase.auth().signOut();
  };

  const handleImageUploadClick = () => {
    uploadRef.current.click();
  };

  const handleUploadImage = () => {
    // TODO
  };

  return (
    <>
      <h3 style={{ color: 'white' }}>
        <IoIosChatboxes /> Chat App
      </h3>
      <div style={{ display: 'flex', marginBottom: '1rem' }}>
        <Image src={photoURL} style={{ width: 30, height: 30, marginTop: 3 }} roundedCircle />

        <Dropdown>
          <Dropdown.Toggle style={{ background: 'transparent', border: '0px' }} id='dropdown-basic'>
            {displayName}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={handleImageUploadClick}>프로필 사진 변경</Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>로그 아웃</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <input
        type='file'
        style={{ display: 'none' }}
        accept='image/jpeg, image/png'
        ref={uploadRef}
        onChange={handleUploadImage}
      />
    </>
  );
}
