# SafeLaunch Indexer and Subquery Powered by AssetChain

## Query SafeLaunch Indexer

For this project, you can visit [SafeLaunch Explorer](https://explorer.subquery.network/subquery/KodeSage/safelaunch) and you can try to query with the following GraphQL code to get a taste of how it works.
### GetTokenSwapsByAddress
```graphql

query GetTokenSwapsByAddress {
  tokenSwaps(
    filter: { token: { equalTo: "0x015Ab8FFaD88df696D8ad738F8aC7e3AFc5b7178"} }
    orderBy: TIMESTAMP_DESC
  ) {
    nodes {
      id
      token
      txnType
      amount
      fee
      timestamp
      user
    }
  }
}
```
### Get Latest Token's Deployed and latest Tokens Swapped
```graphql
query {
    tokenInfos (first: 5) {
        nodes {
            id
            tokenAddress
            owner
            name
        }
    }
    tokenSwaps (first: 5) {
        nodes {
            id
            token
            txnType
            amount
        }
    }
}
```




