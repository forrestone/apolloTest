import React from 'react';
import { gql, graphql } from 'react-apollo';
import ImageUpload from './ImageUpload'
import { productsListQuery } from './ProductsListWithData';

import './Styles/AddProduct.css'
/*
const AddProduct = ({ mutate }) => {
  const handleKeyUp = (evt) => {
    if (evt.keyCode === 13) {
      mutate({ 
        variables: { name: evt.target.value },
        optimisticResponse: {
          addChannel: {
            name: evt.target.value,
            id: Math.round(Math.random() * -1000000),
            __typename: 'Channel',
          },
        },
        update: (store, { data: { addChannel } }) => {
            // Read the data from the cache for this query.
            const data = store.readQuery({ query: channelsListQuery });
            // Add our channel from the mutation to the end.
            data.channels.push(addChannel);
            // Write the data back to the cache.
            store.writeQuery({ query: channelsListQuery, data });
          },
      });
      evt.target.value = '';
    }
  };

  return (
    <form onSubmit={this.handleSubmit}> 

    </form >
    <input
      type="text"
      placeholder="New channel"
      onKeyUp={handleKeyUp}
    />
  );
};
*/


class AddProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      barcode: "",
      dataScadenza: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault()
    let formData = this.state;
    this.props.mutate({ 

      variables: formData,
      optimisticResponse: {
        addProduct: {
          name: formData.name,
          id: Math.round(Math.random() * -1000000),
          __typename: 'Product',
        },
      },
      update: (store, { data: { addProduct } }) => {
        //debugger;
          // Read the data from the cache for this query.
        //  const data = store.readQuery({ query: productsListQuery });
          // Add our channel from the mutation to the end.
        //  data.products.push(addProduct);
          // Write the data back to the cache.
        //  store.writeQuery({ query: productsListQuery, data });
        },
    });
    this.setState({
     // [name]: value
    });
  }

  handleInputChange(evt){
   /* console.log(evt.target.name)
    console.log(evt.target.value)*/

    this.setState({
      [evt.target.name]: evt.target.value
    });
  }

  render() {
    return (
      <form className="AddProduct" onSubmit={this.handleSubmit}>
        <label>
          Nome Prodotto:
          <input
            name="name"
            type="text"
            onChange={this.handleInputChange}
          />
        </label>
        <br />
        <label>
          Codice a barre:
          <input
            name="barcode"
            type="text"
            onChange={this.handleInputChange}
          />
        </label>
        <label>
          data di Scadenza:
          <input
            name="dataScadenza"
            type="text"
            onChange={this.handleInputChange}
          />
        </label>
        <br />
        <input type="submit" value="Conferma" />
        <ImageUpload/>       
      </form>
    );
  }
}


const addProductMutation = gql`
  mutation AddProduct($name: String!, $barcode : String, $image : String, $dataScadenza: String) {
    addProduct(name: $name, barcode : $barcode, image : $image,  dataScadenza : $dataScadenza) {
      id
      name
      barcode
      image
      dataScadenza
    }
  }
`;


const AddProductWithMutation = graphql(
  addProductMutation,
)(AddProduct);

export default AddProductWithMutation;