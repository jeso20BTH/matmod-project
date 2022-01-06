const nodeHtmlToImage = require('node-html-to-image');

const calc = require('./calculations');

let table = {
    generateSummary: async (name, hva, hf, na) => {
        await nodeHtmlToImage({
            output: `./img/${name}`,
            html: `
                <html>
                    <head>
                        <style>
                            body {
                                display: flex;
                                justify-content: center;
                                width: fit-content;
                                height: fit-content;
                            }
                            table {
                                text-align: center;
                                border-collapse: collapse;
                            }
                            th {
                                border-bottom: 2px solid black;
                            }
                            td {
                                border-bottom: 1px solid black;
                            }
                            td,
                            th {
                                border-right: 1px solid black;
                                padding: 1em;
                            }
                            td:first-of-type,
                            th:first-of-type {
                                border-right: 2px solid black;
                                font-weight: bold;
                            }
                            tr:last-of-type td {
                                border-bottom: none;
                            }
                            tr td:last-of-type {
                                border-right: none;
                            }
                        </style>
                    </head>
                    <body>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Hallands Värderö A</th>
                                <th>Halmstads flygplats</th>
                                <th>Nidingen A</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Medelvärde [°C]</td>
                                <td>${calc.round(hva.mean, 2)}</td>
                                <td>${calc.round(hf.mean, 2)}</td>
                                <td>${calc.round(na.mean, 2)}</td>
                            </tr>
                            <tr>
                                <td>Standardavvikelse</td>
                                <td>${calc.round(hva.stdDev, 2)}</td>
                                <td>${calc.round(hf.stdDev, 2)}</td>
                                <td>${calc.round(na.stdDev, 2)}</td>
                            </tr>
                            <tr>
                                <td>Minvärde</td>
                                <td>${calc.round(hva.extreme.min, 2)}</td>
                                <td>${calc.round(hf.extreme.min, 2)}</td>
                                <td>${calc.round(na.extreme.min, 2)}</td>
                            </tr>
                            <tr>
                                <td>Maxvärde</td>
                                <td>${calc.round(hva.extreme.max, 2)}</td>
                                <td>${calc.round(hf.extreme.max, 2)}</td>
                                <td>${calc.round(na.extreme.max, 2)}</td>
                            </tr>
                            <tr>
                                <td>Korrelation</td>
                                <td>HVA-HF: ${calc.round(hva.corel, 4)}</td>
                                <td>HVA-NA: ${calc.round(hf.corel, 4)}</td>
                                <td>HF-NA: ${calc.round(na.corel, 4)}</td>
                            </tr>
                        </tbody>
                    </table>
                    </body>
                </html>
            `
        })
    },
    generateLinear: async (name, hva, hf, na) => {
        await nodeHtmlToImage({
            output: `./img/${name}`,
            html: `
                <html>
                    <head>
                        <style>
                            body {
                                display: flex;
                                justify-content: center;
                                width: fit-content;
                                height: fit-content;
                            }
                            table {
                                text-align: center;
                                border-collapse: collapse;
                            }
                            th {
                                border-bottom: 2px solid black;
                            }
                            td {
                                border-bottom: 1px solid black;
                            }
                            td,
                            th {
                                border-right: 1px solid black;
                                padding: 1em;
                            }
                            td:first-of-type,
                            th:first-of-type {
                                border-right: 2px solid black;
                                font-weight: bold;
                            }
                            tr:last-of-type td {
                                border-bottom: none;
                            }
                            tr td:last-of-type {
                                border-right: none;
                            }
                        </style>
                    </head>
                    <body>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Hallands Värderö A</th>
                                <th>Halmstads flygplats</th>
                                <th>Nidingen A</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>α</td>
                                <td>${calc.round(hva.linear.coef.a, 2)}</td>
                                <td>${calc.round(hf.linear.coef.a, 2)}</td>
                                <td>${calc.round(na.linear.coef.a, 2)}</td>
                            </tr>
                            <tr>
                                <td>β</td>
                                <td>${calc.round(hva.linear.coef.b, 4)}</td>
                                <td>${calc.round(hf.linear.coef.b, 4)}</td>
                                <td>${calc.round(na.linear.coef.b, 4)}</td>
                            </tr>
                            <tr>
                                <td>y = α +βx</td>
                                <td>
                                    y =
                                    ${calc.round(hva.linear.coef.a, 2)}
                                    ${(calc.round(hva.linear.coef.b, 2) < 0) ? '-' : '+'}
                                    ${calc.round(Math.abs(hva.linear.coef.b), 2)}x
                                </td>
                                <td>
                                    y =
                                    ${calc.round(hf.linear.coef.a, 2)}
                                    ${(calc.round(hf.linear.coef.b, 2) < 0) ? '-' : '+'}
                                    ${calc.round(Math.abs(hf.linear.coef.b), 2)}x
                                </td>
                                <td>
                                    y =
                                    ${calc.round(na.linear.coef.a, 2)}
                                    ${(calc.round(na.linear.coef.b, 2) < 0) ? '-' : '+'}
                                    ${calc.round(Math.abs(na.linear.coef.b), 2)}x
                                </td>
                            </tr>
                            <tr>
                                <td>Konfidensintervall α</td>
                                <td>
                                    ${calc.round(hva.linear.coef.a, 2)} ±
                                    ${calc.round(hva.linear.conf.aDiff, 2)}
                                </td>
                                <td>
                                    ${calc.round(hf.linear.coef.a, 2)} ±
                                    ${calc.round(hf.linear.conf.aDiff, 2)}
                                </td>
                                <td>
                                    ${calc.round(na.linear.coef.a, 2)} ±
                                    ${calc.round(na.linear.conf.aDiff, 2)}
                                </td>
                            </tr>
                            <tr>
                                <td>Konfidensintervall β</td>
                                <td>
                                    ${calc.round(hva.linear.coef.b, 4)} ±
                                    ${calc.round(hva.linear.conf.bDiff, 4)}
                                </td>
                                <td>
                                    ${calc.round(hf.linear.coef.b, 4)} ±
                                    ${calc.round(hf.linear.conf.bDiff, 4)}
                                </td>
                                <td>
                                    ${calc.round(na.linear.coef.b, 4)} ±
                                    ${calc.round(na.linear.conf.bDiff, 4)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    </body>
                </html>
            `
        })
    },
    generateHeatmap: async (name, labels, data) => {
        let zero = '#fff';
        let one = '212, 30, 30'
        let negativeOne = '0, 96, 185'
        let elementStyle = '';
        data.forEach((row, i) => {
            row.forEach((element, j) => {
                let elemNumber = i * row.length + j;
                let color = (element === 0) ? '#fff' : (element > 0) ? `rgba(212, 30, 30, ${element})` : `rgba(0, 96, 185, ${element * -1})`

                elementStyle += `
                    .element${elemNumber} {
                        background-color: ${color};
                        width: 300px;
                        height: 300px;
                        font-size: 36px;
                        ${(i === 0) ? 'border-top: 10px solid #808080;' : ''}
                        ${(j === row.length - 1) ? 'border-right: 10px solid #808080;' : ''}
                    }
                `
            });

        });

        let elements = '';
        data.forEach((row, i) => {
            elements += `<tr><td class="label">${labels[labels.length - (i + 1)]}</td>`;



            row.forEach((element, j) => {
                let elemNumber = i * row.length + j;

                elements += `
                    <td class="element${elemNumber}">${Math.round(element * 10000) / 10000}</td>
                `
            });
            elements += '</tr>'
        });

        elements += `<tr><td></td>`
        labels.forEach((label) => {
            elements += `<td class="label-vertical">${label}</td>`;
        });
        elements += '</tr>'

        await nodeHtmlToImage({
            output: `./img/${name}`,
            html: `
                <html>
                    <head>
                        <style>
                            body {
                                display: flex;
                                justify-content: center;
                                width: ${(data.length + 1) * 300 + 100}px;
                                height: ${(data.length + 1) * 300}px;
                            }
                            table {
                                text-align: center;
                                border-collapse: collapse;
                            }
                            th {
                                border-bottom: 2px solid black;
                            }
                            .label {
                                box-sizing: border-box;
                                width: 300px;
                                height: 300px;
                                text-align: right;
                                font-size: 24px;
                                font-weight: bold;
                                padding-right: 1em;
                                border-right: 10px solid #808080;
                            }
                            .label-vertical {
                                vertical-align: center;
                                text-align: right;
                                font-size: 24px;
                                font-weight: bold;
                                box-sizing: border-box;
                                width: 300px;
                                height: 300px;
                                padding-right: 1em;
                                border-top: 10px solid #808080;
                                transform: rotate(-90deg);
                            }
                            .gradient {
                                width: 60px;
                                height: ${(data.length) * 300}px;
                                border: 3px solid black;
                                margin-left: 20px;
                                margin-right: 20px;
                                background: rgb(212,30,30);
                                background: linear-gradient(180deg, rgba(212,30,30,1) 0%, rgba(255,255,255,1) 50%, rgba(0,96,185,1) 100%);
                                display: flex;
                                flex-direction: column;
                                justify-content: space-between;
                                text-align: center;
                                font-size: 24px;
                            }
                            ${elementStyle}
                        </style>
                    </head>
                    <body>
                    <table>
                        ${elements}
                    </table>
                    <div class="gradient">
                        <p>1</p>
                        <p>0</p>
                        <p>-1</p>
                    </div>
                    </body>
                </html>
            `
        })
    },
    generateVariance: async (name, hva, hf, na) => {
        await nodeHtmlToImage({
            output: `./img/${name}`,
            html: `
                <html>
                    <head>
                        <style>
                            body {
                                display: flex;
                                justify-content: center;
                                width: fit-content;
                                height: fit-content;
                            }
                            table {
                                text-align: center;
                                border-collapse: collapse;
                            }
                            th {
                                border-bottom: 2px solid black;
                            }
                            td {
                                border-bottom: 1px solid black;
                            }
                            td,
                            th {
                                border-right: 1px solid black;
                                padding: 1em;
                            }
                            td:first-of-type,
                            th:first-of-type {
                                border-right: 2px solid black;
                                font-weight: bold;
                            }
                            tr:last-of-type td {
                                border-bottom: none;
                            }
                            tr td:last-of-type {
                                border-right: none;
                            }
                        </style>
                    </head>
                    <body>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Linjär data</th>
                                <th>Transformerad data</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Hallands Värderö A</td>
                                <td>${calc.round(hva.linear, 2)}</td>
                                <td>${calc.round(hva.transformed, 2)}</td>
                            </tr>
                            <tr>
                                <td>Halmstads flygplats</td>
                                <td>${calc.round(hf.linear, 2)}</td>
                                <td>${calc.round(hf.transformed, 2)}</td>
                            </tr>
                            <tr>
                                <td>Nidingen A</td>
                                <td>${calc.round(na.linear, 2)}</td>
                                <td>${calc.round(na.transformed, 2)}</td>
                            </tr>
                        </tbody>
                    </table>
                    </body>
                </html>
            `
        })
    },
}

module.exports = table;
