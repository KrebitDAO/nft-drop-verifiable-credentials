import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { Card, Wrapper } from './styles';
import { KrebitContext } from '../../context';
import { Button } from '../button';

import { ethers } from 'ethers';
import { getEIP712Credential } from '@krebitdao/eip712-vc';
import krbNFT from '../../schemas/KRBCredentialNFT.json' assert { type: 'json' };

const { NEXT_PUBLIC_NETWORK } = process.env;
const { NEXT_PUBLIC_NFT_METADATA_URI } = process.env;
const { NEXT_PUBLIC_IPFS_GATEWAY } = process.env;
const { NEXT_PUBLIC_NFT_SUPPLY } = process.env;

const NFT_SUPPLY = [...Array(Number(NEXT_PUBLIC_NFT_SUPPLY) + 1).keys()].slice(
  1
);

export const NFTs = () => {
  const { authStatus } = useContext(KrebitContext);
  const [nfts, setNfts] = useState([]);
  const [price, setPrice] = useState('...');
  const router = useRouter();

  const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
  const wallet = ethProvider.getSigner();

  const nftContract = new ethers.Contract(
    krbNFT[NEXT_PUBLIC_NETWORK].address,
    krbNFT.abi,
    wallet
  );

  const mintNFT = async tokenId => {
    //Get olderThan credential from subgraph
    let credential = {
      id: 'ceramic://kjzl6cwe1jw14bbxaaiscosrijhp9otua1nnuabt4v7ywtg6d9pjldo7nmg0em8',
      type: ['VerifiableCredential', 'olderThan'],
      proof: {
        type: 'EthereumEip712Signature2021',
        eip712: {
          types: {
            Issuer: [
              {
                name: 'id',
                type: 'string',
              },
              {
                name: 'ethereumAddress',
                type: 'address',
              },
            ],
            EIP712Domain: [
              {
                name: 'name',
                type: 'string',
              },
              {
                name: 'version',
                type: 'string',
              },
              {
                name: 'chainId',
                type: 'uint256',
              },
              {
                name: 'verifyingContract',
                type: 'address',
              },
            ],
            CredentialSchema: [
              {
                name: 'id',
                type: 'string',
              },
              {
                name: '_type',
                type: 'string',
              },
            ],
            CredentialSubject: [
              {
                name: 'id',
                type: 'string',
              },
              {
                name: 'ethereumAddress',
                type: 'address',
              },
              {
                name: '_type',
                type: 'string',
              },
              {
                name: 'typeSchema',
                type: 'string',
              },
              {
                name: 'value',
                type: 'string',
              },
              {
                name: 'encrypted',
                type: 'string',
              },
              {
                name: 'trust',
                type: 'uint8',
              },
              {
                name: 'stake',
                type: 'uint256',
              },
              {
                name: 'price',
                type: 'uint256',
              },
              {
                name: 'nbf',
                type: 'uint256',
              },
              {
                name: 'exp',
                type: 'uint256',
              },
            ],
            VerifiableCredential: [
              {
                name: '_context',
                type: 'string',
              },
              {
                name: '_type',
                type: 'string',
              },
              {
                name: 'id',
                type: 'string',
              },
              {
                name: 'issuer',
                type: 'Issuer',
              },
              {
                name: 'credentialSubject',
                type: 'CredentialSubject',
              },
              {
                name: 'credentialSchema',
                type: 'CredentialSchema',
              },
              {
                name: 'issuanceDate',
                type: 'string',
              },
              {
                name: 'expirationDate',
                type: 'string',
              },
            ],
          },
          domain: {
            name: 'Krebit',
            chainId: 4,
            version: '0.1',
            verifyingContract: '0xDB13a2Df867495da84764c55d0E82Ded180F7F6d',
          },
          primaryType: 'VerifiableCredential',
        },
        created: '2022-04-19T02:36:27.571Z',
        proofValue:
          '0x86cc93e5becf3527b97ec431ce957a91f73d9c7319e4a96650710b69df9b07136963914d847ae53ed108a89d31aa85fd76b73970253b05991d01d150c2c2d4711b',
        proofPurpose: 'assertionMethod',
        ethereumAddress: '0xd6eef6a4ceb9270776d6b388cfaba62f5bc3357f',
        verificationMethod:
          'did:3:bafyreihk4wgvqpmevke24jbeq3m676mlnfgwj4qr6emrawodfgkzjclndu#ethereumAddress',
      },
      issuer: {
        id: 'did:3:bafyreihk4wgvqpmevke24jbeq3m676mlnfgwj4qr6emrawodfgkzjclndu',
        ethereumAddress: '0xd6eef6a4ceb9270776d6b388cfaba62f5bc3357f',
      },
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://w3id.org/security/suites/eip712sig-2021',
      ],
      issuanceDate: '2022-04-18T14:36:21.792Z',
      expirationDate: '2025-04-19T02:36:21.792Z',
      credentialSchema: {
        id: 'https://github.com/KrebitDAO/eip712-vc',
        type: 'Eip712SchemaValidator2021',
      },
      credentialSubject: {
        id: 'did:3:kjzl6cwe1jw14adv7ry3kncj4m5td78giq81gr44uwn8gpzfrv407gppxevaq79',
        exp: 1745030181,
        nbf: 1650292581,
        type: 'olderThan',
        price: 200000000000000,
        stake: 5,
        trust: 50,
        value: '{"value":"21","description":""}',
        encrypted: 'null',
        typeSchema: 'https://github.com/KrebitDAO/schemas/olderThan',
        ethereumAddress: '0xd9d96fb150136798861363d8ad9fe4033cfc32b3',
      },
    };

    let eip712credential = getEIP712Credential(credential);
    console.log('eip712credential: ', eip712credential);

    //Mint NFT
    if (nftContract) {
      console.log('Minting token: ', tokenId);
      console.log('To: ', wallet.address);

      let tx = await nftContract.mintWithCredential(
        await wallet.getAddress(),
        tokenId,
        eip712credential,
        {
          value: ethers.utils.parseEther(price).toString(),
        }
      );
      console.log('Transaction minting token:', tx);
    }
  };

  useEffect(() => {
    const getPrice = async () => {
      //Get current NFT mint price
      if (nftContract) {
        const mintPrice = await nftContract.price();
        console.log('Mint price: ', ethers.utils.formatUnits(mintPrice, 18));
        setPrice(ethers.utils.formatUnits(mintPrice, 18));
      }
    };

    const getNFTs = async () => {
      const tokens = await Promise.all(
        NFT_SUPPLY.map(async tokenId => {
          //Get metadata from IPFS
          let metadata = await fetch(
            `${NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${NEXT_PUBLIC_NFT_METADATA_URI}/${tokenId}`
          )
            .then(response => response.json())
            .then(data => {
              console.log(data);
              return {
                image: `${NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${data.image.replace(
                  'ipfs://',
                  ''
                )}`,
                name: data.name,
                description: data.description,
                tokenId,
              };
            });

          //Get current owner from contract
          try {
            metadata['owner'] = await nftContract.ownerOf(tokenId);
          } catch (error) {
            metadata['owner'] = false;
          }

          return metadata;
        })
      );
      console.log('tokens: ', tokens);

      if (tokens.length > 0) {
        setNfts(tokens);
      }
    };

    if (authStatus !== 'resolved') {
      router.push('/');
    }
    getNFTs();
    getPrice();
  }, [authStatus]);

  return (
    <Wrapper>
      {nfts.length > 0 &&
        nfts.map((nft, index) => (
          <Card currentNFT={nft.image} key={index}>
            <div className="image" />
            <p className="title">{nft.name}</p>
            <div className="button">
              {nft.owner ? (
                <p className="description">Owner: {nft.owner}</p>
              ) : (
                <>
                  <p className="description">{`Price: $ ${price} ${krbNFT[NEXT_PUBLIC_NETWORK].token}`}</p>

                  <Button onClick={() => mintNFT(nft.tokenId)} text={'Mint'} />
                </>
              )}
            </div>
          </Card>
        ))}
    </Wrapper>
  );
};
