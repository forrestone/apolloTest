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
  updateProductData(productObject)
  productChangeSubscription.publish('productChanged',{productChanged : newProduct})
  return newProduct;
}

const removeProduct = (id)=>{
  let productToRemove = productObject.items.find(product => product.id === id);
  productObject.items = productObject.items.filter((product) => product.id !== id)
  updateProductData(productObject)
  return productToRemove
}

const getBatches = (id)=>{
  return getProduct(id).lotti
}

const  addBatch = (args)=> {
  let product = getProduct(args.productID)
  product.lotti.push(new Batch(args.id, args.quantita, args.posizione, args.fornitoreID, args.scadenza))
  updateProductData(productObject)
  updateHistoryObj("add",{product:{id:product.id,name : product.name},lotto:args})
  productChangeSubscription.publish('productChanged',{productChanged : product})
  return product.lotti;
}

const decreaseBatch = (prodId, id, quantita) => {
  let product = getProduct(prodId)
  product.lotti = product.lotti.reduce((pre, batch) =>{
    if (batch.id !== id)
      return pre.concat(batch)
     return batch.quantita <= quantita ? pre : pre.concat(Object.assign({}, batch, {quantita : batch.quantita - quantita}))
  },[])
  updateHistoryObj("remove",{product:{id:product.id,name : product.name},lotto:{id,quantita}})
  updateProductData(productObject)
  return product.lotti
}

const removeBatch = (prodId, id)=>{
  let product = getProduct(prodId)
  product.lotti = product.lotti.filter((batch) => batch.id !== id)
  updateProductData(productObject)
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
   
  updateCustomerData(customersObject)
  return newCustomer;
}

const removeCustomer = (id) =>{
  let customerToRemove = customersObject.items.find(customer => customer.id === id);
  customersObject.items = customersObject.items.filter((customer) => customer.id !== id)
  updateCustomerData(customersObject)
  return customerToRemove
}


export const resolvers = {
  Query : {
    customers: (root, {type}) => getCustomers(type),
    customer: (root, {id}) => getCustomer(id),
    products: () => getProducts(),
    product: (root, {id}) => getProduct(id),
    batches : (root, {id}) => getBatches(id),
    batchHistory : () =>Object.keys(productHistoryObj).map(c=>({"date":c, "actions":productHistoryObj[c]}))
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


const updateProductData = (obj) => {
  const productsFile = './json-storage/product.json'
  saveToFile(productsFile,obj)
}

const updateCustomerData = (obj) => {
  const customersFile = './json-storage/customer.json'
  saveToFile(customersFile,obj)
}

const updateHistoryObj = (action, obj) => {
  const productHistoryFile = './json-storage/productHistory.json'
  const today = new Date().toISOString().slice(0,10)
  const message = Object.assign({},{action},obj);
  productHistoryObj[today] = [].concat(message, productHistoryObj[today] || [])

  saveToFile(productHistoryFile, productHistoryObj)

}