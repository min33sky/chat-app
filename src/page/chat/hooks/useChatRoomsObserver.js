import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import firebase from '../../../firebase';
import { Actions } from '../state';

/**
 * 채팅방 생성 및 관리 훅
 * @returns {object} Array
 */
export default function useChatRoomsObserver() {
  const dispatch = useDispatch();
  const chatRoomsRef = useRef(null);
  chatRoomsRef.current = firebase.database().ref('chatRooms'); // firebase listener

  // 채팅방 생성 이후 채팅방 목록 업데이트 관련
  const [chatRooms, setChatRooms] = useState([]); // 채팅방 목록
  const [firstLoad, setFirstLoad] = useState(true); // 최초 로딩 체크
  const [activeChatRoomId, setActiveChatRoomId] = useState(''); // 현재 채팅방

  /**
   * 로그인 했을 때 최초 채팅방을 설정해 준다.
   */
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

  useEffect(() => {
    return () => {
      console.log('Remove chatRoomsRef Listener');
      chatRoomsRef.current.off();
    };
  }, []);

  // ? listener와 채팅방 목록, 현재 채팅방 관련 부분을 리턴해준다.
  return [chatRoomsRef.current, chatRooms, activeChatRoomId, setActiveChatRoomId];
}
