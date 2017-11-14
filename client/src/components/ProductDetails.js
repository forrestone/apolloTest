import React, { Component } from 'react';
import NotFound from './NotFound';
import { BrowserRouter } from 'react-router-dom';
import AddProduct from './AddProduct'

import {
    gql,
    graphql,
    compose
} from 'react-apollo';

/** Styles */
import Button from 'muicss/lib/react/button';
import Container from 'muicss/lib/react/container';

class ProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      barcode: "",
      dataScadenza: "",
    }
    this.removeItem = this.removeItem.bind(this);
  }

  componentWillMount() {
  }
  removeItem(){
    const $barcode = this.props.match.params.barcode
    this.props.mutate({ 
      variables: $barcode,
      optimisticResponse: {
        removeProduct: {
          barcode: $barcode,
          __typename: 'Product',
        }
      }
    }).then(data=>{
       // console.log(data);
        this.props.history.push('/products')
    });
    
  }

  render() {
    const { data: {loading, error, product }} = this.props;
    if (loading) {
    //  return <ProductPreview productId={match.params.productId}/>;
    return <div>Loading</div>;
    }
    if (error) {
      return <p>{error.message}</p>;
    }
    if(product === null){
      return <NotFound />
    }
    return (
      <div>
      <AddProduct product={product}/>
      <button onClick={this.removeItem}>Elimina articolo</button>
      </div>
    );
  }
}

const removeProductMutation = gql`
  mutation RemoveProduct($barcode:  String!) {
    removeProduct(barcode: $barcode)
    }
`;

const RemoveProductWithMutation = graphql(
  removeProductMutation,{
    options: (props) => ({
      variables: {
        barcode : props.match.params.barcode,
      },
    })
  }
);


const productDetailsQuery = gql`
  query ProductDetailsQuery($barcode : String!) {
    product(barcode: $barcode) {
      barcode
      name
      imageUrl
    }
  }
`;

const ProductDetailsQuery = graphql(
  productDetailsQuery,{
    options: (props) => ({
      variables: {
        barcode: props.match.params.barcode,
      },
    }),
  
    props: (props) => {
      return {
        data: props.data,
      };
    }
  
  })
  ;


  const multiple = compose(
    ProductDetailsQuery,RemoveProductWithMutation
  )(ProductDetails);

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
