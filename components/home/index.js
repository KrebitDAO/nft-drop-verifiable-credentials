import { useEffect, useState } from 'react';
import { providers } from 'ethers';

import { getRecord, webClient } from '../../utils/identity';

export const Home = props => {
  const { auth } = props;

  return (
    <div>
      {auth.authStatus !== 'resolved' ? (
        <button onClick={() => auth.connectCeramic()}>Connect</button>
      ) : (
        <>
          <p>{auth.profile?.name}</p>
        </>
      )}
    </div>
  );
};
