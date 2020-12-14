import React, { useCallback, useEffect, useRef, useState } from 'react';
import MessageForm from './MessageForm';
import MessageHeader from './MessageHeader';
import firebase from './../../../../firebase';
import { useSelector } from 'react-redux';
import Message from './Message';
import { MessagesContainer } from './../../style/MessagesContainer';
export default function MainPanel() {
  const messageRef = useRef(null);
  messageRef.current = firebase.database().ref('messages');

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const chatRoom = useSelector(state => state.chatRoom.currentChatRoom);
  const user = useSelector(state => state.auth.currentUser);

  // ? 옵져버를 통해서 채팅 메세지 감시
  const addMessageListeners = useCallback(id => {
    let messagesArray = [];
    setMessages([]); // 채팅방 이동시 상태값 초기화
    messageRef.current.child(id).on('child_added', DataSnapshot => {
      // setLoading(true);
      // console.log('메세지 불러오는 중...');
      messagesArray.push(DataSnapshot.val());
      // console.log('data :', DataSnapshot.val());
      // console.log('array :', messagesArray);

      setMessages(prev => [...messagesArray]);
      // setLoading(false);
      console.log('업데이트 끝');
    });
  }, []);

  useEffect(() => {
    if (chatRoom) {
      addMessageListeners(chatRoom.id);
    }
  }, [messages.length, chatRoom, addMessageListeners]);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearchChange = e => {
    console.log(e.target.value);
    setSearchTerm(e.target.value);
    setSearchLoading(true);

    // TODO: 이건 useeffect로 해줘야 할듯
    handleSearchMessages();
  };

  const handleSearchMessages = () => {
    const chatRoomMessages = [...messages];
    try {
      const regex = new RegExp(searchTerm, 'gi');
      const results = chatRoomMessages.reduce((acc, message) => {
        if ((message.content && message.content.match(regex)) || message.user.name.match(regex)) {
          acc.push(message);
        }
        return acc;
      }, []);
      setSearchResult(results);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('검색할 때 ?로 시작하지 말자');
    }
  };

  const renderMessages = messages =>
    messages.length > 0 &&
    messages.map(message => <Message key={message.timestamp} message={message} user={user} />);

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
