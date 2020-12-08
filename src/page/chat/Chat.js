import React from 'react';
import MainPanel from './components/MainPanel/MainPanel';
import SidePanel from './components/SidePanel/SidePanel';

export default function Chat() {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '300px' }}>
        <SidePanel />
      </div>
      <div style={{ width: '100%' }}>
        <MainPanel />
      </div>
    </div>
  );
}
