import Customer from './customer';
import Product from './product';

export const getCustomers = ctx =>
  ctx.db.all('SELECT id, name, address, partitaIva, description FROM customer')
  .then(result => result.map(r => new Customer(r.id, r.name, r.address, r.partitaIva, p.description)));

export const getProducts = ctx =>
  ctx.db.all('SELECT id, name, description, barcode, imageUrl FROM product')
  .then(result => result.map(r => new Product(r.id, r.name, r.description, r.barcode, r.imageUrl)));

export const addProduct = (obj, ctx) => ctx.db.all('INSERT INTO product (id, name, description, barcode, imageUrl) VALUES (NULL, $name, $description, $barcode, $imageUrl )', 
  {$name : obj.name, $description : obj.description, $barcode: obj.barcode, $imageUrl :obj.imageUrl})
  .then(r => new Product(r.id, r.name, r.description, r.barcode, r.imageUrl));

export const removeProduct = (id, ctx) => {
  ctx.db.all('DELETE FROM product WHERE id=$id', {$id: id})
  .then(r => console.log(r));
}
    