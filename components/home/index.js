import { useEffect, useState } from 'react';

import { Wrapper } from './styles';

const NFT_IMAGES = [
  '/nfts/1.jpeg',
  '/nfts/2.jpeg',
  '/nfts/3.jpeg',
  '/nfts/4.jpeg',
  '/nfts/5.jpeg',
  '/nfts/6.jpeg',
  '/nfts/7.jpeg',
  '/nfts/8.jpeg',
  '/nfts/9.jpeg',
  '/nfts/10.jpeg',
  '/nfts/11.jpeg',
  '/nfts/12.jpeg',
  '/nfts/13.jpeg',
];
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
    <Wrapper currentNFT={NFT_IMAGES[currentNFTImagePosition]}>
      <div className="container">
        <div className="content">
          <h1 className="content-title">Colored Shape NFTs</h1>
          <p className="content-description">
            Mint a colored shape from thirdweb's colored shape NFT Collection on
            the Polygon Mumbai Testnet for free! Learn more about thirdweb's NFT
            Drop contract here:
            https://portal.thirdweb.com/pre-built-contracts/nft-drop
          </p>
        </div>
        <div className="nfts">
          <div className="nfts-images"></div>
        </div>
      </div>
    </Wrapper>
  );
};
