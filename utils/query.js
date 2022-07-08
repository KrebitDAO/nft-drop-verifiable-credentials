import { createClient } from '@urql/core';

const { NEXT_PUBLIC_GRAPH_URL } = process.env;

const verifiableCredentials = /* GraphQL */ `
  query VerifiableCredentials(
    $orderBy: VerifiableCredential_orderBy
    $orderDirection: OrderDirection
    $where: VerifiableCredential_filter
  ) {
    verifiableCredentials(
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      _context
      _type
      claimId
      id
      credentialStatus
      issuer {
        id
        ethereumAddress
      }
      credentialSubject {
        id
        ethereumAddress
        _type
        typeSchema
        value
        encrypted
        trust
        stake
        nbf
        exp
      }
      credentialSchema {
        id
        _type
      }
      issuanceDate
      expirationDate
      transaction
      reason
      disputedBy
    }
  }
`;

const subgraph = createClient({
  url: NEXT_PUBLIC_GRAPH_URL,
});

export const getVerifiableCredentials = async props => {
  const { orderBy, orderDirection, where } = props;

  const result = await subgraph
    .query(verifiableCredentials, {
      orderBy,
      orderDirection,
      where,
    })
    .toPromise();

  return result.data.verifiableCredentials;
};
