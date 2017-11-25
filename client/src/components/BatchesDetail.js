import React, {Component} from 'react';
import NotFound from './NotFound';

import {gql, graphql} from 'react-apollo';

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
            <div className="cell"></div>
          </div>
          {this.state.lotti.map(lotto => {
              return (
                <div key={lotto.id} className='row '>
                  <span className="cell">{lotto.id}</span>
                  <span className="cell">{lotto.quantita}</span>
                  <span className="cell">{lotto.posizione}</span>
                  <span className="cell">{lotto.scadenza}</span>
                  <span className="cell">
                    <RemoveButtonWithMutation lottoID={lotto.id} barcode={this.props.barcode} onHeaderClick={this.updateState}/>
                  </span>
                </div>
              )
            })}
        </div>
        <BatchFormWithMutation  barcode={this.props.barcode} onSubmitHandler={this.updateState}/>
      </Container>
    );
  }
}

class RemoveButton extends Component {
  constructor(props) {
    super(props);
    
    this.removeItem = this.removeItem.bind(this);
    }

  removeItem() {
    this.props.mutate({
        variables: {
          barcode : this.props.barcode,
          id : this.props.lottoID
        }
      })
      .then(res=>this.props.onHeaderClick(res.data.removeBatch))
  }

  render() {
    return (
      <Button color="danger" variant="fab" onClick={this.removeItem}>
        -
      </Button>
    );
  }
}

const removeBatchMutation = gql `
mutation removeBatch($barcode:  String!, $id : String!) {
  removeBatch(barcode: $barcode, id : $id){
    id
    quantita
    posizione
    scadenza
  }
}
`;

const RemoveButtonWithMutation = graphql(removeBatchMutation)(RemoveButton);


class BatchForm extends Component{
  constructor(props) {
    super(props);
    this.state = {
      barcode : this.props.barcode,
      id : "",
      quantita :"" ,
      posizione : "",
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
      <Form className="AddBatch tableList" onSubmit={this.handleSubmit}>
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
            <div className="cell">
              <Button color="primary" variant="fab" >+</Button>
          </div>
      </Form>
    )
  }
}

const addBatchMutation = gql `
mutation addBatch($barcode: String!, $id : String!, $quantita : Int, $scadenza : String, $posizione : String) {
  addBatch(input : {barcode: $barcode, id : $id, quantita : $quantita, scadenza : $scadenza, posizione : $posizione}){
    id
    quantita
    posizione
    scadenza
  }
}
`;

const BatchFormWithMutation = graphql(addBatchMutation)(BatchForm);

/*
const ProductDetailsQuery = graphql(productDetailsQuery, {
  options: (props) => ({
    variables: {
      barcode: props.match.params.barcode
    }
  }),

  props: (props) => {
    return {data: props.data};
  }

});

const multiple = compose(RemoveProductWithMutation)(ProductDetails);

/*(graphql(removeProductMutation,{
  options: (props) => ({
    variables: {
      productId: props.match.params.productId,
    },
  }),
  props: (props) => {
    return {
      data: props.data,
    };
  }
}))*/
/*

const batchDetailsQuery = gql `
query BatchDetailsQuery($barcode : String!) {
  batches(barcode: $barcode){
    id
    quantita
    posizione
    scadenza
  }
}
`;

const BatchDetailsQuery = graphql(batchDetailsQuery) 

const multiple = compose(BatchDetailsQuery)(BatchesDetail);*/
export default BatchesDetail
