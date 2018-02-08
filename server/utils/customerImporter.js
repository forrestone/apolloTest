import fs from'fs';
import path from 'path';
import parse from 'csv-parse';


var parser = parse({columns:true,delimiter: ';'}, function(err, data){
  console.log(data.length)
    const items = data.map((c,i)=>{
        return {
            id : i,
            name : c['Ragione Sociale'],
            partitaIva : c['PartitaIva'],
            tel : c['Numero telefono'],
            fax : c['Numero fax'],
            tipoPag : c['Pagamento'],
            type : ['Cliente'],
            mail : c['Indirizzo E-Mail'],
            address : {
                nazione : c['Nazione'],
                via : c['Indirizzo'],
                cap : c['Cap'],
                loc : c['Localita'],
                prov : c['Prov.']
            }
        }
    })
    const customersData = {
        currentIndex : parser.count++,
        items : items
    }
    saveToFile('./json-storage/customer.json', customersData)
});


const saveToFile = (filepath, object) => {
    fs.writeFile(filepath, JSON.stringify(object), (err)=>{
      if(err) throw err;
      const filename = path.basename(filepath)
      console.log(`the file ${filename} has been saved`)
    })
  }

fs.createReadStream(__dirname+'/anagrafica.csv').pipe(parser);