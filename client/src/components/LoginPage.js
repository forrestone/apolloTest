import React, {Component} from 'react';
import {Redirect} from 'react-router';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {gql, graphql, withApollo} from 'react-apollo';

import ProductsListWithData from './ProductsListWithData';
import CustomersListWithData from './CustomersListWithData';
import NotFound from './NotFound';
import ProductDetails from './ProductDetails';
import CustomerDetails from './CustomerDetails';
import AddProduct from './AddProduct';
import AddCustomer from './AddCustomer';
import MainNavigation from './MainNavigation';
import BatchHistory from './BatchHistory';
import AddDDT from './addDDT';


import Button from 'muicss/lib/react/button';
import Container from 'muicss/lib/react/container';
import Form from 'muicss/lib/react/form';
import Input from 'muicss/lib/react/input';

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: "",
            loggedIn : false
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(evt) {
        this.setState({
          [evt.target.name]: evt.target.value
        });
      }
    handleSubmit(event) {
        event.preventDefault()
        let password = this.state.password;
        this.props.client.query({
            query : LoginQuery,
            variables : {
                password
            }
        }).then(({data})=>this.setState({loggedIn : data.login}))
    }

    render() {
        if (!this.state.loggedIn) {
            return (
                <Container>
                    <Form onSubmit={this.handleSubmit}>
                    <div>LOGIN</div>
                        <Input
                            label="Password"
                            name="password"
                            type="text"
                            value={this.state.password}
                            onChange={this.handleInputChange}
                            floatingLabel={true}/>
                        <Button color="primary" type="submit">
                            Conferma
                        </Button>
                    </Form>
                </Container>
            )
            //<Redirect to="/products"/>
        } else {
            return (
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
            )
        }
    }
}

const LoginQuery = gql `
  query Login($password : String!){
    login(password:$password)
  } 
`;


export default withApollo(LoginPage)