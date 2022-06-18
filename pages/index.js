import { Home } from '../components';

const IndexPage = props => {
  const { auth } = props;

  return <Home auth={auth} />;
};

export default IndexPage;
