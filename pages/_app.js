import { useEffect, useState } from 'react';
import { providers } from 'ethers';

import { globalStyles } from '../global-styles';
import { getRecord, webClient } from '../utils';
import { KrebitContext } from '../context';
import { NavBar } from '../components/navbar';

const App = ({ Component, pageProps }) => {
  const [status, setStatus] = useState('idle');
  const [profile, setProfile] = useState({});
  const [selfId, setSelfId] = useState(null);

  useEffect(() => {
    getProfile();
  }, []);

  const connect = async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const provider = new providers.Web3Provider(window.ethereum);
    await provider._ready();
  };

  const connectCeramic = async () => {
    setStatus('pending');
    await connect();

    try {
      const { id, selfId } = await webClient({});

      setSelfId(selfId);

      try {
        const profile = await selfId.get('basicProfile', id);

        if (profile) {
          setProfile({ ...profile, currentDID: id });
          setStatus('resolved');
        }
      } catch (error) {
        console.error(error);
        connectCeramic();
      }
    } catch (error) {
      console.error('error connecting ceramic...', error);
      setStatus('rejected');
    }
  };

  const getProfile = async () => {
    if (!window.ethereum) return;

    const provider = new providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();

    if (!accounts.length) return;

    try {
      const { record, id } = await getRecord({});

      if (record) {
        setProfile({ ...record, currentDID: id });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {globalStyles}
      <KrebitContext.Provider
        value={{
          authStatus: status,
          profile,
          selfId,
          connect,
          connectCeramic,
          getProfile,
        }}
      >
        <NavBar />
        <Component {...pageProps} />
      </KrebitContext.Provider>
    </>
  );
};

export default App;
