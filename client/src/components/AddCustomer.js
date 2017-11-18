import React from 'react';
import {gql, graphql} from 'react-apollo';
import axios from 'axios';
import clientConfig from '../config.json';

/** Styles */
import Button from 'muicss/lib/react/button';
import Container from 'muicss/lib/react/container';
import Form from 'muicss/lib/react/form';
import Input from 'muicss/lib/react/input';
import Textarea from 'muicss/lib/react/textarea';

class AddCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modify: typeof(this.props.modify)!=='undefined'? this.props.modify: true,
      name : "",
      partitaIva : "",
      address : "",
      description : ""
    }
    if (this.props.customer) {
      Object.assign(this.state, this.props.customer)
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

  handleSubmit(event) {
    event.preventDefault()
    //@todo check prod already exist https://www.npmjs.com/package/react-confirm
      let formData = this.state;
      this
        .props
        .mutate({
          variables: formData,
          update: (store, {data: {
              AddCustomer
            }}) => {}
        });
      this.setState({
        // [name]: value
      });
  }

  handleInputChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    });
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

    return (
      <Container>
        <h1 className="mui--text-center">{this.state.name}</h1>
        <Form className="AddCustomer customForm" onSubmit={this.handleSubmit}>
          <div className="flexRow">
            <div className="flexColumn">
              <Input
                label="Nome"
                name="name"
                type="text"
                value={this.state.name}
                disabled={!this.state.modify}
                onChange={this.handleInputChange}
                floatingLabel={true}
                required={true}/>
              <Input
                label="PartitaIva"
                name="partitaIva"
                type="text"
                value={this.state.partitaIva}
                disabled={!this.state.modify}
                onChange={this.handleInputChange}
                floatingLabel={true}
                required={true}/>
              <Textarea
                label="Indirizzo"
                name="address"
                value={this.state.address}
                disabled={!this.state.modify}
                floatingLabel={true}
                onChange={this.handleInputChange}/>
              <Textarea
                label="Descrizione"
                name="description"
                value={this.state.description}
                disabled={!this.state.modify}
                floatingLabel={true}
                onChange={this.handleInputChange}/>
            </div>
          </div>
          {this.ButtonManager()}
        </Form>
      </Container>
    );
  }
}

const addCustomerMutation = gql `
  mutation AddProduct($name: String!, $partitaIva : String, $address : String, $description : String) {
    addCustomer(input : {name: $name, partitaIva : $partitaIva, address : $address, description : $description})
  }
`;

const AddCustomerWithMutation = graphql(addCustomerMutation)(AddCustomer);

export default AddCustomerWithMutation;