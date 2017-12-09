import React, {Component} from 'react';
import {Link} from 'react-router-dom'

import {gql, graphql} from 'react-apollo';

/*Styles*/
import Button from 'muicss/lib/react/button';
import Container from 'muicss/lib/react/container';
import './Styles/ProductsListWithData.css'

class ProductsList extends Component {
  componentWillMount(){
    this.props.data.subscribeToMore({
      document : messagesSubscription,
      updateQuery : (prev, {subscriptionData})=>{
        if (!subscriptionData.data) {
          return prev;
        }
        const newObj = subscriptionData.data.productChanged;
        let obj = Object.assign({}, prev);
        obj.products = obj.products.map(c=>c.barcode!==newObj.barcode?c:newObj)
        return obj;
      }
    })
  }

  render() {
    const {
      data: {
        loading,
        error,
        products
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
        <div className="productsList tableList" data-component-name="productList">
          <div className="header">
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
                className={'row ' + (pr.barcode < 0
                ? 'optimistic'
                : '')}>
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
        <Link to='/AddProduct'>
          <Button color="primary">
            Aggiungi Prodotto
          </Button>
        </Link>
      </Container>
    );
  };
};

const messagesSubscription = gql `
subscription productChanged {
  productChanged {
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

export default graphql(productsListQuery,{
  options:{
    fetchPolicy : 'network-only'
  }
})(ProductsList);
