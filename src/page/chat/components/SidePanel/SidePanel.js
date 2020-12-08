import React from 'react';
import ChatRooms from './ChatRooms';
import DirectMessages from './DirectMessages';
import Favorited from './Favorited';
import UserPanel from './UserPanel';

export default function SidePanel() {
  return (
    <div
      style={{
        backgroundColor: 'rgba(155, 89, 182, 1)',
        padding: '2rem',
        minHeight: '100vh',
        color: 'white',
        minWidth: '275px',
      }}
    >
      <UserPanel />
      <Favorited />
      <ChatRooms />
      <DirectMessages />
    </div>
  );
}
