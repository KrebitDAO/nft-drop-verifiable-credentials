import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';

import { Card, Wrapper } from './styles';
import { Button } from '../button';
import { KrebitContext } from '../../context';

import krbNFT from '../../schemas/KRBCredentialNFT.json' assert { type: 'json' };

const { NEXT_PUBLIC_NETWORK } = process.env;
const { NEXT_PUBLIC_CHAIN_ID } = process.env;
const { NEXT_PUBLIC_NFT_METADATA_URI } = process.env;
const { NEXT_PUBLIC_IPFS_GATEWAY } = process.env;
const { NEXT_PUBLIC_NFT_SUPPLY } = process.env;

export const RareBuddies = () => {
  const { getNFTContract, isConnectionReady } = useContext(KrebitContext);
  const [currentNetworkChainId, setCurrentNetworkChainId] = useState();
  const [nfts, setNfts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!window || !window.ethereum) return;

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
      const { nftContract } = getNFTContract();

      if (nftContract) {
        const mintPrice = await nftContract.price();
        console.log('Mint price: ', ethers.utils.formatUnits(mintPrice, 18));
        const currentMintPrice = ethers.utils.formatUnits(mintPrice, 18);

        const tokens = await Promise.all(
          [...Array(parseInt(NEXT_PUBLIC_NFT_SUPPLY, 10))].map(
            async (_, tokenId) => {
              let currentTokenId = tokenId + 1;
              let metadata = await fetch(
                `${NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${NEXT_PUBLIC_NFT_METADATA_URI}/${currentTokenId}`
              ).then(res => res.json());

              try {
                metadata['owner'] = await nftContract.ownerOf(currentTokenId);
              } catch (error) {
                metadata['owner'] = undefined;
              }

              return {
                ...metadata,
                image: `${NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${metadata.image.replace(
                  'ipfs://',
                  ''
                )}`,
                price: currentMintPrice,
                tokenId: currentTokenId,
              };
            }
          )
        );

        if (tokens.length > 0) {
          setNfts(tokens);
        }
      }
    };

    getNFTs();
  }, [currentNetworkChainId, isConnectionReady]);

  const handlePushNFTView = tokenId => {
    router.push(`/rare-buddies/${tokenId}`);
  };

  if (!isConnectionReady) return;

  return (
    <Wrapper>
      {nfts.length > 0 &&
        nfts.map((nft, index) => (
          <Card currentNFT={nft.image} key={index}>
            <div className="image" />
            <p className="title">{nft.name}</p>
            {nft.owner ? (
              <p className="description">Owner: {nft.owner}</p>
            ) : (
              <p className="description">
                Price: {nft.price} {krbNFT[NEXT_PUBLIC_NETWORK].token}
              </p>
            )}
            <div className="button">
              <Button
                onClick={() => handlePushNFTView(nft.tokenId)}
                text="See more"
              />
            </div>
          </Card>
        ))}
    </Wrapper>
  );
};
