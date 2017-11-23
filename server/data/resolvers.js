/*import { PubSub } from 'graphql-subscriptions';
import { withFilter } from 'graphql-subscriptions';
import faker from 'faker';
*/

import Customer from './customer';
import Product from './product';

let products = [];
export const getProducts = ()=>products

export const  addProduct = (args)=> {
  newProduct = new Product(args.name, args.description, args.barcode, args.imageUrl);
  products.push(newProduct);
  return newProduct;
}

export const removeProduct = (barcode)=>{
  let itemToRemove = products.find(product => product.barcode === barcode);
  products = products.filter((product) => product.barcode !== barcode)
  return products
}

export const getProduct = (barcode) =>{
  return products.find(product => product.barcode === barcode);
}

let customers = [];
export const getCustomers = ()=>customers

export const  addCustomer = (args)=> {
  newCustomer = new Customer(args.id, args.name, args.address, args.partitaIva, args.description);
  customers.push(newCustomer);
  return newCustomer;
}

export const removeCustomer = (id) =>{
  let customerToRemove = customers.find(customer => customer.id === id);
  customers = customers.filter((customer) => customer.id !== id)
  return customerToRemove
}

export const getCustomers = (id) =>{
  return customers.find(customer => customer.id === id);
}



/*
function addFakeProduct(args) {
  lastProductId++;
  const newProduct = {
    id:  String(lastProductId),
    name: args.name,
    barcode : args.barcode,
    image : args.image,
    dataScadenza : args.dataScadenza
  };
  products.push(newProduct);
}
*/
/*
// Add seed for consistent random data
faker.seed(9);
for (let i = 0; i < 10; i++) {
  addFakeProduct({
    name: faker.random.word(),
    barcode : faker.phone.phoneNumber(),
    image : faker.image.imageUrl(),
    dataScadenza : ''+faker.date.future()
  });
}*/
/*
// generate second channel for initial channel list view
addChannel('channel2');
*/

const pubsub = new PubSub();
