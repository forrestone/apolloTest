import React from 'react';
import {gql, graphql, compose} from 'react-apollo';
import {Redirect} from 'react-router';

/** Styles */
import Button from 'muicss/lib/react/button';
import Container from 'muicss/lib/react/container';
import Select from 'muicss/lib/react/select';
import Option from 'muicss/lib/react/option';
import Form from 'muicss/lib/react/form';
import Input from 'muicss/lib/react/input';
import Textarea from 'muicss/lib/react/textarea';

class AddCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modify: typeof(this.props.modify)!=='undefined'? this.props.modify : true,
      redirectTo : "",
      custmerTypes : [],
      id : "",
      name : "",
      partitaIva : "",
      type : "",
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

    this.setState({ 
      modify: nextProps.modify || this.state.modify,
      custmerTypes : nextProps.getCustomerTypes.__type.enumValues
    });
  }

  handleSubmit(event) {
    event.preventDefault()
    //@todo check prod already exist https://www.npmjs.com/package/react-confirm
      let formData = this.state;
      const that = this
      this
        .props
        .addCustomer({
          variables: formData,
          update: (store, {data: {
              AddCustomer
            }}) => {}
        }).then(that.setState({redirectTo:"/customers"}))
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
    if (this.state.redirectTo !== '') {
      return (
        <Redirect to={this.state.redirectTo}/>
      )
    }

    return (
      <Container>
        <h1 className="mui--text-center">{this.state.name}</h1>
        <Form className="AddCustomer customForm" onSubmit={this.handleSubmit}>
          <div className="flexRow">
            <div className="flexColumn">
            <Input
                label="Id"
                name="id"
                type="text"
                value={this.state.id}
                disabled={!this.state.modify}
                onChange={this.handleInputChange}
                floatingLabel={true}
                required={true}/>
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
              <Select 
                name="type" 
                defaultValue={this.state.type}
                disabled={!this.state.modify}
                onChange={this.handleInputChange}
                >
                {this.state.custmerTypes.map(c=><Option value={c.name} label={c.name} key={c.name}/>)}
              </Select >
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



const addCustomer = gql `
  mutation AddCustomer($id: String!, $name: String!, $partitaIva : String, $address : String, $description : String, $type : CustomerType) {
    addCustomer(input : {id : $id, name: $name, partitaIva : $partitaIva, address : $address, type : $type, description : $description})
  }
`;
const getCustomerTypes = gql `
  query getTypes{
    __type(name:"CustomerType"){
      enumValues{
        name
      }
    }
  } 
`

const AddCustomerWithMutation = compose(
  graphql(addCustomer, {
    name :'addCustomer'
  }), graphql(getCustomerTypes, {name: 'getCustomerTypes'}))(AddCustomer);

export default AddCustomerWithMutation;