import { buildSchema, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { getCustomers, getProducts, addProduct, removeProduct} from './api';

export const schema = buildSchema(`
  type Product {
    id: String!,
    name: String,
    description: String,
    barcode: String,
    imageUrl: String
  }

  type Customer {
    id: String!,
    name: String,
    partitaIva: String,
    description: String
  }

  type Query {
    customers: [Customer],
    products: [Product]
  }

  type Mutation {
    addProduct(input: ProductObj): Product
    removeProduct(id : ID!) : Product
  }


  input ProductObj {
    name: String,
    description: String,
    barcode: String,
    imageUrl: String
  }
`);

export const rootValue = {
  customers: (obj, ctx) => getCustomers(ctx),
  products: (obj, ctx) => getProducts(ctx),
  addProduct : (obj, ctx) =>addProduct(obj.input, ctx),
  removeProduct :(obj, ctx) =>removeProduct(obj.id, ctx)
};
