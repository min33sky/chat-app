import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Actions } from '../../state';
import firebase from './../../../../firebase';

/**
 * 즐겨찾기 컴포넌트
 *
 * ? updateListener를 따로 만든 이유
 * : removeListener에서 상태값을 직접 건들경우 무한 리랜더링 현상 발생해서
 *   DB에 있는 값을 그대로 가져와서 상태값을 변경하였다.
 */
export default function Favorited() {
  const dispatch = useDispatch();

  const [favoritedChatRooms, setFavoritedChatRooms] = useState([]);
  const user = useSelector(state => state.auth.currentUser);

  const [activeChatRoomId, setActiveChatRoomId] = useState('');

  const usersRef = useRef(null);
  usersRef.current = firebase.database().ref('users');

  // 즐겨찾기 변동사항 감지 리스너
  const addListener = useCallback(userId => {
    usersRef.current
      .child(userId)
      .child('favorited')
      .on('child_added', DataSnapshot => {
        const updated = {
          id: DataSnapshot.key,
          ...DataSnapshot.val(),
        };

        setFavoritedChatRooms(prev => [...prev, updated]);
      });
  }, []);

  // 즐겨찾기 삭제 리스너
  const removeListener = useCallback(userId => {
    usersRef.current
      .child(userId)
      .child('favorited')
      .on('child_removed', () => {
        updateListener(userId);
      });
  }, []);

  // 삭제된 결과 업데이트 리스너
  const updateListener = userId => {
    usersRef.current
      .child(userId)
      .child('favorited')
      .on('value', DataSnapshot => {
        const favorited = Object.entries(DataSnapshot.val());
        const result = favorited.map(item => ({ id: item[0], ...item[1] }));
        setFavoritedChatRooms(result);
      });
  };

  useEffect(() => {
    if (user) {
      addListener(user.uid);
      removeListener(user.uid);
    }
  }, [addListener, removeListener, user]);

  useEffect(() => {
    return () => {
      if (user) {
        console.log('Remove Favorited Listener ');
        usersRef.current.child(`${user.uid}/favorited`).off();
      }
    };
  }, [user]);

  const changeChatRoom = chatRoom => {
    dispatch(Actions.setPrivateChatRoom(false));
    dispatch(Actions.setCurrentChatRoom(chatRoom));
    setActiveChatRoomId(chatRoom.id);
  };

  // 즐겨찾기 렌더링
  const renderFavoritedChatRooms = () =>
    favoritedChatRooms.length > 0 &&
    favoritedChatRooms.map(chatRoom => (
      <li
        key={chatRoom.id}
        style={{
          cursor: 'pointer',
          backgroundColor: chatRoom.id === activeChatRoomId && '#ffffff45',
        }}
        onClick={() => changeChatRoom(chatRoom)}
      >
        # {chatRoom.name}
      </li>
    ));

  // ---------- Render -------------------------------------------------------------- //

  return (
    <>
      <span>FAVORITED ({favoritedChatRooms.length})</span>
      <ul style={{ listStyleType: 'none', padding: 0 }}>{renderFavoritedChatRooms()}</ul>
    </>
  );
}
