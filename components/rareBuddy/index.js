import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import { getEIP712Credential } from '@krebitdao/eip712-vc';

import { Wrapper } from './styles';
import { Button } from '../button';
import { CredentialModal } from '../credentialModal';
import { KrebitContext } from '../../context';
import { getVerifiableCredentials } from '../../utils';

const { NEXT_PUBLIC_CHAIN_ID } = process.env;
const { NEXT_PUBLIC_NFT_METADATA_URI } = process.env;
const { NEXT_PUBLIC_IPFS_GATEWAY } = process.env;

export const RareBuddy = () => {
  const { getNFTContract, profile, authStatus, connectCeramic } =
    useContext(KrebitContext);
  const [currentNetworkChainId, setCurrentNetworkChainId] = useState();
  const [nft, setNft] = useState({});
  const [currentErrorStatus, setCurrentErrorStatus] = useState('idle');
  const [status, setStatus] = useState('idle');
  const { query } = useRouter();
  const isLoading = status === 'idle' || status === 'pending';

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

    const getNFTs = async () => {
      const currentTokenId = parseInt(query.tokenId);
      setStatus('pending');

      try {
        const { nftContract } = getNFTContract();

        if (nftContract) {
          const mintPrice = await nftContract.price();
          const currentMintPrice = ethers.utils.formatUnits(mintPrice, 10);

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
            price: currentMintPrice,
            tokenId: currentTokenId,
          });
          setStatus('resolved');
        }
      } catch (error) {
        setStatus('rejected');
        console.error(error);
      }
    };

    getNFTs();
  }, [currentNetworkChainId, query.tokenId]);

  const mintNft = async () => {
    if (authStatus !== 'resolved' || !profile.currentDID) {
      setCurrentErrorStatus('NOT_LOGGED_IN');
      return;
    }

    const verifiableCredentials = await getVerifiableCredentials({
      orderBy: 'issuanceDate',
      orderDirection: 'desc',
      where: {
        credentialSubjectDID: profile.currentDID,
        credentialStatus: 'Issued',
      },
    });
    const credential = verifiableCredentials[0];

    const eip712credential = getEIP712Credential(credential);

    console.log(credential, eip712credential);
  };

  const handleCloseCredentialModal = () => {
    setCurrentErrorStatus('idle');
  };

  const handleConnectCredentialModal = async () => {
    await connectCeramic();
    handleCloseCredentialModal();
  };

  const handlePushRouter = () => {
    window.open('https://testnet.krebit.id/', '_blank');
  };

  if (isLoading) return;

  return (
    <>
      {currentErrorStatus === 'NOT_LOGGED_IN' && (
        <CredentialModal
          title="You're not log in"
          description="You should connect you're wallet to continue"
          buttonText="Connect"
          onClose={handleCloseCredentialModal}
          onClick={handleConnectCredentialModal}
        />
      )}
      {currentErrorStatus === 'MISSING_CREDENTIALS' && (
        <CredentialModal
          title="Missing credentials"
          description="Please go to Krebit DApp to register your credentials"
          buttonText="Go to Krebit DApp"
          onClose={handleCloseCredentialModal}
          onClick={handlePushRouter}
        />
      )}
      <Wrapper currentImage={nft.image}>
        <div className="container">
          <div className="container-image"></div>
          <div className="container-content">
            <p className="container-title">{nft.name}</p>
            <p className="container-description">{nft.description}</p>
            <p className="container-description">
              Price: {parseInt(nft.price, 10).toLocaleString('en-US')}
            </p>
            {nft.owner ? (
              <p className="container-description">Owner: {nft.owner}</p>
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
