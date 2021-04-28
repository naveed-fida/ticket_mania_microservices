import { useState } from 'react';
import Router from 'next/router';
import useRequest from "../../hooks/use-request";

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {errors, makeRequest} = useRequest(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    await makeRequest({
      url:'/api/users/signup',
      method: 'post',
      body: { email, password },
      onSuccess: () => Router.push("/")
    });
  }

  return (
    <form action="">
      <h2>Sign Up</h2>
      { errors }
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          type="text"
          name="email"
          className="form-control"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          className="form-control"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button onClick={onSubmit} className="btn btn-primary">Sign Up</button>
    </form>
  )
}

export default SignupForm;