import {buildSchema, GraphQLNonNull, GraphQLObjectType} from 'graphql';
import {
  getCustomers,
  getCustomer,
  addCustomer,
  removeCustomer,
  getProducts,
  getProduct,
  addProduct,
  removeProduct
} from './api';

export const schema = buildSchema(`
  type Product {
    name: String,
    description: String,
    barcode: String!,
    imageUrl: String,
    lotti : [Lotto]
  }

  input ProductObj {
    name: String,
    description: String,
    barcode: String!,
    imageUrl: String
  }

  type Customer {
    id: String!,
    name: String,
    partitaIva: String,
    description: String,
    address : String
  }

  input CustomerObj {
    name: String,
    partitaIva: String,
    description: String,
    address : String
  }

  type Lotto{
    id : String!
    quantita : Int
    posizione : String
    scadenza : String
  }

  type Query {
    customers: [Customer]
    customer(id : String!) : Customer
    products: [Product]
    product(barcode : String!) : Product
  }

  type Mutation {
    addCustomer(input: CustomerObj) : Boolean
    removeCustomer(id : String!) : Boolean
    addProduct(input: ProductObj): Boolean
    removeProduct(barcode : String!) : Boolean
  }

`);

export const rootValue = {
  customers: (obj, ctx) => getCustomers(ctx),
  customer: (obj, ctx) => getCustomer(obj.id, ctx),
  addCustomer: (obj, ctx) => addCustomer(obj.input, ctx),
  removeCustomer : (obj,ctx) =>removeCustomer(obj.id,ctx),
  products: (obj, ctx) => getProducts(ctx),
  product: (obj, ctx) => getProduct(obj.barcode, ctx),
  addProduct: (obj, ctx) => addProduct(obj.input, ctx),
  removeProduct: (obj, ctx) => removeProduct(obj.barcode, ctx)
};
