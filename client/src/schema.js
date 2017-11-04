export const typeDefs = `

type Product {
  id: ID!
  name: String
  barcode : String
  image : String
  dataScadenza : String
}

type Query {
  products: [Product]
  product(id: ID!): Product
}
`;
