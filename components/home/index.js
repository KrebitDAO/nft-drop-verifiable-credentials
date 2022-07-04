import { useEffect, useState } from 'react';

import { Wrapper } from './styles';

const { NEXT_PUBLIC_NFT_BASE_URI } = process.env;
const { NEXT_PUBLIC_IPFS_GATEWAY } = process.env;
const { NEXT_PUBLIC_NFT_SUPPLY } = process.env;

const NFT_IMAGES = [...Array(Number(NEXT_PUBLIC_NFT_SUPPLY) + 1).keys()].slice(
  1
);
const DELAY = 2000;

export const Home = props => {
  const [currentNFTImagePosition, setCurrentNFTImagePosition] = useState(0);

  /* useEffect(() => {
    const getCurrentVerifiableCredentials = async () => {
      const verifiableCredentials = await getVerifiableCredentials({
        orderBy: 'issuanceDate',
        orderDirection: 'desc',
        where: {
          credentialSubjectDID: auth?.profile?.currentDID,
          credentialStatus: 'Issued',
        },
      });

      if (verifiableCredentials) {
        setCurrentVerifiableCredentials(verifiableCredentials);
      }
    };

    if (auth?.authStatus === 'resolved') {
      getCurrentVerifiableCredentials();
    }
  }, [auth?.authStatus, auth?.profile?.currentDID]); */

  useEffect(() => {
    const timeout = setInterval(() => {
      setCurrentNFTImagePosition(prevValue => {
        if (prevValue === NFT_IMAGES.length - 1) {
          return 0;
        }

        return prevValue + 1;
      });
    }, DELAY);

    return () => clearInterval(timeout);
  }, []);

  return (
    <Wrapper
      currentNFT={`${NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${NEXT_PUBLIC_NFT_BASE_URI}/${NFT_IMAGES[currentNFTImagePosition]}.jpeg`}
    >
      <div className="container">
        <div className="content">
          <h1 className="content-title">Rare Buddies NFTs</h1>
          <p className="content-description">
            An exclusive NFT collection of really unique hand-drawn buddies.
            Made by fuano.eth. Just art, no promises ❤️
          </p>
        </div>
        <div className="nfts">
          <div className="nfts-images"></div>
        </div>
      </div>
    </Wrapper>
  );
};
