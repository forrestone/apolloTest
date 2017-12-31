import fs from 'fs';
import path from 'path';
import productHistory from '../json-storage/productHistory.json'


let productHistoryObj = productHistory

const saveToFile = (filepath, object) => {
    fs.writeFile(filepath, JSON.stringify(object), (err)=>{
      if(err) throw err;
      const filename = path.basename(filepath)
      console.log(`the file ${filename} has been saved`)
    })
  }

const renameProperty = function (oldName, newName) {
    if (this.hasOwnProperty(oldName)) {
        this[newName] = this[oldName];
        delete this[oldName];
    }
    return this;
};

const fixHistoryObj = () => {
    const productHistoryFile = './json-storage/productHistory.json'
    Object.keys(productHistoryObj).forEach((c)=>{
        productHistoryObj[c].forEach((i)=>{
             renameProperty.apply(i["product"],["id", "productId"])
             renameProperty.apply(i["lotto"],["id", "lottoId"])
        })
    })
    saveToFile(productHistoryFile, productHistoryObj)
}

fixHistoryObj()