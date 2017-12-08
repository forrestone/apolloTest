/*import { PubSub } from 'graphql-subscriptions';
import { withFilter } from 'graphql-subscriptions';
import faker from 'faker';
*/
import { PubSub, withFilter } from 'graphql-subscriptions';
import Customer from './customer';
import {Product, Batch} from './product';
import fs from 'fs';
import path from 'path';
import productImport from '../json-storage/product.json';
import customersImport from '../json-storage/customer.json';
import productHistory from '../json-storage/productHistory.json'

const productsFile = './json-storage/product.json'
const customersFile = './json-storage/customer.json'
const productHistoryFile = './json-storage/productHistory.json'

let productHistoryObj = productHistory
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
  let product = getProduct(args.productID)
  product.lotti.push(new Batch(args.id, args.quantita, args.posizione, args.fornitoreID, args.scadenza))
  updateProductData()
  productChangeSubscription.publish('productChanged',{productChanged : product})
  return product.lotti;
}

const decreaseBatch = (prodId, id, quantity) => {
  let product = getProduct(prodId)
  product.lotti = product.lotti.reduce((pre, batch) =>{
    if (batch.id !== id)
      return pre.concat(batch)
     return batch.quantita <= quantity ? pre : pre.concat(Object.assign({}, batch, {quantita : batch.quantita - quantity}))
  },[])
  updateProductData()
  return product.lotti
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

const getCustomers = (type)=>type?customersObject.items.filter(c=>c.type.includes(type)) : customersObject.items

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
    customers: (root, {type}) => getCustomers(type),
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
    decreaseBatch : (root, {prodId, id, quantity}) => decreaseBatch(prodId , id, quantity ),
    removeBatch:(root, {prodId, id})=>removeBatch(prodId, id)
  },
  Subscription : {
    productChanged : {
      subscribe: ()=>productChangeSubscription.asyncIterator('productChanged')
    }
  }
  
};


const saveToFile = (filepath, object) => {
  fs.writeFile(filepath, JSON.stringify(object), (err)=>{
    if(err) throw err;
    const filename = path.basename(filepath)
    console.log(`the file ${filename} has been saved`)
  })
}

const updateProductData = (action, message) => {
  saveToFile(productsFile,productObject)
  updateHistoryObj(action, message)
}

const updateCustomerData = () => {
  saveToFile(customersFile,customersObject)
}

const updateHistoryObj = (action, message) => {
  const today = new Date().toISOString().slice(0,10)
  productHistoryObj[today] = [].concat(message, productHistoryObj[today] || [])

  saveToFile(productHistoryFile, productHistoryObj)

}