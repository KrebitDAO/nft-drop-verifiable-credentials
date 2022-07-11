import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
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
  const [currentErrorStatus, setCurrentErrorStatus] = useState('idle');
  const [status, setStatus] = useState('idle');
  const [mintStatus, setMintStatus] = useState('idle');
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

        const mintPrice = await nftContract.price();
        const currentMintPrice = ethers.utils.formatUnits(mintPrice, 18);
        const credentialType = await nftContract.requiredCredentialType();
        const credentialValue = await nftContract.requiredCredentialValue();
        const verifiableCredentials = await getVerifiableCredentials({
          orderBy: 'issuanceDate',
          orderDirection: 'desc',
          where: {
            credentialSubjectDID: profile.currentDID,
            credentialStatus: 'Issued',
            _type: `["VerifiableCredential","${credentialType}"]`,
          },
        });

        setNft({
          ...metadata,
          image: `${NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${metadata.image.replace(
            'ipfs://',
            ''
          )}`,
          price: currentMintPrice,
          credentialType,
          credentialValue,
          tokenId: currentTokenId,
          verifiableCredentials,
        });
        setStatus('resolved');
      } catch (error) {
        setStatus('rejected');
        console.error(error);
      }
    };

    getNFTs();
  }, [
    currentNetworkChainId,
    query.tokenId,
    profile.currentDID,
    isConnectionReady,
  ]);

  const mintNft = async () => {
    setMintStatus('pending');

    if (authStatus !== 'resolved' || !profile.currentDID) {
      setCurrentErrorStatus('NOT_LOGGED_IN');
      setMintStatus('resolved');
      return;
    }

    if (nft.verifiableCredentials.length == 0) {
      throw new Error('Missing credentials');
    }

    try {
      const { nftContract, wallet } = getNFTContract();

      // TODO: Check that verifiableCredentials[0].credentialSubject contains ${credentialValue}
      const eip712credential = {
        ...nft.verifiableCredentials[0],
        id: nft.verifiableCredentials[0].claimId,
        credentialSubject: {
          ...nft.verifiableCredentials[0].credentialSubject,
          id: profile.currentDID,
        },
      };
      const currentAddress = await wallet.getAddress();
      const currentTokenId = parseInt(query.tokenId);

      const tx = await nftContract.mintWithCredential(
        currentAddress,
        currentTokenId,
        eip712credential,
        {
          value: ethers.utils.parseEther(nft.price).toString(),
        }
      );

      // When the user successfully mint the NFT, show this message
      if (tx) {
        setCurrentErrorStatus('SUCCESS_MINT');
        setMintStatus('resolved');
      }
      console.log('Transaction minting token:', tx);
    } catch (error) {
      console.error(error);
      setMintStatus('rejected');
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
    if (type === 'webpage') {
      window.open('https://testnet.krebit.id/', '_blank');
    }

    if (type === 'reload') {
      window.location.reload();
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
          isButtonLoading={authStatus === 'pending'}
        />
      )}
      {currentErrorStatus === 'SUCCESS_MINT' && (
        <CredentialModal
          title="Congratulations!"
          description="Now you have this NFT assigned to your wallet"
          buttonText="Thank you!"
          onClose={handleCloseCredentialModal}
          onClick={() => handlePushRouter('reload')}
        />
      )}
      <Wrapper currentImage={nft.image}>
        <div className="container">
          <div className="container-image"></div>
          <div className="container-content">
            <p className="container-title">{nft.name}</p>
            <p className="container-description">{nft.description}</p>
            <p className="container-description">
              Price: {nft.price} {krbNFT[NEXT_PUBLIC_NETWORK].token}
            </p>
            {nft.owner ? (
              <>
                <p className="container-description">Owner: {nft.owner}</p>
                <div className="container-networks">
                  <Link
                    href={`https://${
                      NEXT_PUBLIC_NETWORK === 'rinkeby' ? 'testnets.' : ''
                    }opensea.io/assets/${NEXT_PUBLIC_NETWORK}/${
                      krbNFT[NEXT_PUBLIC_NETWORK].address
                    }/${query.tokenId}`}
                    rel="noopener noreferrer"
                  >
                    <a target="_blank">
                      <img src="/opensea.svg" width={20} height={20} /> OpenSea
                    </a>
                  </Link>
                  <Link
                    href={`https://${
                      NEXT_PUBLIC_NETWORK === 'rinkeby' ? 'testnet.' : ''
                    }rarible.com/token/${krbNFT[NEXT_PUBLIC_NETWORK].address}:${
                      query.tokenId
                    }`}
                    rel="noopener noreferrer"
                  >
                    <a target="_blank">
                      {' '}
                      <img src="/rarible.png" width={20} height={20} />
                      Rarible
                    </a>
                  </Link>
                </div>
              </>
            ) : (
              <>
                {nft?.verifiableCredentials?.length === 0 &&
                authStatus === 'resolved' ? (
                  <>
                    <p className="container-subtitle">
                      You're missing some credentials to mint this NFT
                    </p>
                    <p className="container-description">
                      {nft.credentialType} is not equal to {nft.credentialValue}
                    </p>
                    <div className="container-button">
                      <Button
                        onClick={() => handlePushRouter('webpage')}
                        text="Go to Krebit DApp"
                      />
                    </div>
                  </>
                ) : (
                  <div className="container-button">
                    <Button
                      onClick={mintNft}
                      text="Mint"
                      isLoading={mintStatus === 'pending'}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Wrapper>
    </>
  );
};
