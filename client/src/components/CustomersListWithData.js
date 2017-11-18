import React from 'react';
import {Link} from 'react-router-dom'

import {gql, graphql} from 'react-apollo';

/*Styles*/
import Button from 'muicss/lib/react/button';
import Container from 'muicss/lib/react/container';
import './Styles/ProductsListWithData.css'

const CustomersList = ({
  data: {
    loading,
    error,
    customers
  }
}) => {
  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <Container>
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
            Descrizione
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
              <span className="cell">{cm.description}</span>
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
};

export const customersListQuery = gql `
  query CustomersListQuery {
    customers{
      id
      name
      partitaIva
      address
      description
    }
  }
`;

export default graphql(customersListQuery, {
  options: {
    pollInterval: 5000
  }
})(CustomersList);
