import React from 'react';
import {
    gql,
    graphql,
} from 'react-apollo';


const ProductPreview = ({ data: {loading, error, product } }) => {
  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <div>
      <div className="channelName">
        {product.name}
      </div>
      <div>Loading Messages</div>
    </div>);
};

export const productQuery = gql`
  query ProductQuery($channelId : ID!) {
    product(id: $productId) {
      id
      name
    }
  }
`;

export default (graphql(productQuery, {
  options: (props) => ({
    variables: { productId: props.productId },
  }),
})(ProductPreview));
