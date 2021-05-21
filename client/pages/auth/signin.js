import { useState } from 'react';
import Router from 'next/router';
import useRequest from "../../hooks/use-request";

const SigninForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {errors, makeRequest} = useRequest(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    await makeRequest({
      url:'/api/users/signin',
      method: 'post',
      body: { email, password },
      onSuccess: () => Router.push("/")
    });
  }

  return (
    <form action="">
      <h2>Sign In</h2>
      { errors }
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          type="text"
          name="email"
          value={email}
          className="form-control"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={password}
          className="form-control"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button onClick={onSubmit} className="btn btn-primary">Sign In</button>
    </form>
  )
}

export default SigninForm;