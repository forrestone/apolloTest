import React, { Component } from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import ProductsListWithData from './components/ProductsListWithData';
import CustomersListWithData from './components/CustomersListWithData';
import NotFound from './components/NotFound';
import ProductDetails from './components/ProductDetails';
import CustomerDetails from './components/CustomerDetails';
import AddProduct from './components/AddProduct';
import AddCustomer from './components/AddCustomer';
import MainNavigation from './components/MainNavigation';

import './App.css'

import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
  toIdValue,
} from 'react-apollo';

import {
  SubscriptionClient,
  addGraphQLSubscriptions,
} from 'subscriptions-transport-ws';

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:4000/graphql',
});
networkInterface.use([
  {
    applyMiddleware(req, next) {
      setTimeout(next, 500);
    },
  },
]);

const wsClient = new SubscriptionClient(`ws://localhost:4000/subscriptions`, {
  reconnect: true,
});

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
);

function dataIdFromObject(result) {
  if (result.__typename) {
    if (result.id !== undefined) {
      return `${result.__typename}:${result.id}`;
    }
  }
  return null;
}

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
  customResolvers: {
    Query: {
      product: (_, args) => {
        return toIdValue(
          dataIdFromObject({ __typename: 'Product', id: args['id'] })
        );
      },
    },
  },
  dataIdFromObject,
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <BrowserRouter>
          <div className="App">
            <MainNavigation />
            <Switch>
              <Route exact path="/products" component={ProductsListWithData} />
              <Route exact path="/customers" component={CustomersListWithData} />
              <Route exact path="/addCustomer" component={AddCustomer} />
              <Route exact path="/customer/:id" component={CustomerDetails} />
              <Route exact path="/addProduct" component={AddProduct} />
              <Route path="/product/:barcode" component={ProductDetails} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </BrowserRouter>
      </ApolloProvider>
    );
  }
}

export default App;
