import React, { Component } from 'react';
import NotFound from './NotFound';
import { BrowserRouter } from 'react-router-dom';

import {
    gql,
    graphql,
    compose
} from 'react-apollo';

class ProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id : "",
      name: "",
      barcode: "",
      dataScadenza: "",
    }
    this.removeItem = this.removeItem.bind(this);
  }

  componentWillMount() {
  }
  removeItem(){
    const $id = this.props.match.params.productId
    this.props.mutate({ 
      variables: $id,
      optimisticResponse: {
        removeProduct: {
          id: $id,
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
        <div className="productName">
          {product.name}
        </div>
        <img src={product.image} alt={product.name} />
        <button onClick={this.removeItem}>Elimina articolo</button>
      </div>
    );
  }
}

const removeProductMutation = gql`
  mutation RemoveProduct($productId:  ID!) {
    removeProduct(id: $productId) {
      id
      name
      barcode
      image
      dataScadenza
    }
  }
`;

const RemoveProductWithMutation = graphql(
  removeProductMutation,{
    options: (props) => ({
      variables: {
        productId: props.match.params.productId,
      },
    })
  }
);


const productDetailsQuery = gql`
  query ProductDetailsQuery($productId : ID!) {
    product(id: $productId) {
      id
      name
      image
    }
  }
`;

const ProductDetailsQuery = graphql(
  productDetailsQuery,{
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
