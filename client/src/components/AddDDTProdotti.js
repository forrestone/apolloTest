import React, {Component} from 'react';
import {Link} from 'react-router-dom'

import {gql, graphql} from 'react-apollo';

import SelectWithCustomerType from './SelectWithCustomerType';

/*Styles*/
import Form from 'muicss/lib/react/form';
import Button from 'muicss/lib/react/button';
import Input from 'muicss/lib/react/input';
import Textarea from 'muicss/lib/react/textarea';
import './Styles/ProductsListWithData.css'



class AddDDTProdotti extends Component{
  constructor(props) {
    super(props);
    this.state = {
      rows : []
    }

    this.addRow = this.addRow.bind(this)
  }

  addRow(element){
    this.setState({
      rows : this.state.rows.concat([element])
    })
  }

  render(){
    return(
      <div>
        <div className="tableList">
          <div className="header">
            <span className="cell">
              CODICE
            </span>
            <span className="cell">
              DESCRIZIONE
            </span>
            <span className="cell">
              NR.ORDINE
            </span>
            <span className="cell">
              Q.TA
            </span>
            <span className="cell">Q.TA ORDINATA</span>
            <span className="cell">Q.TA SPEDITA</span>
          </div>
        {this.state.rows.map(r=>(
          <div className="row">
            <span className="cell">{r.codice}</span>
            <span className="cell">{r.nome}</span>
            <span className="cell">{r.numOrdine}</span>
            <span className="cell">{r.quantità}</span>
            <span className="cell">{r.quantitàOrdinata}</span>
            <span className="cell">{r.quantitàSpedita}</span>
          </div>
        ))}
        </div>
      <AddDDTProdottiForm onFormSubmit={this.addRow}/>
      </div>
    )
  }

}




class AddDDTProdottiForm extends Component{
  constructor(props) {
    super(props);
    this.state = {
      codice : "",
      nome :"" ,
      numOrdine : "",
      quantità : 0,
      quantitàOrdinata : 0,
      quantitàSpedita : 0
    }
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  
  handleSubmit(event) {
    event.preventDefault()
    this.props.onFormSubmit(this.state)
      this.setState({
        codice : "",
        nome :"" ,
        numOrdine : "",
        quantità : 0,
        quantitàOrdinata : 0,
        quantitàSpedita : 0
      })

  }

  handleInputChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  }
  render(){
    return (
      <Form className="AddBatch row" onSubmit={this.handleSubmit}>
            <Input
              label="Id"
              name="codice"
              type="text"
              className="cell"
              onChange={this.handleInputChange}
              value={this.state.codice}
              floatingLabel={true}
              required={true}/>

            <Input
              label="Nome Prodotto"
              name="nome"
              type="text"
              className="cell"
              floatingLabel={true}
              onChange={this.handleInputChange}
              value={this.state.nome}
              required={true}/>
            <Input
              label="Numero Ordine"
              name="numOrdine"
              type="text"
              className="cell"
              onChange={this.handleInputChange}
              value={this.state.numOrdine}
              floatingLabel={true}/>
            <Input
              label="Quantità"
              name="quantità"
              type="number"
              min={1}
              className="cell"
              onChange={this.handleInputChange}
              value={this.state.quantità}
              floatingLabel={true}
              />
            <Input
              label="Quantità Ordinata"
              name="quantitàOrdinata"
              type="number"
              min={1}
              className="cell"
              onChange={this.handleInputChange}
              value={this.state.quantitàOrdinata}
              floatingLabel={true}
              />
            <Input
              label="Quantità Spedita"
              name="quantitàSpedita"
              type="number"
              min={1}
              className="cell"
              onChange={this.handleInputChange}
              value={this.state.quantitàSpedita}
              floatingLabel={true}
              />
            <div className="cell">
              <Button color="primary" variant="fab" >+</Button>
          </div>
      </Form>
    )
  }
}

export default AddDDTProdotti
