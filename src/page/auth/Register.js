import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Form from './components/Form';

/**
 * 회원 가입 페이지
 */
export default function Register() {
  const { register, handleSubmit, watch, errors } = useForm();
  const onSubmit = data => {
    console.log(data);
  }; // your form submit function which will invoke after successful validation

  console.log(watch('example')); // you can watch individual input by pass the name of the input

  return (
    <Form label='Register'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>email</label>
        <input name='email' type='email' defaultValue='test' ref={register} />
        <label>name</label>
        <input name='name' defaultValue='test' ref={register} />
        <label>password</label>
        <input name='password' type='password' ref={register} />
        <label>passwordRequired</label>
        <input
          name='passwordRequired'
          type='password'
          ref={register({ required: true, maxLength: 10 })}
        />
        {errors.exampleRequired && <p>This field is required</p>}
        <input type='submit' value='회원 가입' />
      </form>

      <div>
        <Link to='/login'>이미 아이디가 있다면...</Link>
      </div>
    </Form>
  );
}
