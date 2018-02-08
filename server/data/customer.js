export class Customer {
  constructor(id, name, address, partitaIva, type, description) {
    this.id = id;
    this.name = name;
    this.address = address
    this.partitaIva = partitaIva,
    this.type = type
    this.description = description
  }
}

export class Address {
  constructor (nazione, via, cap, loc, prov){
    this.nazione = nazione;
    this.via = via;
    this.cap = cap;
    this.loc = loc;
    this.prov = prov;
  }
}

export const CustomerSchema =`
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
    address : Address,
    tel : String,
    fax : String,
    tipoPag : String,
    mail : String
  }

  input CustomerObj {
    id: Int,
    name: String,
    partitaIva: String,
    type : [CustomerType]!,
    description: String,
    address : AddressObj,
    tel : String,
    fax : String,
    tipoPag : String,
    mail : String
  }

  input AddressObj {
    nazione : String,
    via : String,
    cap : String,
    loc : String,
    prov : String
  }

  type Address {
    nazione : String,
    via : String,
    cap : String,
    loc : String,
    prov : String
  }`;