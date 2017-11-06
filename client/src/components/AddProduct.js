import React from 'react';
import { gql, graphql } from 'react-apollo';
import ImageUpload from './ImageUpload'
import { productsListQuery } from './ProductsListWithData';
import axios from 'axios';
import clientConfig from '../config.json';

import './Styles/AddProduct.css'

class AddProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      barcode: "",
      dataScadenza: "",
      image : ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleImageSubmit(file) {
      let data = new FormData();
      let config = clientConfig;
      data.append('file', file);
      data.append('name', 'test');
  
      return axios.post(config.serverImageUploadUrl, data)
        .then(response =>`${config.serverImageUploadUrl}/${file.name}`)
        .catch(error => console.log(error))
  }

  handleSubmit(event) {
    event.preventDefault()

    let filename = this.refs.imageupload._handleSubmit()
    .then(filename=>{

      this.setState({
        image: filename
      });

      let formData = this.state;
      this.props.mutate({ 
  
        variables: formData,
        optimisticResponse: {
          addProduct: {
            name: formData.name,
            id: Math.round(Math.random() * -1000000),
            image : filename,
            dataScadenza : formData.dataScadenza,
            __typename: 'Product',
          },
        },
        update: (store, { data: { addProduct } }) => {
          },
      });
      this.setState({
       // [name]: value
      });
    })
    
  }

  handleInputChange(evt){
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
        <ImageUpload ref="imageupload" submitAction={this.handleImageSubmit}/>       
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