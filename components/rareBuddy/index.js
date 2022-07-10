import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';

import { Wrapper } from './styles';
import { Button } from '../button';
import { CredentialModal } from '../credentialModal';
import { KrebitContext } from '../../context';
import { getVerifiableCredentials } from '../../utils';

import krbNFT from '../../schemas/KRBCredentialNFT.json' assert { type: 'json' };

const { NEXT_PUBLIC_CHAIN_ID } = process.env;
const { NEXT_PUBLIC_NFT_METADATA_URI } = process.env;
const { NEXT_PUBLIC_IPFS_GATEWAY } = process.env;
const { NEXT_PUBLIC_NETWORK } = process.env;

export const RareBuddy = () => {
  const {
    getNFTContract,
    profile,
    authStatus,
    connectCeramic,
    isConnectionReady,
  } = useContext(KrebitContext);
  const [currentNetworkChainId, setCurrentNetworkChainId] = useState();
  const [nft, setNft] = useState({});
  const [currentPrice, setCurrentPrice] = useState('');
  const [credentialType, setCredentialType] = useState('');
  const [credentialValue, setCredentialValue] = useState('');
  const [currentErrorStatus, setCurrentErrorStatus] = useState('idle');
  const [status, setStatus] = useState('idle');
  const { query } = useRouter();
  const isLoading =
    status === 'idle' || status === 'pending' || !isConnectionReady;

  useEffect(() => {
    if (!window) return;

    const getCurrentNetwork = async () => {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${Number(NEXT_PUBLIC_CHAIN_ID).toString(16)}` }],
      });
      setCurrentNetworkChainId(NEXT_PUBLIC_CHAIN_ID);
    };

    getCurrentNetwork();
  }, []);

  useEffect(() => {
    if (!window) return;
    if (currentNetworkChainId !== NEXT_PUBLIC_CHAIN_ID) return;
    if (!isConnectionReady) return;

    const getCurrentPrice = async () => {
      const { nftContract } = getNFTContract();
      const mintPrice = await nftContract.price();
      const currentMintPrice = ethers.utils.formatUnits(mintPrice, 18);
      setCurrentPrice(currentMintPrice);
    };

    const getRequiredCredential = async () => {
      const { nftContract } = getNFTContract();
      const credentialType = await nftContract.requiredCredentialType();
      const credentialValue = await nftContract.requiredCredentialValue();
      setCredentialType(credentialType);
      setCredentialValue(credentialValue);
    };

    getCurrentPrice();
    getRequiredCredential();
  }, [currentNetworkChainId, isConnectionReady]);

  useEffect(() => {
    if (!window) return;
    if (currentNetworkChainId !== NEXT_PUBLIC_CHAIN_ID) return;
    if (!isConnectionReady) return;

    const getNFTs = async () => {
      const currentTokenId = parseInt(query.tokenId);
      setStatus('pending');

      try {
        const { nftContract } = getNFTContract();

        let metadata = await fetch(
          `${NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${NEXT_PUBLIC_NFT_METADATA_URI}/${currentTokenId}`
        ).then(res => res.json());

        try {
          metadata['owner'] = await nftContract.ownerOf(currentTokenId);
        } catch (error) {
          metadata['owner'] = undefined;
        }

        setNft({
          ...metadata,
          image: `${NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${metadata.image.replace(
            'ipfs://',
            ''
          )}`,
          price: currentPrice,
          credentialType,
          credentialValue,
          tokenId: currentTokenId,
        });
        setStatus('resolved');
      } catch (error) {
        setStatus('rejected');
        console.error(error);
      }
    };

    getNFTs();
  }, [currentNetworkChainId, query.tokenId, currentPrice, isConnectionReady]);

  const mintNft = async () => {
    if (authStatus !== 'resolved' || !profile.currentDID) {
      setCurrentErrorStatus('NOT_LOGGED_IN');
      return;
    }

    try {
      const { nftContract, wallet } = getNFTContract();

      const verifiableCredentials = await getVerifiableCredentials({
        orderBy: 'issuanceDate',
        orderDirection: 'desc',
        where: {
          credentialSubjectDID: profile.currentDID,
          credentialStatus: 'Issued',
          _type: `["VerifiableCredential","${credentialType}"]`,
        },
      });

      // When the user needs to register some credentials in Krebit, show this message
      if (verifiableCredentials.length == 0) {
        setCurrentErrorStatus('MISSING_CREDENTIALS');
        return;
      }

      //TODO check that verifiableCredentials[0].credentialSubject contains ${credentialValue}

      // Only two mayor changes from the subgraph response:
      const eip712credential2 = {
        _context: verifiableCredentials[0]._context,
        _type: verifiableCredentials[0]._type,
        id: verifiableCredentials[0].claimId, // this
        issuer: verifiableCredentials[0].issuer,
        credentialSubject: {
          ...verifiableCredentials[0].credentialSubject,
          id: profile.currentDID, // and this
        },
        credentialSchema: verifiableCredentials[0].credentialSchema,
        issuanceDate: verifiableCredentials[0].issuanceDate,
        expirationDate: verifiableCredentials[0].expirationDate,
      };

      const eip712credential = {
        ...verifiableCredentials[0],
        id: verifiableCredentials[0].claimId, // this
        credentialSubject: {
          ...verifiableCredentials[0].credentialSubject,
          id: profile.currentDID, // and this
        },
      };

      const currentAddress = await wallet.getAddress();
      const currentTokenId = parseInt(query.tokenId);

      /*
      console.log('credential: ', eip712credential);
      console.log('currentAddress: ', currentAddress);
      console.log('currentTokenId: ', currentTokenId);
      console.log('currentPrice: ', currentPrice);
      */

      const tx = await nftContract.mintWithCredential(
        currentAddress,
        currentTokenId,
        eip712credential,
        {
          value: ethers.utils.parseEther(currentPrice).toString(),
        }
      );

      // When the user successfully mint the NFT, show this message
      if (tx) {
        setCurrentErrorStatus('SUCCESS_MINT');
      }
      console.log('Transaction minting token:', tx);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseCredentialModal = () => {
    setCurrentErrorStatus('idle');
  };

  const handleConnectCredentialModal = async () => {
    await connectCeramic();
    handleCloseCredentialModal();
  };

  const handlePushRouter = type => {
    if (type === 'krebit') {
      window.open('https://testnet.krebit.id/', '_blank');
    }

    if (type === 'opensea') {
      const contractAddress = krbNFT[NEXT_PUBLIC_NETWORK].address;
      const currentTokenId = parseInt(query.tokenId);

      window.open(
        `https://testnets.opensea.io/assets/${NEXT_PUBLIC_NETWORK}/${contractAddress}/${currentTokenId}`,
        '_blank'
      );
    }
  };

  if (isLoading) return;

  return (
    <>
      {currentErrorStatus === 'NOT_LOGGED_IN' && (
        <CredentialModal
          title="You're not logged in"
          description="You should connect your wallet to continue"
          buttonText="Connect"
          onClose={handleCloseCredentialModal}
          onClick={handleConnectCredentialModal}
        />
      )}
      {currentErrorStatus === 'MISSING_CREDENTIALS' && (
        <CredentialModal
          title={
            'Missing credential: ' + credentialType + ' : ' + credentialValue
          }
          description="Please go to Krebit DApp to register your credentials"
          buttonText="Go to Krebit DApp"
          onClose={handleCloseCredentialModal}
          onClick={() => handlePushRouter('krebit')}
        />
      )}
      {currentErrorStatus === 'SUCCESS_MINT' && (
        <CredentialModal
          title="Congratulations!"
          description="Now you have this NFT assigned to your wallet"
          buttonText="See it on OpenSea"
          onClose={handleCloseCredentialModal}
          onClick={() => handlePushRouter('opensea')}
        />
      )}
      <Wrapper currentImage={nft.image}>
        <div className="container">
          <div className="container-image"></div>
          <div className="container-content">
            <p className="container-title">{nft.name}</p>
            <p className="container-description">
              {'Required Krebit.id credential: {' +
                credentialType +
                ' : ' +
                credentialValue +
                '}'}
            </p>
            <p className="container-description">{nft.description}</p>
            <p className="container-description">
              Price: {nft.price} {krbNFT[NEXT_PUBLIC_NETWORK].token}
            </p>
            {nft.owner ? (
              <>
                <p className="container-description">Owner: {nft.owner}</p>
                <div className="container-button">
                  <Button
                    onClick={() => handlePushRouter('opensea')}
                    text="See it on OpenSea"
                  />
                </div>
              </>
            ) : (
              <div className="container-button">
                <Button onClick={mintNft} text="Mint" />
              </div>
            )}
          </div>
        </div>
      </Wrapper>
    </>
  );
};
