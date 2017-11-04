import React from 'react';
import {
  Link
} from 'react-router-dom'

import {
    gql,
    graphql,
} from 'react-apollo';

import './Styles/ProductsListWithData.css'


const ProductsList = ({ data: {loading, error, products }}) => {
  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }

  return (
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
        Scadenza
      </div>
    </div>
      { products.map( pr =>
        (<div key={pr.id} className={'product ' + (pr.id < 0 ? 'optimistic' : '')}>
          <span className="cell">{pr.id}</span>
          <Link className="cell" to={pr.id < 0 ? `/` : `product/${pr.id}`}>
            {pr.name}
          </Link>
          <span className="cell">{pr.barcode}</span>
          <span className="cell">{pr.dataScadenza}</span>
        </div>)
      )}
    </div>
  );
};

export const productsListQuery = gql`
  query ProductsListQuery {
    products {
      id
      name
      barcode
      dataScadenza
    }
  }
`;

export default graphql(productsListQuery, {
  options: { pollInterval: 5000 },
})(ProductsList);
