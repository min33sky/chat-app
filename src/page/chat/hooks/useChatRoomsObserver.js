import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import firebase from '../../../firebase';
import { Actions } from '../state';

/**
 * 채팅방 생성 및 관리 훅
 * @returns {object} Array
 */
export default function useChatRoomsObserver() {
  const dispatch = useDispatch();
  const chatRoomsRef = useRef(null);
  const messagesRef = useRef(null);

  // ? Firebase Database collections 가져오기
  chatRoomsRef.current = firebase.database().ref('chatRooms');
  messagesRef.current = firebase.database().ref('messages');

  // 채팅방 생성 이후 채팅방 목록 업데이트 관련
  const [chatRooms, setChatRooms] = useState([]); // 채팅방 목록
  const [firstLoad, setFirstLoad] = useState(true); // 최초 로딩 체크
  const [activeChatRoomId, setActiveChatRoomId] = useState(''); // 현재 채팅방
  const [notifications, setNotifications] = useState([]); // 채팅방 알림 관련

  const chatRoom = useSelector(state => state.chatRoom.currentChatRoom); // 현재 채팅방 정보

  const [loading, setLoading] = useState(true);

  /**
   * 로그인 했을 때 최초 채팅방을 설정하는 메서드
   */
  const setFirstChatRoom = useCallback(() => {
    if (firstLoad && chatRooms.length > 0) {
      dispatch(Actions.setCurrentChatRoom(chatRooms[0]));
      setActiveChatRoomId(chatRooms[0].id);
      setFirstLoad(false);
    }
  }, [chatRooms, dispatch, firstLoad]);

  // 채팅방 알림 관련
  const handleNotification = useCallback(
    (chatroomId, currentChatroomId, notifications, dataSnapshot) => {
      let lastTotal = 0;

      // 이미 notifications state에 알림 정보가 있는 방과 없는 방을 나눠주기
      let index = notifications.findIndex(notification => notification.id === chatroomId);

      // 해당 채팅방의 알림 정보가 없을 때
      // ? dataSnapshot.numChildren() : 전체 children 개수 -> 전체 메세지 개수
      if (index === -1) {
        notifications.push({
          id: chatroomId, // 채팅방 ID
          total: dataSnapshot.numChildren(), // 해당 채팅방 전체 메세지 개수
          lastKnownTotal: dataSnapshot.numChildren(), // 이전에 확인한 채팅방전체 메세지 개수
          count: 0, // 알림으로 표시할 숫자
        });
      } else {
        // 상대방이 채팅 보내는 채팅방에 내가 없을 때
        if (chatroomId !== currentChatroomId) {
          // 현재까지 유저가 확인한 총 메세지 개수
          lastTotal = notifications[index].lastKnownTotal;

          // count (알림으로 보여줄 숫자) 구하기
          // 현재 총 메세지 개수 - 이전에 확인한 총 메세지 개수 > 0이면 개수를 보여준다.
          if (dataSnapshot.numChildren() - lastTotal > 0) {
            notifications[index].count = dataSnapshot.numChildren() - lastTotal;
          }
        }

        // 전체 메세지 개수 업데이트
        notifications[index].total = dataSnapshot.numChildren();

        setNotifications(notifications);
      }
      setLoading(false);
    },
    [],
  );

  /**
   * 채팅방 알림 리스너
   * @param {number} chatRoomId 채팅방 ID
   */
  const addNotificationListener = useCallback(
    chatRoomId => {
      messagesRef.current.child(chatRoomId).on('value', DataSnapshot => {
        if (chatRoom) {
          setLoading(true);
          handleNotification(chatRoomId, chatRoom.id, notifications, DataSnapshot);
        }
      });
    },
    [chatRoom, handleNotification, notifications],
  );

  // ? 채팅방 생성을 감시하는 리스너
  useEffect(() => {
    let chatRoomsArray = [];
    // Firebase의 Listener가 채팅방이 생성되는 것을 알려준다.
    chatRoomsRef.current.on('child_added', DataSnapshot => {
      chatRoomsArray.push(DataSnapshot.val());
      // console.log('chatRoomsArray', chatRoomsArray);
      setChatRooms(chatRoomsArray);
      addNotificationListener(DataSnapshot.key); // ? DataSnapshot.key => 채팅방 아이디
    });
    // console.log('chat useEffect - 1');
  }, [chatRooms.length, addNotificationListener]); //? 채팅방의 개수가 늘어날 때마다 리랜더링

  // 처음 접속할 때 보여줄 채팅방 설정
  useEffect(() => {
    setFirstChatRoom();
    // console.log('chat useEffect - 2');
  }, [setFirstChatRoom]);

  // useEffect(() => {
  //   console.log('NOTIFICAtion이 변경되었다.');
  // }, [notifications.length]);

  // 파이어베이스 리스너 제거
  useEffect(() => {
    return () => {
      console.log('Remove chatRoomsRef Listener');
      chatRoomsRef.current.off(); // 파이어베이스 리스너 제거
    };
  }, []);

  // ? listener와 채팅방 목록, 현재 채팅방 관련 부분을 리턴해준다.
  return {
    chatRoomsRef: chatRoomsRef.current,
    chatRooms,
    activeChatRoomId,
    setActiveChatRoomId,
    notifications,
    loading,
  };
}
