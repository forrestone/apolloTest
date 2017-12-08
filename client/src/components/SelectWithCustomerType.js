import React, {Component} from 'react';
import {gql, graphql} from 'react-apollo';

/** Styles */
import Option from 'muicss/lib/react/option';
import Select from 'muicss/lib/react/select';


class SelectWithCustomer extends Component{
    constructor(props) {
        super(props);
        this.onValueChange = this.onValueChange.bind(this)
    }

    onValueChange(evt){
        this.props.onChange(evt)
    }
    render(){
        const {
            data: {
              loading,
              error,
              customers
            }
          } = this.props;

        if (loading) {
        return <p>Loading ...</p>;
        }
        if (error) {
        return <p>{error.message}</p>;
        }

        return(
            <Select name={this.props.name} onChange={this.onValueChange}>
                <Option value={null} label=""/>
                {customers.map(c=><Option  value={c.id} key={c.id} label={`${c.id} ${c.name}`}/>)}
            </Select>
        )
    }
}

const customersListQuery = gql `
query CustomersListQuery($type : CustomerType) {
  customers(type : $type ){
    id
    name
  }
}
`;

const SelectWithCustomerType = graphql(customersListQuery)(SelectWithCustomer);

export default SelectWithCustomerType