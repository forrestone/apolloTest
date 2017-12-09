import React, {Component} from 'react';
import {Link} from 'react-router-dom'

import {gql, graphql} from 'react-apollo';

/*Styles*/
import Container from 'muicss/lib/react/container';
import './Styles/ProductsListWithData.css'

import './Styles/BatchHistory.css'

class BatchHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    this.filter = this.filter.bind(this);
  }

  filter(evt){

  }

  render() {
    const {
      data: {
        loading,
        error,
        batchHistory
      }
    } = this.props;

    if (loading) {
      return <p>Loading ...</p>;
    }
    if (error) {
      return <p>{error.message}</p>;
    }
    return (
      <Container>
        {batchHistory.map(h=>(
          <div className="tableList batchHistory">
          <h2 className="header" >{h.date}</h2>
           {h.actions.map(a=><HistoryRow action={a}/>)}
          </div>
        ))
        }
      </Container>
    );
  }
};
  //${a.action}, ${a.product.name}, ${a.lotto.id} : ${a.lotto.quantity}
class HistoryRow extends Component{

  render(){
    const action = this.props.action
    return(
      <div className={`row flexRow2 ${action.action}`}>
        <svg viewBox="0 0 36 36">
          <use xlinkHref="arrow.svg#arrow"></use>
        </svg>
        <span className="cell">Prodotto: <Link className="cell" to={`product/${action.product.id}`}>{action.product.name}</Link></span>
        <span className="cell">Lotto: {action.lotto.id}</span>
        <span className="cell">Quantità: {action.lotto.quantita}</span>
      </div>
      
    )
  }
}

const HistoryListQuery = gql `
  query HistoryListQuery {
    batchHistory{
      date
      actions{
        action
        product {
          id
          name
        }
        lotto {
          id
          quantita
        }
      }
    }
  }
`;


export default graphql(HistoryListQuery)(BatchHistory)
