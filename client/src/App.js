import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LoginPage from './components/LoginPage';

import './App.css'
import Container from 'muicss/lib/react/container';

import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface
} from 'react-apollo';

import {
  SubscriptionClient,
  addGraphQLSubscriptions,
} from 'subscriptions-transport-ws';

const networkInterface = createNetworkInterface({
  uri: `http://${window.location.hostname}:4000/graphql`,
});
networkInterface.use([
  {
    applyMiddleware(req, next) {
      setTimeout(next, 500);
    },
  },
]);

const wsClient = new SubscriptionClient(`ws://${window.location.hostname}:4000/subscriptions`, {
  reconnect: true,
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
);
/*
function dataIdFromObject(result) {
  if (result.__typename) {
    if (result.id !== undefined) {
      return `${result.__typename}:${result.id}`;
    }
  }
  return null;
}
*/

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions
});

class App extends React.Component {
  render() {
      return (
        <ApolloProvider client={client}>
          <BrowserRouter>
            <Route component={LoginPage} />
          </BrowserRouter>
        </ApolloProvider>
      )
    }
}

export default App;
