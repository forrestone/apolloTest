import React, {Component} from 'react';
import NotFound from './NotFound';
import AddCustomer from './AddCustomer'

import {gql, graphql, compose} from 'react-apollo';

/** Styles */
import Container from 'muicss/lib/react/container';

class CustomerDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modify: false,
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
    this
      .props
      .mutate({
        variables: $id,
        optimisticResponse: {
          removeCustomer: {
            id: $id,
            __typename: 'Customer'
          }
        }
      })
      .then(data => {
        // console.log(data);
        this
          .props
          .history
          .push('/customers')
      });

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
  mutation RemoveCustomer($id:  String!) {
    removeCustomer(id: $id)
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
  query CustomerDetailsQuery($id : String!) {
    customer(id: $id) {
      id
      name
      description
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
