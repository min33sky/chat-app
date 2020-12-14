import React, { useEffect, useRef, useState } from 'react';
import { FaRegSmileWink } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import firebase from './../../../../firebase';

export default function DirectMessages() {
  const usersRef = useRef(null);
  usersRef.current = firebase.database().ref('users'); // firebase database user collections

  const currentUser = useSelector(state => state.auth.currentUser);
  const [users, setUsers] = useState([]);

  // DM 보낼 수 있는 유저 목록을 가져오기
  const addUsersListener = currentUserUid => {
    let userArray = [];
    usersRef.current.on('child_added', DataSnapshot => {
      if (currentUserUid !== DataSnapshot.key) {
        let user = DataSnapshot.val();
        user['uid'] = DataSnapshot.key;
        user['status'] = 'offline';
        userArray.push(user);
        setUsers(userArray);
      }
    });
  };

  useEffect(() => {
    if (currentUser) {
      addUsersListener(currentUser.uid);
    }
    console.log('Direct Messages Rendered');
  }, [currentUser, users.length]); // ? 유저 수의 변동에 따라 리랜더링

  // DM 보낼 유저 목록 랜더링 함수
  const renderDirectMessages = () =>
    users.length > 0 && users.map(user => <li key={user.uid}># {user.name}</li>);

  return (
    <div>
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <FaRegSmileWink style={{ marginRight: 8 }} />
        DIRECT MESSAGES (1)
      </span>

      <ul style={{ listStyle: 'none', padding: 0 }}>{renderDirectMessages()}</ul>
    </div>
  );
}
