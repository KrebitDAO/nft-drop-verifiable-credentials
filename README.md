# decentralized-reputation

Add Reputation to your dAP

/\* useEffect(() => {
const getCurrentVerifiableCredentials = async () => {
const verifiableCredentials = await getVerifiableCredentials({
orderBy: 'issuanceDate',
orderDirection: 'desc',
where: {
credentialSubjectDID: auth?.profile?.currentDID,
credentialStatus: 'Issued',
},
});

      if (verifiableCredentials) {
        setCurrentVerifiableCredentials(verifiableCredentials);
      }
    };

    if (auth?.authStatus === 'resolved') {
      getCurrentVerifiableCredentials();
    }

}, [auth?.authStatus, auth?.profile?.currentDID]); \*/
