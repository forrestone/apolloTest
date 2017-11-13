import { buildSchema, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { getCustomers, getProducts, getProduct, addProduct, removeProduct} from './api';

export const schema = buildSchema(`
  type Product {
    name: String,
    description: String,
    barcode: String!,
    imageUrl: String,
    lotti : [Lotto!]
  }

  type Customer {
    id: String!,
    name: String,
    partitaIva: String,
    description: String
  }

  type Lotto{
    id : String!
    quantita : Int
    posizione : String
    scadenza : String
  }

  type Query {
    customers: [Customer],
    products: [Product],
    product(barcode : String!) : Product
  }

  type Mutation {
    addProduct(input: ProductObj): Boolean
    removeProduct(barcode : String!) : Boolean
  }


  input ProductObj {
    name: String,
    description: String,
    barcode: String!,
    imageUrl: String
  }
`);

export const rootValue = {
  customers: (obj, ctx) => getCustomers(ctx),
  products: (obj, ctx) => getProducts(ctx),
  product: (obj, ctx) => getProduct(obj.barcode, ctx),
  addProduct : (obj, ctx) =>addProduct(obj.input, ctx),
  removeProduct :(obj, ctx) =>removeProduct(obj.barcode, ctx)
};
