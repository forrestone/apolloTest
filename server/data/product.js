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

