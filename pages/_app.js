import { useEffect, useState } from 'react';
import { ethers, providers } from 'ethers';

import { globalStyles } from '../global-styles';
import { getRecord, webClient } from '../utils';
import { KrebitContext } from '../context';
import { NavBar } from '../components/navbar';

import krbNFT from '../schemas/KRBCredentialNFT.json' assert { type: 'json' };

const { NEXT_PUBLIC_NETWORK } = process.env;

const App = ({ Component, pageProps }) => {
  const [status, setStatus] = useState('idle');
  const [profile, setProfile] = useState({});
  const [selfId, setSelfId] = useState(null);
  const [isConnectionReady, setConnectionReady] = useState(false);

  useEffect(() => {
    getProfile();
  }, []);

  const connect = async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const provider = new providers.Web3Provider(window.ethereum);
    await provider._ready();
    setConnectionReady(true);
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
    await connect();
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

  const getNFTContract = () => {
    if (!window.ethereum) return;

    try {
      const provider = new providers.Web3Provider(window.ethereum);
      const wallet = provider.getSigner();

      const nftContract = new ethers.Contract(
        krbNFT[NEXT_PUBLIC_NETWORK].address,
        krbNFT.abi,
        wallet
      );

      return {
        wallet,
        nftContract,
      };
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
          isConnectionReady,
          connectCeramic,
          getProfile,
          getNFTContract,
        }}
      >
        <NavBar />
        <div id="modal"></div>
        <Component {...pageProps} />
      </KrebitContext.Provider>
    </>
  );
};

export default App;
