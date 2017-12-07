import React, {Component} from 'react';
import {Link} from 'react-router-dom'

import {gql, graphql, compose} from 'react-apollo';

/*Styles*/
import Button from 'muicss/lib/react/button';
import Container from 'muicss/lib/react/container';
import Tabs from 'muicss/lib/react/tabs';
import Tab from 'muicss/lib/react/tab';
import './Styles/ProductsListWithData.css'

class CustomersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleType : ""
    }
    this.filter = this.filter.bind(this);
  }

  filter(evt){
    this.setState({ 
      visibleType: evt.props.value
    });
  }
  
  componentWillReceiveProps(nextProps){
    const CustomTypeProp = nextProps.CustomerTypes;
    if (!CustomTypeProp.loading && CustomTypeProp.__type.enumValues.length){
      this.setState({ 
        visibleType: CustomTypeProp.__type.enumValues[0].name,
      });
    }
  }

  render() {
    const {
      CustomerTypes,
      CustomersList
    } = this.props;
    const visibleType = this.state.visibleType
    if (CustomersList.loading || CustomerTypes.loading) {
      return <p>Loading ...</p>;
    }
    if (CustomersList.error || CustomerTypes.error) {
      return <p>{CustomersList.error.message}{CustomerTypes.error.message}</p>;
    }
    return (
      <Container>
        <Tabs defaultSelectedIndex={0}>
          {CustomerTypes.__type.enumValues.map(t=><Tab value={t.name} label={t.name} key={t.name} onActive={this.filter}/>)}
        </Tabs>
        <div className="customersList tableList" data-component-name="customersList">
          <div className="header">
            <div className="cell">
              Name
            </div>
            <div className="cell">
              partitaIva
            </div>
            <div className="cell">
              Indirizzo
            </div>
            <div className="cell">
              Tipo
            </div>
          </div>
          {CustomersList.customers.map((cm) => {
            const isVisible =cm.type.some(t=>t===visibleType);
            if(!isVisible) return""
            return (
              <div
                key={cm.id}
                className={'row'}>
                <Link
                  className="cell"
                  to={`Customer/${cm.id}`}>
                  {cm.name}
                </Link>
                <span className="cell">{cm.partitaIva}</span>
                <span className="cell">{cm.address}</span>
                <span className="cell">{cm.type.join(',')}</span>
              </div>
            )
          })}
        </div>
        <Link to='/AddCustomer'>
          <Button color="primary">
            Aggiungi cliente
          </Button>
        </Link>
      </Container>
    );
  }
};

const customersListQuery = gql `
  query CustomersListQuery {
    customers{
      id
      name
      partitaIva
      address
      type
    }
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
`;


export default compose(
  graphql(getCustomerTypes, {name: 'CustomerTypes'}),
  graphql(customersListQuery, {name: 'CustomersList'})
)(CustomersList)
