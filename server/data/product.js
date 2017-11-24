export class Product {
  constructor(name, description, barcode, imageUrl) {
    this.name = name;
    this.description = description;
    this.barcode = barcode,
    this.imageUrl = imageUrl,
    this.lotti = []
  }
}

export class Batch{
  constructor(id, quantita, posizione, scadenza){
    this.id = id,
    this.quantita = quantita,
    this.posizione = posizione,
    this.scadenza = scadenza
  }
}

