const fs = require('fs')
const csv = require('csv-parser')

const file = {
    data: {
        'hallands_vadero_a': {
            file: './data/20211210_hallands_vadero_a.csv',
            name: 'hallands_vadero_a',
            dates: [],
            times: [],
            data: []
        },
        'halmstad_flygplats': {
            file: './data/20211210_halmstad_flygplats.csv',
            name: 'halmstad_flygplats',
            dates: [],
            times: [],
            data: []
        },
        'nidingen_a': {
            file: './data/20211210_nidingen_a.csv',
            name: 'nidingen_a',
            dates: [],
            times: [],
            data: []
        }
  },
    readFile: async (name) => {
        let print = false;
        let readStream = fs.createReadStream(file.data[name].file)
            .pipe(csv({
                separator: ';',
                headers: ['datum', 'utc', 'temperatur', 'kvalitet']
            }))
        for await (const row of readStream) {
            if (print) {
                delete row['_4']
                delete row['_5']
                file.data[name].dates.push(row.datum)
                file.data[name].times.push(row.utc)
                file.data[name].data.push(parseFloat(row.temperatur))
            }


            if (row.datum && row.datum.toLowerCase() === 'datum') {
                print = true
            }
        }
    }
}

module.exports = file;
