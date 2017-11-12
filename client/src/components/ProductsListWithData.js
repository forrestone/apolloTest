import React from 'react';
import {Link} from 'react-router-dom'

import {gql, graphql} from 'react-apollo';

/*Styles*/
import Button from 'muicss/lib/react/button';
import Container from 'muicss/lib/react/container';
import './Styles/ProductsListWithData.css'

const ProductsList = ({
  data: {
    loading,
    error,
    products
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
      <div className="productsList" data-component-name="productList">
        <div className="header">
          <div className="cell">
            Id
          </div>
          <div className="cell">
            Name
          </div>
          <div className="cell">
            BarCode
          </div>
          <div className="cell">
            Quantità
          </div>
          <div className="cell">
            n° Lotti
          </div>
        </div>
        {products.map(pr => {
          let quantita = 0;
          let numLotti = 0;
          if (pr.lotti !== null && Array.isArray(pr.lotti)) {
            quantita = pr
              .lotti
              .reduce((p, c) => p + c.quantita, 0)
            numLotti = pr.lotti.length;
          }
          return (
            <div
              key={pr.id}
              className={'product ' + (pr.id < 0
              ? 'optimistic'
              : '')}>
              <span className="cell">{pr.id}</span>
              <Link
                className="cell"
                to={pr.id < 0
                ? `/`
                : `product/${pr.id}`}>
                {pr.name}
              </Link>
              <span className="cell">{pr.barcode}</span>
              <span className="cell">{quantita}</span>
              <span className="cell">{numLotti}</span>
            </div>
          )
        })}
      </div>
      <Button color="primary">
        <Link to='/AddProduct'>Aggiungi Prodotto</Link>
      </Button>
    </Container>
  );
};

export const productsListQuery = gql `
  query ProductsListQuery {
    products {
      id
      name
      barcode
      lotti{
        quantita
        posizione
      }
    }
  }
`;

export default graphql(productsListQuery, {
  options: {
    pollInterval: 5000
  }
})(ProductsList);
