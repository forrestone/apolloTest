import React, {Component} from 'react';
import {Link} from 'react-router-dom'

import {gql, graphql} from 'react-apollo';

/*Styles*/
import Button from 'muicss/lib/react/button';
import Container from 'muicss/lib/react/container';
import Tabs from 'muicss/lib/react/tabs';
import Tab from 'muicss/lib/react/tab';
import './Styles/ProductsListWithData.css'

class CustomersList extends Component{
  render (){
    const {
      data: {
        loading,
        error,
        customers
      }
    } = this.props;
  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <Container>
      <SelectionTabsWithQuery />
      <div className="customersList tableList" data-component-name="customersList">
        <div className="header">
          <div className="cell">
            Name
          </div>
          <div className="cell">
            partitaIva
          </div>
          <div className="cell">
            Indirizzo
          </div>
          <div className="cell">
            Tipo
          </div>
        </div>
        {customers.map(cm => {
          return (
            <div
              key={cm.id}
              className={'row ' + (cm.id < 0
              ? 'optimistic'
              : '')}>
              <Link
                className="cell"
                to={cm.id < 0
                ? `/`
                : `Customer/${cm.id}`}>
                {cm.name}
              </Link>
              <span className="cell">{cm.partitaIva}</span>
              <span className="cell">{cm.address}</span>
              <span className="cell">{cm.type}</span>
            </div>
          )
        })}
      </div>
      <Link to='/AddCustomer'>
        <Button color="primary">
          Aggiungi cliente
        </Button>
      </Link>
    </Container>
  );
}
};

export const customersListQuery = gql `
  query CustomersListQuery {
    customers{
      id
      name
      partitaIva
      address
      type
    }
  }
`;

class SelectionTabs extends Component{

  render(){
    const {
      data: {
        loading,
        error,
        __type
      }
    } = this.props;

    if (loading) {
      return <p>Loading ...</p>;
    }
    if (error) {
      return <p>{error.message}</p>;
    }

    return (
      <Tabs defaultSelectedIndex={1}>
        {__type.enumValues.map(t=><Tab value={t.name} label={t.name}/>)}
      </Tabs>
    )
  }
};

const getCustomerTypes = gql `
query getTypes{
  __type(name:"CustomerType"){
    enumValues{
      name
    }
  }
} 
`
const SelectionTabsWithQuery = graphql(getCustomerTypes)(SelectionTabs)


export default graphql(customersListQuery, {
  options: {
    pollInterval: 5000
  }
})(CustomersList);
