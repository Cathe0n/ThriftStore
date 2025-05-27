// src/apollo/client.js
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:8080/public',
  cache: new InMemoryCache(),
});

export default client;