import React, { Component } from 'react';
import ProductPreview from './ProductPreview';
import NotFound from './NotFound';

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
    /*this.setState({
      name : product.name,
      id : product.id
    })*/
   /* this.props.data.subscribeToMore({
      document: messagesSubscription,
      variables: {
        productId: this.props.match.params.productId,
      },
      updateQuery: (prev, {subscriptionData}) => {
        if (!subscriptionData.data) {
          return prev;
        }
        const newMessage = subscriptionData.data.messageAdded;

        // don't double add the message
        if (!prev.channel.messages.find((msg) => msg.id === newMessage.id)) {
          return Object.assign({}, prev, {
            channel: Object.assign({}, prev.channel, {
              messages: [...prev.channel.messages, newMessage],
            })
          });
        } else {
          return prev;
        }
      }
    })*/
  }
  removeItem(){
    const id = this.props.match.params.productId
    console.log(id)
    this.props.mutate({ 
      variables: id,
      optimisticResponse: {
        removeProduct: {
          id: id,
          __typename: 'Product',
        },
      },
      update: (store, { data: { removeProduct } }) => {
        },
    });
  }

  render() {
    const { data: {loading, error, product }, match/*, loadOlderMessages*/ } = this.props;
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
  mutation RemoveProduct($id:  ID!) {
    removeProduct(id: $id) {
      id
      name
      barcode
      image
      dataScadenza
    }
  }
`;

const productDetailsQuery = gql`
  query ProductDetailsQuery($productId : ID!) {
    product(id: $productId) {
      id
      name
      image
    }
  }
`;


const RemoveProductWithMutation = graphql(
  removeProductMutation,
);

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
