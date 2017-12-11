import React, {Component} from 'react';
import {Link} from 'react-router-dom'

import {gql, graphql} from 'react-apollo';

import SelectWithCustomerType from './SelectWithCustomerType';

/*Styles*/
import Form from 'muicss/lib/react/form';
import Button from 'muicss/lib/react/button';
import Input from 'muicss/lib/react/input';
import Textarea from 'muicss/lib/react/textarea';


class AddDDTIntestazione extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modify : true,
      name : "",
      partitaIva :"",
      address : ""
    }
    this.initialstate = Object.assign({}, this.state)
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.resetState = this.resetState.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }


  handleSubmit(evt){
    evt.preventDefault()
    this.setState({
      modify:false
    })
    //this.props.onFormSubmit(this.state)
  }

  handleSelectChange(evt, customer){
    if(!customer)
      return
    const{name,partitaIva,address} = customer
    this.setState({
      name,
      partitaIva,
      address
    })
  }

  resetState() {
    this.setState(this.initialstate)
  }

  handleInputChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  }

  render() {
    if(!this.state.modify)
      return(
        <div>
          <div className="flexRow">
            <span>Destinazione merce</span>
            <div className="flexColumn">
              <span>SPETTABILE</span>
              <span>{this.state.name}</span>
              <span>{this.state.address}</span>
              <span>P.IVA {this.state.partitaIva}</span>
            </div>
          </div>
        </div>
      )
    return (
      <article>
        <h2 className="header">Inserisci i dati per il destiantario o scegline uno dal menu</h2>
        <SelectWithCustomerType type="Cliente" name="cliente" onChange={this.handleSelectChange}/>
        <Form>
            <Input
              label="Nome"
              name="name"
              type="text"
              value={this.state.name}
              onChange={this.handleInputChange}
              floatingLabel={true}
              required={true}/>
            <Input
              label="PartitaIva"
              name="partitaIva"
              type="text"
              value={this.state.partitaIva}
              onChange={this.handleInputChange}
              floatingLabel={true}
              required={true}/>
            <Textarea
              label="Indirizzo"
              name="address"
              value={this.state.address}
              floatingLabel={true}
              onChange={this.handleInputChange}/>
              <Button variant="flat" color="danger"  value={false} onClick={this.resetState}>Annulla</Button>
              <Button variant="flat" color="primary" onClick={this.handleSubmit}>Continua</Button>
        </Form>
      </article>
    );
  }
};

export default AddDDTIntestazione
