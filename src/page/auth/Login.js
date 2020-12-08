import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Form from './components/Form';
import firebase from './../../firebase';

/**
 * 로그인 페이지
 */
export default function Login() {
  const { register, handleSubmit, errors } = useForm();
  const [errorFromFirebase, setErrorFromFirebase] = useState('');
  const [loading, setLoading] = useState(false);
  const timerId = useRef(null);

  const onSubmit = async data => {
    try {
      // 로그인
      setLoading(true);

      await firebase.auth().signInWithEmailAndPassword(data.email, data.password);

      setLoading(false);
    } catch (error) {
      setErrorFromFirebase(error.message);
      timerId.current = setTimeout(() => {
        setErrorFromFirebase('');
      }, 5000);
      setLoading(false);
    }
  }; // your form submit function which will invoke after successful validation

  useEffect(() => {
    return clearTimeout(timerId.current);
  }, []);

  return (
    <Form label='Login'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>email</label>
        <input
          name='email'
          type='email'
          placeholder='이메일 주소'
          ref={register({
            required: true,
            pattern: /^\S+@\S+$/,
          })}
        />
        {errors.email && errors.email.type === 'required' && <p>필수 항목입니다.</p>}
        {errors.email && errors.email.type === 'pattern' && <p>이메일 형식이 아닙니다.</p>}

        <label>password</label>
        <input
          name='password'
          type='password'
          placeholder='패스워드'
          ref={register({
            required: true,
          })}
        />
        {errors.password && errors.password.type === 'required' && <p>필수 항목입니다.</p>}
        {errorFromFirebase && <p>errorFromFirebase</p>}

        <input type='submit' disabled={loading} value='로그인' />
      </form>

      <div>
        <Link to='/register'>아직 아이디가 없다면...</Link>
      </div>
    </Form>
  );
}
