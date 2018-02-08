export class Product {
  constructor(id, name, description, barcode, imageUrl) {
    this.id = id
    this.name = name
    this.description = description
    this.barcode = barcode
    this.imageUrl = imageUrl
    this.lotti = []
  }
}

export class Batch{
  constructor(id, quantita, posizione,fornitoreID, scadenza){
    this.id = id
    this.quantita = quantita
    this.fornitoreID = fornitoreID
    this.posizione = posizione
    this.scadenza = scadenza
  }
}

export const ProductSchema = `
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
  }`;