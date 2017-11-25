/*import { PubSub } from 'graphql-subscriptions';
import { withFilter } from 'graphql-subscriptions';
import faker from 'faker';
*/

import Customer from './customer';
import {Product, Batch} from './product';
import fs from 'fs';
import productsData from '../json-storage/product.json';
import customersData from '../json-storage/customer.json';

let products = productsData;
export const getProducts = ()=>products

export const getProduct = (barcode) =>{
  return products.find(product => product.barcode === barcode);
}

export const  addProduct = (args)=> {
  let newProduct = new Product(args.name, args.description, args.barcode, args.imageUrl);
  products.push(newProduct);
  updateProductData()
  return newProduct;
}

export const removeProduct = (barcode)=>{
  let itemToRemove = products.find(product => product.barcode === barcode);
  products = products.filter((product) => product.barcode !== barcode)
  updateProductData()
  return products
}

export const getBatches = (barcode)=>{
  return getProduct(barcode).lotti
}

export const  addBatch = (args)=> {
  let product = getProduct(args.barcode)
  product.lotti.push(new Batch(args.id, args.quantita, args.posizione,args.scadenza))
  updateProductData()
  return product.lotti;
}

export const removeBatch = (args)=>{
  let product = getProduct(args.barcode)
  product.lotti = product.lotti.filter((batch) => batch.id !== args.id)
  updateProductData()
  return product.lotti
}

let customers = customersData;
export const getCustomers = ()=>customers

export const getCustomer = (id) =>{
  return customers.find(customer => customer.id === id);
}

export const  addCustomer = (args)=> {
  newCustomer = new Customer(args.id, args.name, args.address, args.partitaIva, args.description);
  customers.push(newCustomer);
  updateCustomerData()
  return newCustomer;
}

export const removeCustomer = (id) =>{
  let customerToRemove = customers.find(customer => customer.id === id);
  customers = customers.filter((customer) => customer.id !== id)
  updateCustomerData()
  return customerToRemove
}


const updateProductData = () => {
  fs.writeFile("./json-storage/product.json", JSON.stringify(products), (err)=>{
    if(err) throw err;
    console.log('the file has been saved')
  })
}
const updateCustomerData = () => {
  fs.writeFile("./json-storage/customer.json", JSON.stringify(customers), (err)=>{
    if(err) throw err;
    console.log('the file has been saved')
  })
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
/*
const pubsub = new PubSub();
*/