import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import BatchHistoryInfo from './schemaBatchHistory'
import {resolvers} from './resolvers';


const baseDefs = `
  type Product {
    id : Int!,
    name: String,
    description: String,
    barcode: String,
    imageUrl: String,
    lotti : [Lotto]
  }

  input ProductObj {
    id : Int,
    name: String,
    description: String,
    barcode: String,
    imageUrl: String
  }

  enum CustomerType{
    Cliente
    Fornitore
  }

  type Customer {
    id: Int!,
    name: String,
    partitaIva: String,
    type : [CustomerType]!,
    description: String,
    address : String
  }

  input CustomerObj {
    id: Int,
    name: String,
    partitaIva: String,
    type : [CustomerType]!,
    description: String,
    address : String
  }

  type Lotto{
    id : String!
    quantita : Int
    fornitoreID : Int
    posizione : String
    scadenza : String
  }

  input LottoObj{
    id : String!
    productID: Int
    fornitoreID : Int
    quantita : Int
    posizione : String
    scadenza : String
  }

  type Query {
    customers(type : CustomerType): [Customer]
    customer(id : Int!) : Customer
    products: [Product]
    product(id : Int!) : Product
    batches(id : Int!) : [Lotto]

  }

  type Mutation {
    addCustomer(input: CustomerObj) : Customer
    removeCustomer(id : Int!) : Customer
    addProduct(input: ProductObj): Product
    removeProduct(id : Int!) : Product
    addBatch(input : LottoObj) : [Lotto]
    decreaseBatch(prodId :Int!, id: String, quantity : Int) : [Lotto]
    removeBatch(prodId :Int!, id: String) : [Lotto]
  }

  type Subscription {
    productChanged : Product
  }
`;
 
const schema = makeExecutableSchema({ typeDefs:[baseDefs,BatchHistoryInfo], resolvers });
export { schema };