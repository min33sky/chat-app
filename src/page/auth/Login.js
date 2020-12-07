import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Form from './components/Form';

/**
 * 로그인 페이지
 */
export default function Login() {
  const { register, handleSubmit, watch, errors } = useForm();
  const onSubmit = data => {
    console.log(data);
  }; // your form submit function which will invoke after successful validation

  console.log(watch('example')); // you can watch individual input by pass the name of the input

  return (
    <Form label='Login'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>email</label>
        <input name='email' type='email' defaultValue='test' ref={register} />
        <label>password</label>
        <input name='password' type='password' ref={register} />
        {errors.exampleRequired && <p>This field is required</p>}
        <input type='submit' value='로그인' />
      </form>

      <div>
        <Link to='/register'>아이디가 없다면...</Link>
      </div>
    </Form>
  );
}
