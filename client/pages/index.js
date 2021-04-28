import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  return currentUser ? <div>Welcome {currentUser.email}</div> : <div>Please Sign In</div>
};

LandingPage.getInitialProps = async (context) => {
  const { data } = await buildClient(context)
    .get('/api/users/currentuser');

  return data;
};

export default LandingPage;