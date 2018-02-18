import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import BatchHistoryInfo from './schemaBatchHistory'
import {resolvers} from './resolvers';
import { CustomerSchema } from './customer';
import { ProductSchema } from './product';



const baseDefs = `

  type Query {
    customers(type : CustomerType): [Customer]
    customer(id : Int!) : Customer
    products: [Product]
    product(id : Int!) : Product
    batches(id : Int!) : [Lotto]
    login(password: String!) : Boolean
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
 
const schema = makeExecutableSchema({ typeDefs:[baseDefs,BatchHistoryInfo, CustomerSchema, ProductSchema], resolvers });
export { schema };