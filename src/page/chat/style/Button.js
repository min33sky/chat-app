import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.button`
  width: 100%;
  padding: 0.6em;
  background-color: rgba(155, 89, 182, 0.9);
  border: 0;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(155, 89, 182, 1);
  }

  &:disabled {
    background-color: #7f8c8d;
  }
`;

/**
 * 버튼 컴포넌트
 * @param {object} param
 * @param {() => void=} param.onClick 클릭 이벤트 함수
 * @param {boolean=} param.disabled 클릭 가능 유무
 * @param {import('react').ReactNode} param.children 버튼 내용
 */
export function Button({ onClick, disabled, children }) {
  return (
    <Wrapper onClick={onClick} disabled={disabled}>
      {children}
    </Wrapper>
  );
}
