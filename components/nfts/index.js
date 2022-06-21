import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Card, Wrapper } from './styles';
import { KrebitContext } from '../../context';
import { Button } from '../button';

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

export const NFTs = () => {
  const { authStatus } = useContext(KrebitContext);
  const router = useRouter();

  useEffect(() => {
    if (authStatus !== 'resolved') {
      router.push('/');
    }
  }, [authStatus]);

  return (
    <Wrapper>
      {NFT_IMAGES.map((nft, index) => (
        <Card currentNFT={nft} key={index}>
          <div className="image" />
          <p className="title">This is my NFT</p>
          <p className="description">This is my NFT</p>
          <div className="button">
            <Button onClick={() => {}} text="Mint" />
          </div>
        </Card>
      ))}
    </Wrapper>
  );
};
