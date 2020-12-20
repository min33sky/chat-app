import React, { useEffect, useRef, useState } from 'react';
import { FaRegSmileWink } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Actions } from '../../state';
import firebase from './../../../../firebase';

/**
 * 다이렉트 메세지 (DM) 컴포넌트
 */
export default function DirectMessages() {
  const dispatch = useDispatch();
  const usersRef = useRef(null);
  usersRef.current = firebase.database().ref('users'); // firebase database user collections

  const currentUser = useSelector(state => state.auth.currentUser); // 접속자 정보
  const [users, setUsers] = useState([]); // DM을 보낼 유저들 목록

  const [activeChatRoom, setActiveChatRoom] = useState(''); // 현재 선택된 DM 채팅방

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
  }, [currentUser, users.length]); // ? 유저 수의 변동에 따라 리랜더링

  // ------------------------------------------------------------------------------------ //

  // DM 보낼 채팅방 변경
  const changeChatRoom = user => {
    console.log(user);
    const chatRoomId = getChatRoomId(user.uid);
    const chatRoomData = {
      id: chatRoomId,
      name: user.name,
    };
    console.log(chatRoomId);
    dispatch(Actions.setCurrentChatRoom(chatRoomData));

    dispatch(Actions.setPrivateChatRoom(true)); // ? DM이므로 비공개방으로 설정

    setActiveChatRoom(user.uid); // 현재 DM 채팅방으로 설정
  };

  // DM 채팅방 ID 얻기
  const getChatRoomId = userId => {
    /**
     *? 로그인 한 사람과 상대방의 uid를 이용해서 채팅방 id를 생성한다.
     *? 서로의 채팅방 id를 같게 하기 위해서 uid값을 비교해서 id를 생성한다.
     */
    return userId < currentUser.uid
      ? `${userId}/${currentUser.uid}`
      : `${currentUser.uid}/${userId}`;
  };

  // DM 보낼 유저 목록 랜더링 함수
  const renderDirectMessages = () =>
    users.length > 0 &&
    users.map(user => (
      <li
        key={user.uid}
        style={{
          cursor: 'pointer',
          backgroundColor: user.uid === activeChatRoom && '#ffffff45',
        }}
        onClick={() => changeChatRoom(user)}
      >
        # {user.name}
      </li>
    ));

  // ---------- Render ------------------------------------------------------------------ //

  return (
    <div>
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <FaRegSmileWink style={{ marginRight: 8 }} />
        DIRECT MESSAGES ({users.length})
      </span>

      <ul style={{ listStyle: 'none', padding: 0 }}>{renderDirectMessages()}</ul>
    </div>
  );
}
