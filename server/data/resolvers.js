/*import { PubSub } from 'graphql-subscriptions';
import { withFilter } from 'graphql-subscriptions';
import faker from 'faker';
*/
import { PubSub, withFilter } from 'graphql-subscriptions';
import Customer from './customer';
import {Product, Batch} from './product';
import fs from 'fs';
import productImport from '../json-storage/product.json';
import customersImport from '../json-storage/customer.json';

const productsFile = './json-storage/product.json'
const customersFile = './json-storage/customer.json'

const productChangeSubscription = new PubSub();

/**PRODOTTI**/
let productObject = productImport;

const getProducts = ()=>productObject.items

const getProduct = (id) =>{
  return productObject.items.find(product => product.id === id);
}

const  addProduct = (args)=> {
  let newProduct =new Product(args.id, args.name, args.description, args.barcode, args.imageUrl);
  if(productObject.items.some(p=>p.id === args.id)){
     productObject.items.map(p=>p.id!==newProduct.id?p:newProduct)
  }else{
    newProduct.id=++productObject.currentIndex
    productObject.items = productObject.items.concat(newProduct)
  }
  updateProductData()
  productChangeSubscription.publish('productChanged',{productChanged : newProduct})
  return newProduct;
}

const removeProduct = (id)=>{
  let productToRemove = productObject.items.find(product => product.id === id);
  productObject.items = productObject.items.filter((product) => product.id !== id)
  updateProductData()
  return productToRemove
}

const getBatches = (id)=>{
  return getProduct(id).lotti
}

const  addBatch = (args)=> {
  let product = getProduct(args.id)
  product.lotti.push(new Batch(args.id, args.quantita, args.posizione,args.scadenza))
  updateProductData()
  productChangeSubscription.publish('productChanged',{productChanged : product})
  return product.lotti;
}

const removeBatch = (prodId, id)=>{
  let product = getProduct(prodId)
  product.lotti = product.lotti.filter((batch) => batch.id !== id)
  updateProductData()
  productChangeSubscription.publish('productChanged',{productChanged : product})
  return product.lotti
}

/**CLIENTI**/
let customersObject = customersImport

const getCustomers = ()=>{
  return customersObject.items
}

const getCustomer = (id) =>{
  return customersObject.items.find(customer => customer.id === id);
}

const  addCustomer = (args)=> {
  let newCustomer = new Customer(args.id, args.name, args.address, args.partitaIva, args.type, args.description)
  if(customersObject.items.some(c=>c.id === args.id)){
    customersObject.items = customersObject.items.map(c=>c.id!==newCustomer.id?c:newCustomer)
  }else{
    newCustomer.id=++customersObject.currentIndex
    customersObject.items = customersObject.items.concat(newCustomer);
  }
   
  updateCustomerData()
  return newCustomer;
}

const removeCustomer = (id) =>{
  let customerToRemove = customersObject.items.find(customer => customer.id === id);
  customersObject.items = customersObject.items.filter((customer) => customer.id !== id)
  updateCustomerData()
  return customerToRemove
}


export const resolvers = {
  Query : {
    customers: () => getCustomers(),
    customer: (root, {id}) => getCustomer(id),
    products: () => getProducts(),
    product: (root, {id}) => getProduct(id),
    batches : (root, {id}) => getBatches(id)
  },
  Mutation : {
    addCustomer: (root, {input}) => addCustomer(input),
    removeCustomer : (root, {id}) =>removeCustomer(id),
    addProduct: (root, {input}) => addProduct(input),
    removeProduct: (root, {id}) => removeProduct(id),
    addBatch :(root, {input})=> addBatch(input),
    removeBatch:(root, {prodId, id})=>{
      return removeBatch(prodId, id)
    } 
  },
  Subscription : {
    productChanged : {
      subscribe: ()=>productChangeSubscription.asyncIterator('productChanged')
    }
  }
  
};


const saveToFile = (filename, object) => {
  fs.writeFile(filename, JSON.stringify(object), (err)=>{
    if(err) throw err;
    console.log('the file has been saved')
  })
}

const updateProductData = () => {
  saveToFile(productsFile,productObject)
}

const updateCustomerData = () => {
  saveToFile(customersFile,customersObject)
}