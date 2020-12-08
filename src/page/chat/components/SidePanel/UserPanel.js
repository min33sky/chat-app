import React from 'react';
import { Dropdown, Image } from 'react-bootstrap';
import { IoIosChatboxes } from 'react-icons/io';
import { useSelector } from 'react-redux';

export default function UserPanel() {
  const user = useSelector(state => state.auth.currentUser);

  return (
    <div>
      <h3 style={{ color: 'white' }}>
        <IoIosChatboxes /> Chat App
      </h3>
      <div style={{ display: 'flex', marginBottom: '1rem' }}>
        <Image src={user.photoURL} style={{ width: 30, height: 30, marginTop: 3 }} roundedCircle />

        <Dropdown>
          <Dropdown.Toggle style={{ background: 'transparent', border: '0px' }} id='dropdown-basic'>
            {user.displayName}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href='#/action-1'>프로필 사진 변경</Dropdown.Item>
            <Dropdown.Item href='#/action-2'>로그 아웃</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}
