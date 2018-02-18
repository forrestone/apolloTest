export class Customer {
  constructor(id, name, partitaIva, type, address, tel, fax, tipoPag, mail) {
    this.id = id;
    this.name = name;
    this.partitaIva = partitaIva,
    this.type = type,
    this.tel = tel,
    this.fax = fax,
    this.tipoPag = tipoPag,
    this.mail = mail

    this.address = new Address(address)
  }
}

export class Address {
  constructor (obj){
    this.nazione = obj.nazione;
    this.via = obj.via;
    this.cap = obj.cap;
    this.loc = obj.loc;
    this.prov = obj.prov;
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