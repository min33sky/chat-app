import React from 'react';
import { Media } from 'react-bootstrap';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

dayjs.extend(relativeTime); // fromNow를 사용하기 위한 플러그인
dayjs.locale('ko'); // 한국

/**
 * 채팅 메세지 컴포넌트
 * @param {object} param
 * @param {object} param.message  채팅 메세지
 * @param {object} param.user 현재 로그인 한 유저
 */
export default function Message({ message, user }) {
  // 채팅 메세지가 이미지인지 일반 텍스트인지 확인
  const isImage = message => message.hasOwnProperty('image') && !message.hasOwnProperty('content');

  return (
    <>
      <Media style={{ marginBottom: 10 }}>
        <img
          width={64}
          height={64}
          className='mr-3'
          src={message.user.image}
          alt={message.user.name}
        />

        <Media.Body
          style={{
            paddingLeft: 4,
            backgroundColor: `${message.user.id === user.uid && '#ececec'}`,
          }}
        >
          <h6>
            {message.user.name}

            <span style={{ marginLeft: 5, fontSize: '0.7em', color: 'gray' }}>
              {dayjs(message.timestamp).fromNow()}
            </span>
          </h6>

          {isImage(message) ? (
            <img style={{ maxWidth: 300 }} src={message.image} alt='uploadImage' />
          ) : (
            <p>{message.content}</p>
          )}
        </Media.Body>
      </Media>
    </>
  );
}
