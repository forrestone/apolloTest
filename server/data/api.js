import Customer from './customer';
import Product from './product';

export const getCustomers = ctx =>
  ctx.db.all('SELECT id, name, address, partitaIva, description FROM customer')
  .then(result => result.map(r => new Customer(r.id, r.name, r.address, r.partitaIva, p.description)));

export const getCustomer = (id, ctx) =>
  ctx.db.all('SELECT id, name, address, partitaIva, description FROM customer  WHERE id=$id', {$id: id})
  .then(r => new Customer(r.id, r.name, r.address, r.partitaIva, p.description));

export const addCustomer = (obj, ctx) => ctx.db.run('INSERT INTO customer (id, name, address, partitaIva, description) VALUES (NULL, $name, $address, $partitaIva, $description )', 
  {$name : obj.name, $name : obj.name, $address: obj.address, $partitaIva: obj.partitaIva, $description :obj.description})
  .then(r => new Customer(r.id, r.name, r.address, r.partitaIva, r.description));

export const removeCustomer = (id, ctx) => {
  ctx.db.run('DELETE FROM customer WHERE id=$id', {$id: id})
  .then(r => console.log(r));
}
    

export const getProducts = ctx =>
  ctx.db.all('SELECT id, name, description, barcode, imageUrl FROM product')
  .then(result => result.map(r => new Product(r.id, r.name, r.description, r.barcode, r.imageUrl)));

export const getProduct = (id,ctx) =>
  ctx.db.get('SELECT id, name, description, barcode, imageUrl FROM product  WHERE id=$id', {$id: id})
  .then(r => new Product(r.id, r.name, r.description, r.barcode, r.imageUrl));

export const addProduct = (obj, ctx) => ctx.db.run('INSERT INTO product (id, name, description, barcode, imageUrl) VALUES (NULL, $name, $description, $barcode, $imageUrl )', 
  {$name : obj.name, $description : obj.description, $barcode: obj.barcode, $imageUrl :obj.imageUrl})
  .then(r => new Product(r.id, r.name, r.description, r.barcode, r.imageUrl));

export const removeProduct = (id, ctx) => {
  ctx.db.run('DELETE FROM product WHERE id=$id', {$id: id})
  .then(r => console.log(r));
}
    