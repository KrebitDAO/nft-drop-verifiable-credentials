import { useRouter } from 'next/router';

import { Wrapper } from './styles';
import { Button } from '../button';

export const Home = () => {
  const router = useRouter();

  return (
    <Wrapper>
      <div className="content">
        <h1 className="content-title">Rare Buddies NFTs</h1>
        <p className="content-description">
          An exclusive NFT collection of really unique hand-drawn buddies. Made
          by fuano.eth. Just art, no promises ❤️
        </p>
        <div className="content-button">
          <Button
            text="Mint buddies"
            onClick={() => {
              router.push('/rare-buddies');
            }}
          />
        </div>
      </div>
    </Wrapper>
  );
};
