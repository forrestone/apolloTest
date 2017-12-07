import React, {Component} from 'react';
import NotFound from './NotFound';
import AddCustomer from './AddCustomer'
import {Redirect} from 'react-router';

import {gql, graphql, compose} from 'react-apollo';

/** Styles */
import Container from 'muicss/lib/react/container';

class CustomerDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modify: false,
      redirectTo : "",
      id : "",
      name: "",
      description: "",
      address: "",
      partitaIva: ""
    }
    this.removeItem = this
      .removeItem
      .bind(this);
    this.setEditable = this
      .setEditable
      .bind(this);
  }

  setEditable() {
    this.setState({modify: true})
  }

  removeItem() {
    const $id = this.props.match.params.id
    const that = this
    this
      .props
      .mutate({
        variables: $id,
        optimisticResponse: {
          removeCustomer: {
            id: $id,
            __typename: 'Customer'
          }
        },
        update : (store, {data: {
          removeCustomer
        }})=> {
          store.data[`Customer:${removeCustomer.id}`] = undefined
          return store
        }
      })
      .then(data =>that.setState({redirectTo:"/customers"}));

  }

  renderButtons(){
    return this.state.modify ?
    "" : 
    (
      <div className="buttonGroup"> 
        <div className="mui-btn" onClick={this.setEditable}>Modifica</div>
        <div className="mui-btn mui-btn--danger" onClick={this.removeItem}>Elimina</div>
      </div>
    )
  }
  render() {
    const {
      data: {
        loading,
        error,
        customer
      }
    } = this.props;
    if (this.state.redirectTo !== '') {
      return (
        <Redirect to={this.state.redirectTo}/>
      )
    }
    if (loading) {
      //  return <CustomerPreview customerId={match.params.customerId}/>;
      return <div>Loading</div>;
    }
    if (error) {
      return <p>{error.message}</p>;
    }
    if (customer === null) {
      return <NotFound/>
    }
    return (
      <Container>
        <AddCustomer customer={customer} modify={this.state.modify}/>
        {this.renderButtons()}
      </Container>
    );
  }
}

const removeCustomerMutation = gql `
  mutation RemoveCustomer($id:  Int!) {
    removeCustomer(id: $id){
      id
    }
    }
`;

const RemoveCustomerWithMutation = graphql(removeCustomerMutation, {
  options: (props) => ({
    variables: {
      id: props.match.params.id
    }
  })
});

const customerDetailsQuery = gql `
  query CustomerDetailsQuery($id : Int!) {
    customer(id: $id) {
      id
      name
      description
      type
      address
      partitaIva
    }
  }
`;

const CustomerDetailsQuery = graphql(customerDetailsQuery, {
  options: (props) => ({
    variables: {
      id: props.match.params.id
    }
  }),

  props: (props) => {
    return {data: props.data};
  }

});

const multiple = compose(CustomerDetailsQuery, RemoveCustomerWithMutation)(CustomerDetails);

/*(graphql(removeCustomerMutation,{
  options: (props) => ({
    variables: {
      customerId: props.match.params.customerId,
    },
  }),
  props: (props) => {
    return {
      data: props.data,
    };
  }
}))*/
export default multiple
