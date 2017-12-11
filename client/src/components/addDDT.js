import React, {Component} from 'react';
import AddDDTIntestazione from './AddDDTIntestazione'
import AddDDTProdotti from './AddDDTProdotti'
/*Styles*/
import Container from 'muicss/lib/react/container';

class addDDT extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }


  render() {
    
    return (
      <Container>
          <AddDDTIntestazione />
         <div className="flexRowBase">
            <div className="flexColumn flexCell">
                <span>Numero</span>
                <span>n</span>
            </div>
            <div className="flexColumn flexCell">
                <span>Data Documento</span>
                <span>data</span>
            </div>
            <div className="flexColumn flexCell">
                <span>Cod. cliente</span>
                <span>cod</span>
            </div>
            <div className="flexColumn flexCell">
                <span>Pagamento</span>
                <span></span>
            </div>
         </div>
         <AddDDTProdotti />
      </Container>
    );
  }
};


export default addDDT
