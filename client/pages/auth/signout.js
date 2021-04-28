import {useEffect} from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const Signout = () => {
  const {makeRequest} = useRequest(null);
  useEffect(() => {
    makeRequest({
      url: '/api/users/signout',
      method: 'post',
      body: {},
      onSuccess: () => Router.push('/')
    });
  }, []);

  return null;
};

export default Signout;