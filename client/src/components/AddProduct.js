import React from 'react';
import {gql, graphql} from 'react-apollo';
import ImageUpload from './ImageUpload'
import {productsListQuery} from './ProductsListWithData';
import axios from 'axios';
import clientConfig from '../config.json';

/** Styles */
import Button from 'muicss/lib/react/button';
import Container from 'muicss/lib/react/container';
import Form from 'muicss/lib/react/form';
import Input from 'muicss/lib/react/input';
import Textarea from 'muicss/lib/react/textarea';

import "./Styles/AddProduct.css"

class AddProduct extends React.Component {
  constructor(props) {
    super(props);
     let product = this.props.product;
    this.state = {
      modify : false,
      name: "",
      barcode: "",
      descrizione: "",
      image: ""
    };

    this.handleSubmit = this
      .handleSubmit
      .bind(this);
    this.handleInputChange = this
      .handleInputChange
      .bind(this);
  }

  handleImageSubmit(file) {
    let data = new FormData();
    let config = clientConfig;
    data.append('file', file);
    data.append('name', 'test');

    return axios
      .post(config.serverImageUploadUrl, data)
      .then(response => `${config.serverImageUploadUrl}/${file.name}`)
      .catch(error => console.log(error))
  }

  handleSubmit(event) {
    event.preventDefault()

    let filename = this
      .refs
      .imageupload
      ._handleSubmit()
      .then(filename => {

        this.setState({image: filename});

        let formData = this.state;
        this
          .props
          .mutate({

            variables: formData,
            optimisticResponse: {
              addProduct: {
                name: formData.name,
                id: Math.round(Math.random() * -1000000),
                image: filename,
                descrizione: formData.descrizione,
                __typename: 'Product'
              }
            },
            update: (store, {data: {
                addProduct
              }}) => {}
          });
        this.setState({
          // [name]: value
        });
      })

  }

  handleInputChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  }

  render() {
    return (
      <Container>
        <h1 className="mui--text-center">{this.state.name}</h1>
        <Form className="AddProduct" onSubmit={this.handleSubmit}>
        <div className="flexRow">
          <div className="flexColumn">
            <Input  label="Nome Prodotto" name="name" type="text" onChange={this.handleInputChange} floatingLabel={true} required={true}/>
            <Input  label="Codice a barre" name="barcode" type="text" onChange={this.handleInputChange} floatingLabel={true} required={true}/>
            <Textarea label="Descrizione" name="descrizione" type="area" floatingLabel={true} onChange={this.handleInputChange}/>
          </div>
        <ImageUpload ref="imageupload" submitAction={this.handleImageSubmit}/>
        </div>
          <Button color="primary" type="submit" >
            Conferma
          </Button>
          
        </Form>
      </Container>
    );
  }
}

const addProductMutation = gql `
  mutation AddProduct($name: String!, $barcode : String, $image : String, $descrizione : String) {
    addProduct(input : {name: $name, barcode : $barcode, imageUrl : $image, description : $descrizione}) {
      id
      name
      barcode
      imageUrl
      description
    }
  }
`;

const AddProductWithMutation = graphql(addProductMutation,)(AddProduct);

export default AddProductWithMutation;