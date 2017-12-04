import React from 'react';
import {gql, graphql} from 'react-apollo';
import ImageUpload from './ImageUpload'
import axios from 'axios';
import clientConfig from '../config.js';
import {Redirect} from 'react-router';

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
    this.state = {
      modify: typeof(this.props.modify)!=='undefined'? this.props.modify: true,
      redirectTo : "",
      name: "",
      barcode: "",
      description: "",
      imageUrl: ""
    }
    if (this.props.product) {
      Object.assign(this.state, this.props.product)
    };
    this.handleSubmit = this
      .handleSubmit
      .bind(this);
    this.handleInputChange = this
      .handleInputChange
      .bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ modify: nextProps.modify });  
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
    //@todo check prod already exist https://www.npmjs.com/package/react-confirm
    let that = this;
    this
      .refs
      .imageupload
      ._handleSubmit()
      .then(filename => {

        that.setState({image: filename});

        let formData = that.state;
        that.props.mutate({
            variables: formData,
            update: (store, {data: {
                addProduct
              }}) => {}
          }).then((data)=>that.setState({redirectTo:"/products"})
          )
      })
  }

  handleInputChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  }


  ImageManager() {
    return this.state.modify
      ? <ImageUpload ref="imageupload" submitAction={this.handleImageSubmit}/>
      : (
        <div className="previewImage">
          <img src={this.state.imageUrl} alt={this.state.name}/>
        </div>
      )
  }

  ButtonManager() {
    return this.state.modify
      ? (
        <Button color="primary" type="submit">
          Conferma
        </Button>
      )
      : ""
  }

  render() {

    if (this.state.redirectTo !== '') {
      return (
        <Redirect to={this.state.redirectTo}/>
      )
    }

    return (
      <Container>
        <h1 className="mui--text-center">{this.state.name}</h1>
        <h2 className="mui--text-center">{this.state.barcode}</h2>
        <Form className="AddProduct customForm" onSubmit={this.handleSubmit}>
          <div className="flexRow">
            <div className="flexColumn">
              <Input
                label="Nome Prodotto"
                name="name"
                type="text"
                value={this.state.name}
                disabled={!this.state.modify}
                onChange={this.handleInputChange}
                floatingLabel={true}
                required={true}/>
              <Input
                label="Codice a barre"
                name="barcode"
                type="text"
                value={this.state.barcode}
                disabled={!this.state.modify}
                onChange={this.handleInputChange}
                floatingLabel={true}
                required={true}/>
              <Textarea
                label="Descrizione"
                name="description"
                value={this.state.description}
                disabled={!this.state.modify}
                floatingLabel={true}
                onChange={this.handleInputChange}/>
            </div>
            <div className="flexColumn">
              {this.ImageManager()}
            </div>
          </div>
          {this.ButtonManager()}
        </Form>
      </Container>
    );
  }
}

const addProductMutation = gql `
  mutation AddProduct($name: String!, $barcode : String!, $image : String, $description : String) {
    addProduct(input : {name: $name, barcode : $barcode, imageUrl : $image, description : $description})
  }
`;

const AddProductWithMutation = graphql(addProductMutation)(AddProduct);

export default AddProductWithMutation;