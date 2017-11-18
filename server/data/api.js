import Customer from './customer';
import Product from './product';


    /* CUSTOMERS*/
export const getCustomers = ctx =>
  ctx.db.all('SELECT id, name, address, partitaIva, description FROM customer')
  .then(result => result.map(r => new Customer(r.id, r.name, r.address, r.partitaIva, p.description)));

export const getCustomer = (id, ctx) =>
  ctx.db.all('SELECT id, name, address, partitaIva, description FROM customer  WHERE id=$id', {$id: id})
  .then(r => new Customer(r.id, r.name, r.address, r.partitaIva, p.description));

export const addCustomer = (obj, ctx) => ctx.db.run('INSERT INTO customer (id, name, address, partitaIva, description) VALUES (NULL, $name, $address, $partitaIva, $description )', 
  {$name : obj.name, $name : obj.name, $address: obj.address, $partitaIva: obj.partitaIva, $description :obj.description})
  .then(r => new Customer(r.id, r.name, r.address, r.partitaIva, r.description));

export const changeCustomer = (obj, ctx) => ctx.db.run('UPDATE customer SET name=$name, address=$address, partitaIva=$partitaIva, description=$description  WHERE id=$id', 
  {$name : obj.name, $name : obj.name, $address: obj.address, $partitaIva: obj.partitaIva, $description :obj.description})
  .then(r => true)
  .catch(e => false);
export const removeCustomer = (id, ctx) => {
  ctx.db.run('DELETE FROM customer WHERE id=$id', {$id: id})
  .then(r => console.log(r));
}


    /* PRODUCTS*/
export const getProducts = ctx =>
  ctx.db.all('SELECT name, description, barcode, imageUrl FROM product')
  .then(result => result.map(r => new Product(r.name, r.description, r.barcode, r.imageUrl)));

export const getProduct = (barcode,ctx) =>
  ctx.db.get('SELECT name, description, barcode, imageUrl FROM product  WHERE barcode=$barcode', {$barcode: barcode})
  .then(r => new Product(r.name, r.description, r.barcode, r.imageUrl));


export const addProduct = (obj, ctx) => 
  ctx.db.run('INSERT INTO product (name, description, barcode, imageUrl) VALUES ($name, $description, $barcode, $imageUrl )', 
  {$name : obj.name, $description : obj.description, $barcode: obj.barcode, $imageUrl :obj.imageUrl})
  .then(r => true)
  .catch(e => false);

export const changeProduct = (obj, ctx) => ctx.db.run('UPDATE product SET name=$name, description=$description, imageUrl=$imageUrl  WHERE barcode=$barcode', 
  {$name : obj.name, $description : obj.description, $barcode: obj.barcode, $imageUrl :obj.imageUrl})
  .then(r => true)
  .catch(e => false);

export const removeProduct = (barcode, ctx) => {
  ctx.db.run('DELETE FROM product WHERE barcode=$barcode', {$barcode: barcode})
  .then(r => true)
  .catch(e => false);
}
    