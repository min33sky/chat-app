import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  height: 450px;
  border: 0.2rem solid #ececec;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
  overflow-y: auto;
`;

/**
 * 채팅창 스타일
 * @param {object} param
 * @param {import('react').ReactNode} param.children
 */
export function MessagesContainer({ children }) {
  return <Wrapper>{children}</Wrapper>;
}
