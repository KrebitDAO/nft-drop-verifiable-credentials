import { Core } from '@self.id/core';
import { EthereumAuthProvider, SelfID, WebClient } from '@self.id/web';

const { NEXT_PUBLIC_CERAMIC_URL } = process.env;
const { NEXT_PUBLIC_CERAMIC_NETWORK } = process.env;

export const webClient = async props => {
  const {
    ceramicNetwork = NEXT_PUBLIC_CERAMIC_URL || '',
    connectNetwork = NEXT_PUBLIC_CERAMIC_NETWORK || '',
  } = props;
  const ethereum = window.ethereum;

  if (!ethereum) {
    throw new Error('No ethereum wallet detected');
  }

  const client = new WebClient({
    ceramic: ceramicNetwork,
    connectNetwork,
  });

  const [address] = await ethereum.request({ method: 'eth_requestAccounts' });
  console.log('Current address available: ', address);

  const provider = new EthereumAuthProvider(ethereum, address);
  console.log('Current provider available: ', address);

  try {
    await client.authenticate(provider);

    const selfId = new SelfID({ client });

    const id = selfId.did._id;
    console.log('Current ID by DID: ', id);

    return {
      client,
      id,
      selfId,
    };
  } catch (error) {
    console.error(error);
  }
};

export const getRecord = async props => {
  const { schema = 'basicProfile' } = props;
  const ethereum = window.ethereum;

  if (!ethereum) {
    throw new Error('No ethereum wallet detected');
  }

  try {
    const client = new Core({ ceramic: NEXT_PUBLIC_CERAMIC_NETWORK });

    const [address] = await ethereum.request({ method: 'eth_requestAccounts' });
    console.log('Current address available: ', address);

    const did = await client.getAccountDID(`${address}@eip155:1`);
    console.log('Current DID by Address: ', did);

    const record = await client.get(schema, did);
    console.log('Current record by schema: ', record);

    return {
      record,
      id: did,
    };
  } catch (error) {
    console.error(error);
  }
};
