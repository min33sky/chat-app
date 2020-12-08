import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Form from './components/Form';
import firebase from './../../firebase';
import md5 from 'md5'; // return unique value
import { useDispatch } from 'react-redux';
import { Actions } from './state';

/**
 * 회원 가입 페이지
 */
export default function Register() {
  const { register, handleSubmit, watch, errors } = useForm();
  const [errorFromFirebase, setErrorFromFirebase] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const password = useRef();
  const timerId = useRef(null);
  password.current = watch('password'); // 패스워드 비교를 위해

  const onSubmit = async data => {
    try {
      setLoading(true);
      // 1. 인증 서비스에 계정 생성
      let createdUser = await firebase
        .auth()
        .createUserWithEmailAndPassword(data.email, data.password);

      // 2. 계정 정보 업데이트
      await createdUser.user.updateProfile({
        displayName: data.name,
        photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`,
      });

      // 3. Firebase DB에 저장
      await firebase.database().ref('users').child(createdUser.user.uid).set({
        name: createdUser.user.displayName,
        image: createdUser.user.photoURL,
      });

      // ? 기존 App에서 저장하는 내용은 아이디와 비밀번호만 들어가 있기때문에
      // ? 가입에 필요한 추가 정보를 포함해서 스토어를 업데이트
      dispatch(Actions.setAuth(createdUser.user));

      console.log('createdUser', createdUser);
      setLoading(false);
    } catch (error) {
      setErrorFromFirebase(error.message);
      setLoading(false);
      timerId.current = setTimeout(() => {
        setErrorFromFirebase('');
      }, 5000);
    }
  }; // your form submit function which will invoke after successful validation

  useEffect(() => {
    return () => {
      clearTimeout(timerId.current);
    };
  }, []);

  // console.log(watch('email')); // you can watch individual input by pass the name of the input

  return (
    <Form label='Register'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>email</label>
        <input
          name='email'
          type='email'
          placeholder='이메일 주소를 적으세요!'
          ref={register({ required: true, pattern: /^\S+@\S+$/i })}
        />
        {errors.email && errors.email.type === 'required' && <p>필수 항목입니다.</p>}
        {errors.email && errors.email.type === 'pattern' && <p>이메일 형식이 아닙니다.</p>}

        <label>name</label>
        <input
          name='name'
          placeholder='10자리까지 가능합니다.'
          ref={register({ required: true, maxLength: 10 })}
        />
        {errors.name && errors.name.type === 'required' && <p>필수 항목입니다.</p>}
        {errors.name && errors.name.type === 'maxLength' && (
          <p>최대 10자리까지 입력이 가능합니다.</p>
        )}

        <label>password</label>
        <input
          name='password'
          type='password'
          placeholder='최소 6자리 입력하세요!'
          ref={register({ required: true, minLength: 6 })}
        />
        {errors.password && errors.password.type === 'required' && <p>필수 항목입니다.</p>}
        {errors.password && errors.password.type === 'minLength' && <p>최소 6자리를 입력하세요.</p>}

        <label>passwordConfirm</label>
        <input
          name='passwordConfirm'
          type='password'
          placeholder='비밀번호를 다시 입력하세요!'
          ref={register({ required: true, validate: value => value === password.current })}
        />
        {errors.passwordConfirm && errors.passwordConfirm.type === 'required' && (
          <p>필수 항목입니다.</p>
        )}
        {errors.passwordConfirm && errors.passwordConfirm.type === 'validate' && (
          <p>비밀번호가 일치하지 않습니다.</p>
        )}
        {errorFromFirebase && <p>{errorFromFirebase}</p>}

        <input type='submit' disabled={loading} value='회원 가입' />
      </form>

      <div>
        <Link to='/login'>이미 아이디가 있다면...</Link>
      </div>
    </Form>
  );
}
