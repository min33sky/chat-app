import React, { useCallback, useEffect, useRef, useState } from 'react';
import MessageForm from './MessageForm';
import MessageHeader from './MessageHeader';
import firebase from './../../../../firebase';
import { useDispatch, useSelector } from 'react-redux';
import Message from './Message';
import { MessagesContainer } from './../../style/MessagesContainer';
import { Actions } from '../../state';

const typingRef = firebase.database().ref('typing');

/**
 * 채팅창 메인 화면
 * TODO: 로그아웃때 지랄남
 */
export default function MainPanel() {
  const dispatch = useDispatch();

  const messageRef = useRef(null);
  messageRef.current = firebase.database().ref('messages');

  const [messages, setMessages] = useState([]);
  const chatRoom = useSelector(state => state.chatRoom.currentChatRoom);
  const user = useSelector(state => state.auth.currentUser);

  const [typingUsers, setTypingUsers] = useState([]);

  // 게시물 분류 및 정렬 메서드
  const userPostsCount = useCallback(
    messages => {
      let userPosts = messages.reduce((acc, message) => {
        if (message.user.name in acc) {
          acc[message.user.name].count += 1;
        } else {
          acc[message.user.name] = {
            image: message.user.image,
            count: 1,
          };
        }
        return acc;
      }, {});
      dispatch(Actions.setUserPosts(userPosts));
    },
    [dispatch],
  );

  //? 옵져버를 통해서 채팅 메세지 감시
  const addMessageListeners = useCallback(
    id => {
      let messagesArray = [];
      setMessages([]); //? 채팅방 이동시 상태값 초기화
      messageRef.current.child(id).on('child_added', DataSnapshot => {
        messagesArray.push(DataSnapshot.val());
        setMessages([...messagesArray]);
        userPostsCount(messagesArray);
      });
    },
    [userPostsCount],
  );

  // 채팅방 타이핑 리스너
  const addTypingListeners = useCallback(chatRoomId => {
    typingRef.child(chatRoomId).on('value', DataSnapshot => {
      if (DataSnapshot.val()) {
        const typing = Object.entries(DataSnapshot.val());
        const result = typing.map(item => ({ id: item[0], name: item[1] }));
        setTypingUsers(result);
      }
    });
  }, []);

  useEffect(() => {
    if (chatRoom) {
      addMessageListeners(chatRoom.id);
      addTypingListeners(chatRoom.id);
    }
  }, [messages.length, chatRoom, addMessageListeners, addTypingListeners]);

  // ---------- 검색어 관련 ---------------------------------------------------------- //

  const [searchTerm, setSearchTerm] = useState(''); // 검색어
  const [searchResult, setSearchResult] = useState([]); // 검색 결과
  const [searchLoading, setSearchLoading] = useState(false);

  // 검색창 이벤트 핸들러
  const handleSearchChange = e => {
    // TODO: ?, / 이런거 처리 따로 해줘야 할듯
    setSearchTerm(e.target.value);
    setSearchLoading(true);
  };

  // 검색 결과 필터링 하기
  const handleSearchMessages = useCallback(() => {
    const chatRoomMessages = [...messages];

    try {
      const regex = new RegExp(searchTerm, 'gi');
      const results = chatRoomMessages.reduce((acc, message) => {
        // 글 내용이나 작성자가 일치하면 검색 결과로 리턴한다.
        if ((message.content && message.content.match(regex)) || message.user.name.match(regex)) {
          acc.push(message);
        }
        return acc;
      }, []);

      setSearchResult(results);

      setTimeout(() => {
        setSearchLoading(false);
      }, 1000);
    } catch (error) {
      console.error('정규 표현식에 맞는 escape 문자를 입력해야함');
    }
  }, [messages, searchTerm]);

  useEffect(() => {
    handleSearchMessages();
  }, [searchTerm, handleSearchMessages]);

  const renderMessages = messages =>
    messages.length > 0 &&
    messages.map(message => <Message key={message.timestamp} message={message} user={user} />);

  // ---------- Rendering ------------------------------------------------------------------- //

  return (
    <div style={{ padding: '2rem 2rem 0 2rem' }}>
      <MessageHeader onChange={handleSearchChange} />

      <MessagesContainer>
        {searchTerm ? renderMessages(searchResult) : renderMessages(messages)}
      </MessagesContainer>

      <MessageForm />
    </div>
  );
}
