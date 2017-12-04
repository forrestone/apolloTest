import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import {resolvers} from './resolvers';


const typeDefs = `
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


  enum CustomerType{
    Cliente
    Fornitore
    Entrambi
  }

  type Customer {
    id: String!,
    name: String,
    partitaIva: String,
    type : CustomerType,
    description: String,
    address : String
  }

  input CustomerObj {
    id: String!,
    name: String,
    partitaIva: String,
    type : CustomerType,
    description: String,
    address : String
  }

  type Lotto{
    id : String!
    quantita : Int
    posizione : String
    scadenza : String
  }

  input LottoObj{
    id : String!
    barcode: String
    quantita : Int
    posizione : String
    scadenza : String
  }

  type Query {
    customers: [Customer]
    customer(id : String!) : Customer
    products: [Product]
    product(barcode : String!) : Product
    batches(barcode :String!) : [Lotto]
  }

  type Mutation {
    addCustomer(input: CustomerObj) : Boolean
    removeCustomer(id : String!) : Boolean
    addProduct(input: ProductObj): Boolean
    removeProduct(barcode : String!) : Boolean
    addBatch(input : LottoObj) : [Lotto]
    removeBatch(barcode :String!, id: String) : [Lotto]
  }

  type Subscription {
    productChanged : Product
  }
`;
 
const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };