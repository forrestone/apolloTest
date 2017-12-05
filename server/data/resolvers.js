/*import { PubSub } from 'graphql-subscriptions';
import { withFilter } from 'graphql-subscriptions';
import faker from 'faker';
*/
import { PubSub, withFilter } from 'graphql-subscriptions';
import Customer from './customer';
import {Product, Batch} from './product';
import fs from 'fs';
import productsData from '../json-storage/product.json';
import customersData from '../json-storage/customer.json';

let products = productsData;
const productChangeSubscription = new PubSub();

const getProducts = ()=>products

const getProduct = (barcode) =>{
  return products.find(product => product.barcode === barcode);
}

const  addProduct = (args)=> {
  let newProduct =new Product(args.name, args.description, args.barcode, args.imageUrl);
  const productExist = products.some(p=>p.barcode === args.barcode)
  products = productExist ? 
    products.map(p=>p.barcode!==newProduct.barcode?p:newProduct)
    :
    products.concat(newProduct);
  updateProductData()
  productChangeSubscription.publish('productChanged',{productChanged : newProduct})
  return newProduct;
}

const removeProduct = (barcode)=>{
  let itemToRemove = products.find(product => product.barcode === barcode);
  products = products.filter((product) => product.barcode !== barcode)
  updateProductData()
  return products
}

const getBatches = (barcode)=>{
  return getProduct(barcode).lotti
}

const  addBatch = (args)=> {
  let product = getProduct(args.barcode)
  product.lotti.push(new Batch(args.id, args.quantita, args.posizione,args.scadenza))
  updateProductData()
  productChangeSubscription.publish('productChanged',{productChanged : product})
  return product.lotti;
}

const removeBatch = (barcode, id)=>{
  let product = getProduct(barcode)
  product.lotti = product.lotti.filter((batch) => batch.id !== id)
  updateProductData()
  productChangeSubscription.publish('productChanged',{productChanged : product})
  return product.lotti
}

let customers = customersData;
const getCustomers = ()=>customers

const getCustomer = (id) =>{
  return customers.find(customer => customer.id === id);
}

const  addCustomer = (args)=> {
  let newCustomer = new Customer(args.id, args.name, args.address, args.partitaIva, args.type, args.description)
  const customerExist = customers.some(c=>c.id === args.id)
  customers = customerExist ? 
      customers.map(c=>c.id!==newCustomer.id?c:newCustomer)
    :
      customers.concat(newCustomer);
  
  updateCustomerData()
  return newCustomer;
}

const removeCustomer = (id) =>{
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


export const resolvers = {
  Query : {
    customers: () => getCustomers(),
    customer: (root, {id}) => getCustomer(id),
    products: () => getProducts(),
    product: (root, {barcode}) => getProduct(barcode),
    batches : (root, {barcode}) => getBatches(barcode)
  },
  Mutation : {
    addCustomer: (root, {input}) => addCustomer(input),
    removeCustomer : (root, {id}) =>removeCustomer(id),
    addProduct: (root, {input}) => addProduct(input),
    removeProduct: (root, {barcode}) => removeProduct(barcode),
    addBatch :(root, {input})=> addBatch(input),
    removeBatch:(root, {barcode, id})=>{
      return removeBatch(barcode, id)
    } 
  },
  Subscription : {
    productChanged : {
      subscribe: ()=>productChangeSubscription.asyncIterator('productChanged')
    }
  }
  
};
