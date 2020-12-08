import styled from 'styled-components';

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;

  form {
    width: 375px;
    margin: 0 auto;
  }

  div {
    width: 375px;
  }

  a {
    text-decoration: none;
    color: gray;
  }

  h1 {
    font-weight: 100;
    color: white;
    text-align: center;
    padding-bottom: 10px;
    border-bottom: 1px solid rgb(79, 98, 148);
  }

  .form {
    background: #0e101c;
    max-width: 400px;
    margin: 0 auto;
  }

  p {
    color: #bf1650;
  }

  p::before {
    display: inline;
    content: '⚠ ';
  }

  input {
    display: block;
    box-sizing: border-box;
    width: 100%;
    border-radius: 4px;
    border: 1px solid black;
    padding: 10px 15px;
    margin-bottom: 10px;
    font-size: 14px;
  }

  label {
    line-height: 2;
    text-align: left;
    display: block;
    margin: 5px 0;
    color: black;
    font-size: 14px;
    font-weight: 200;
  }

  button[type='submit'],
  input[type='submit'] {
    background: rgba(155, 89, 182, 0.9);
    color: white;
    text-transform: uppercase;
    border: none;
    margin-top: 40px;
    padding: 20px;
    font-size: 16px;
    font-weight: 100;
    letter-spacing: 10px;
    transition: all 0.3s;
  }

  button[type='submit']:hover,
  input[type='submit']:hover {
    background: rgba(155, 89, 182, 1);
  }

  button[type='submit']:active,
  input[type='button']:active,
  input[type='submit']:active {
    transition: 0.3s all;
    transform: translateY(3px);
    border: 1px solid transparent;
    opacity: 0.8;
  }

  input:disabled {
    opacity: 0.4;
  }

  input[type='button']:hover {
    transition: 0.3s all;
  }

  button[type='submit'],
  input[type='button'],
  input[type='submit'] {
    -webkit-appearance: none;
  }

  button[type='button'] {
    display: block;
    appearance: none;
    background: #333;
    color: white;
    border: none;
    text-transform: uppercase;
    padding: 10px 20px;
    border-radius: 4px;
  }

  hr {
    margin-top: 30px;
  }

  button {
    display: block;
    appearance: none;
    margin-top: 40px;
    border: 1px solid #333;
    margin-bottom: 20px;
    text-transform: uppercase;
    padding: 10px 20px;
    border-radius: 4px;
  }
`;
