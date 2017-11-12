export const typeDefs = `

type Product {
  id: ID!
  name: String
  barcode : String
  image : Strings
  
}

type Query {
  products: [Product]
  product(id: ID!): Product
}
`;
