import { createClient } from '@urql/core';

const { NEXT_PUBLIC_GRAPH_URI } = process.env;

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
      claimId
      credentialSubject {
        _type
        value
      }
    }
  }
`;

const subgraph = createClient({
  url: NEXT_PUBLIC_GRAPH_URI,
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
