-- Up
CREATE TABLE product (
  barcode TEXT PRIMARY KEY,
  name TEXT,
  description TEXT,
  imageUrl TEXT
);

CREATE TABLE batch (
  id INTEGER PRIMARY KEY,
  barcode TEXT,
  quantita INTEGER,
  posizione TEXT,
  scadenza TEXT
);

CREATE TABLE customer (
  id INTEGER PRIMARY KEY,
  name TEXT,
  address TEXT,
  partitaIva TEXT,
  description TEXT
);

INSERT INTO product (id, name, description, barcode, imageUrl) VALUES (NULL, 'Facelift', 'Redesign of the UI', '432424234244', 'lorempixel');
INSERT INTO product (id, name, description, barcode, imageUrl) VALUES (NULL, 'Facelift2', 'Redesign of the UI2', '432424234245', 'lorempixel2');

-- Down
DROP TABLE product;
DROP TABLE customer;