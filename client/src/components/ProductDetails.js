import React, {Component} from 'react';
import NotFound from './NotFound';
import AddProduct from './AddProduct'
import BatchesDetail from './BatchesDetail'
import {Redirect} from 'react-router';

import {gql, graphql, compose} from 'react-apollo';

/** Styles */
import Container from 'muicss/lib/react/container';
import Button from 'muicss/lib/react/button';

class ProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectTo:"",
      modify: false,
      name: "",
      barcode: "",
      dataScadenza: ""
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
    const $barcode = this.props.match.params.barcode
    const that = this
    this
      .props
      .mutate({
        variables: $barcode,
        optimisticResponse: {
          removeProduct: {
            barcode: $barcode,
            __typename: 'Product'
          }
        }
      })
      .then(data => that.setState({redirectTo:"/products"}));

  }

  reloadPage(){
    window.location.reload();
  }

  renderButtons(){
    return this.state.modify ?
    (
      <Button color="accent" onClick={this.reloadPage}>Annulla</Button>
    ) : 
    (
      <div className="buttonGroup"> 
        <div className="mui-btn" onClick={this.setEditable}>Modifica</div>
        <div className="mui-btn mui-btn--danger"  onClick={this.removeItem}>Elimina</div>
      </div>
    )
  }
  render() {
    const {
      data: {
        loading,
        error,
        product
      }
    } = this.props;
    if (this.state.redirectTo != '') {
      return (
        <Redirect to={this.state.redirectTo}/>
      )
    }
    if (loading) {
      //  return <ProductPreview productId={match.params.productId}/>;
      return <div>Loading</div>;
    }
    if (error) {
      return <p>{error.message}</p>;
    }
    if (product === null) {
      return <NotFound/>
    }
    return (
      <Container>
        <AddProduct product={product} modify={this.state.modify}/>
        {this.renderButtons()}
        <BatchesDetail lotti={product.lotti} barcode={product.barcode}/>
      </Container>
    );
  }
}

const removeProductMutation = gql `
  mutation RemoveProduct($barcode:  String!) {
    removeProduct(barcode: $barcode)
    }
`;

const RemoveProductWithMutation = graphql(removeProductMutation, {
  options: (props) => ({
    variables: {
      barcode: props.match.params.barcode
    }
  })
});

const productDetailsQuery = gql `
  query ProductDetailsQuery($barcode : String!) {
    product(barcode: $barcode) {
      barcode
      name
      imageUrl
      description
      lotti{
        id
        quantita
        posizione
        scadenza
      }
    }
  }
`;

const ProductDetailsQuery = graphql(productDetailsQuery, {
  options: (props) => ({
    variables: {
      barcode: props.match.params.barcode
    },
    options: {
      pollInterval: 5000
    }
  }),

  props: (props) => {
    return {data: props.data};
  }

});

const multiple = compose(ProductDetailsQuery, RemoveProductWithMutation)(ProductDetails);

/*(graphql(removeProductMutation,{
  options: (props) => ({
    variables: {
      productId: props.match.params.productId,
    },
  }),
  props: (props) => {
    return {
      data: props.data,
    };
  }
}))*/
export default multiple
