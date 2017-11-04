import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';

import { resolvers } from './resolvers';

const typeDefs = `
type Product {
  id: ID!                # "!" denotes a required field
  name: String
  barcode : String
  image : String
  dataScadenza : String
}

type ProductBox{
  id : ID!
  product : Product
  quantity : Int
  scaffale : String
}


# This type specifies the entry points into our API
type Query {
  products: [Product]
  product(id: ID!): Product
}

# The mutation root type, used to define all mutations
type Mutation {
  addProduct(name: String!,  barcode : String, image : String, dataScadenza : String): Product
  removeProduct(id : ID!) : Product
  # addMessage(message: MessageInput!): Message
}

# The subscription root type, specifying what we can subscribe to
type Subscription {
  productAdded(product: ID!): Product
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };
