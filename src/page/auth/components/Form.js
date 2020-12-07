import React from 'react';
import { FormWrapper } from '../style/style';

/**
 * 폼 컴포넌트
 * @param {object} param
 * @param {string} param.label 폼 이름
 * @param {import('react').ReactNode} param.children
 */
export default function Form({ label, children }) {
  return (
    <FormWrapper>
      <div style={{ textAlign: 'center' }}>
        <h3>{label}</h3>
      </div>
      {children}
    </FormWrapper>
  );
}
