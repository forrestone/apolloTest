import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ProductsListWithData from './components/ProductsListWithData';
import CustomersListWithData from './components/CustomersListWithData';
import NotFound from './components/NotFound';
import ProductDetails from './components/ProductDetails';
import CustomerDetails from './components/CustomerDetails';
import AddProduct from './components/AddProduct';
import AddCustomer from './components/AddCustomer';
import MainNavigation from './components/MainNavigation';
import BatchHistory from './components/BatchHistory';
import AddDDT from './components/addDDT';

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

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <BrowserRouter>
        <Container>
          <div className="App">
            <MainNavigation />
            <Switch>
              <Route exact path="/" component={ProductsListWithData} />
              <Route exact path="/products" component={ProductsListWithData} />
              <Route exact path="/customers" component={CustomersListWithData} />
              <Route exact path="/addCustomer" component={AddCustomer} />
              <Route exact path="/customer/:id" component={CustomerDetails} />
              <Route exact path="/addProduct" component={AddProduct} />
              <Route exact path="/batchesHystory" component={BatchHistory} />
              <Route exact path="/addDDT" component={AddDDT} />
              <Route path="/product/:id" component={ProductDetails} />
              <Route component={NotFound} />
            </Switch>
          </div>
          </Container>
        </BrowserRouter>
      </ApolloProvider>
    );
  }
}

export default App;
