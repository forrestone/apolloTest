import React, {Component} from 'react';
import NotFound from './NotFound';

import {gql, graphql} from 'react-apollo';
import SelectWithCustomerType from './SelectWithCustomerType';
/** Styles */
import Container from 'muicss/lib/react/container';
import Button from 'muicss/lib/react/button';
import Form from 'muicss/lib/react/form';
import Input from 'muicss/lib/react/input';

class BatchesDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modify: false,
      lotti: []
    }

    if (this.props.lotti) {
      Object.assign(this.state.lotti, this.props.lotti)
    };

    this.updateState = this
      .updateState
      .bind(this);

    this.setEditable = this
      .setEditable
      .bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ lotti: nextProps.lotti });  
  }
  setEditable() {
    this.setState({modify: true})
  }
  
  updateState(data){
    this.setState({
      lotti : data
    })
  }

  render() {

    if (this.state.lotti === null) {
      return <NotFound/>
    }
    return (
      <Container>
        <h2>Lotti</h2>
        <div className="LottiList tableList" data-component-name="LottiList">
          <div className="header">
            <div className="cell">
              Id
            </div>
            <div className="cell">
              Quantità
            </div>
            <div className="cell">
              Posizione
            </div>
            <div className="cell">
              Scadenza
            </div>
            <div className="cell">Fornitore</div>
            <div className="cell"></div>
          </div>
          {this.state.lotti.map(lotto => <BatchRowWithMutation key={lotto.id} lotto={lotto} prodId={this.props.prodId} onElementRemove={this.updateState}/>)}
        </div>
        <BatchFormWithMutation  prodId={this.props.prodId} onSubmitHandler={this.updateState}/>
      </Container>
    );
  }
}

class BatchRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      askConfirmation : false,
      quantita : undefined
    }
    this.showReduceform = this.showReduceform.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleSubmit(evt){
    evt.preventDefault()
    this.props.mutate({
      variables: {
        prodId : this.props.prodId,
        id : this.props.lotto.id,
        quantity : this.state.quantita
      }
    })
    .then(res=>{
      this.setState({
        askConfirmation : false
      })
      this.props.onElementRemove(res.data.decreaseBatch)
    })
  }

  handleInputChange(evt){
    this.setState({
      [evt.target.name]: evt.target.value
    });
  }

  showReduceform(evt) {
    evt.preventDefault()
    this.setState({
      askConfirmation : evt.target.value==="true"
    })
  }

  render() {
    const lotto = this.props.lotto
    if(this.state.askConfirmation){
      return(   
         <Form className="flexRow2 modifyBatch attention-color" onSubmit={this.handleSubmit}>
            <span className="">{lotto.id}</span>
            <span className=""> Quantità da rimuovere </span>  
            <Input
              label="quantità"
              name="quantita"
              type="number"
              className=""
              max={lotto.quantita}
              min={1}
              onChange={this.handleInputChange}
              value={this.state.quantity}
              floatingLabel={true}
              required={true}/>
              <span className=""> MAX {lotto.quantita} </span>
              <Button variant="flat" color="danger"  value={false} onClick={this.showReduceform}>Annulla</Button>
              <Button variant="flat" color="primary" onClick={this.handleSubmit}>Conferma</Button>
          </Form>
      )
    }
    return (
      <div className='row '>
        <span className="cell">{lotto.id}</span>
        <span className="cell">{lotto.quantita}</span>
        <span className="cell">{lotto.posizione}</span>
        <span className="cell">{lotto.scadenza}</span>
        <span className="cell">{lotto.fornitoreID}</span>
        <span className="cell">
        <Button color="danger" variant="fab" value={true} onClick={this.showReduceform}>
          -
        </Button>
      </span>
    </div>
    );
  }
}

const removeBatchMutation = gql `
mutation decreaseBatch($prodId:  Int!, $id : String!, $quantity : Int) {
  decreaseBatch(prodId: $prodId, id : $id, quantity : $quantity){
    id
    quantita
    posizione
    scadenza
  }
}
`;

const BatchRowWithMutation = graphql(removeBatchMutation)(BatchRow);


class BatchForm extends Component{
  constructor(props) {
    super(props);
    this.state = {
      prodId : this.props.prodId,
      id : "",
      quantita :"" ,
      posizione : "",
      fornitoreId : undefined,
      scadenza : ""
    }
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }
  
  handleSubmit(event) {
    event.preventDefault()
    this.props.mutate({
      variables: this.state
    }).then(res=> {
      this.setState({
        id : "",
        quantita :"" ,
        posizione : "",
        fornitoreId : undefined,
        scadenza : ""
      })
      this.props.onSubmitHandler(res.data.addBatch)
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
              name="id"
              type="text"
              className="cell"
              onChange={this.handleInputChange}
              value={this.state.id}
              floatingLabel={true}
              required={true}/>

            <Input
              label="Quantità"
              name="quantita"
              type="number"
              min={1}
              className="cell"
              floatingLabel={true}
              onChange={this.handleInputChange}
              value={this.state.quantita}
              required={true}/>
            <Input
              label="Posizione"
              name="posizione"
              className="cell"
              onChange={this.handleInputChange}
              value={this.state.posizione}
              floatingLabel={true}/>
            <Input
              name="scadenza"
              type="date"
              className="cell"
              onChange={this.handleInputChange}
              value={this.state.scadenza}
              floatingLabel={true}
              />
              <SelectWithCustomerType type="Fornitore" name="fornitoreID" onChange={this.handleInputChange}/>
            <div className="cell">
              <Button color="primary" variant="fab" >+</Button>
          </div>
      </Form>
    )
  }
}

const addBatchMutation = gql `
mutation addBatch($prodId: Int!, $id : String!, $quantita : Int, $scadenza : String, $fornitoreID : Int, $posizione : String) {
  addBatch(input : {productID: $prodId, id : $id, quantita : $quantita, scadenza : $scadenza, fornitoreID :$fornitoreID, posizione : $posizione}){
    id
    quantita
    fornitoreID
    posizione
    scadenza
  }
}
`;

const BatchFormWithMutation = graphql(addBatchMutation)(BatchForm);

export default BatchesDetail
