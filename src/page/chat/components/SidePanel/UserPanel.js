import React, { useRef } from 'react';
import { Dropdown, Image } from 'react-bootstrap';
import { IoIosChatboxes } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { Actions as AuthActions } from '../../../auth/state';
import firebase from './../../../../firebase';

export default function UserPanel() {
  const dispatch = useDispatch();
  const displayName = useSelector(state => state.auth.currentUser?.displayName);
  const photoURL = useSelector(state => state.auth.currentUser?.photoURL);
  const uid = useSelector(state => state.auth.currentUser?.uid);

  const uploadRef = useRef(null);

  // 로그아웃 핸들러
  const handleLogout = () => {
    firebase.auth().signOut();
  };

  // 이미지 업로드 버튼 클릭 핸들러
  const handleImageUploadClick = () => {
    uploadRef.current.click();
  };

  // 이미지 업로드 핸들러
  const handleUploadImage = async e => {
    const file = e.target.files[0];
    if (!file) return;

    const metadata = {
      contentType: file.type,
    };

    try {
      // 스토리지에 사진 저장
      let uploadTaskSnapshop = await firebase
        .storage()
        .ref()
        .child(`user_image/${uid}`)
        .put(file, metadata);

      // 사진 URL 가져오기
      let downloadURL = await uploadTaskSnapshop.ref.getDownloadURL();

      // 프로필 업데이트
      await firebase.auth().currentUser.updateProfile({
        photoURL: downloadURL,
      });

      // DB에 저장
      await firebase.database().ref('users').child(uid).update({ image: downloadURL });

      dispatch(AuthActions.setPhotoURL(downloadURL));
    } catch (error) {
      console.log(error);
    }
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
