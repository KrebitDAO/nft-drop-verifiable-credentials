import { useContext, useState } from 'react';
import Link from 'next/link';

import { Wrapper } from './styles';
import { KrebitContext } from '../../context';
import { Button } from '../button';

export const NavBar = () => {
  const { connectCeramic, authStatus, profile } = useContext(KrebitContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleIsMenuOpen = () => {
    setIsMenuOpen(prevState => !prevState);
  };

  return (
    <Wrapper isMenuOpen={isMenuOpen} authStatus={authStatus}>
      <Link href="/">
        <div className="logo"></div>
      </Link>
      <div className="connect">
        {authStatus === 'resolved' ? (
          <>
            <div className="connect-icon" onClick={handleIsMenuOpen}>
              <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48">
                <path d="M6 36V33H42V36ZM6 25.5V22.5H42V25.5ZM6 15V12H42V15Z" />
              </svg>
            </div>
            {isMenuOpen && (
              <div className="connect-menu-mobile">
                <Link href="/">
                  <a className="connect-text">Home</a>
                </Link>
                <Link href="/rare-buddies">
                  <a className="connect-text">Rare Buddies</a>
                </Link>
                <a className="connect-text">{profile?.name || 'Anonymous'}</a>
              </div>
            )}
            <div className="connect-list">
              <Link href="/">
                <a className="connect-text">Home</a>
              </Link>
              <Link href="/rare-buddies">
                <a className="connect-text">Rare Buddies</a>
              </Link>
              <a className="connect-text">{profile?.name || 'Anonymous'}</a>
            </div>
          </>
        ) : (
          <div className="connect-button">
            <Button text="Connect" onClick={() => connectCeramic()} />
          </div>
        )}
      </div>
    </Wrapper>
  );
};
