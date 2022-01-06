const fs = require('fs')
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const plot = {
    createPlot: async (data) => {
        let width = data.width;
        let height = data.height;

        const configuration = {
            data: {
                labels: data.labels,
                datasets: data.datasets
            },
            options: data.options,
            plugins: [{
                id: 'background-colour',
                beforeDraw: (chart) => {
                    const ctx = chart.ctx;
                    ctx.save();
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, width, height);
                    ctx.restore();
                }
            }]
        };
        const chartCallback = (ChartJS) => {
            ChartJS.defaults.maintainAspectRatio = false;
        };
        const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });
        const buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
        await fs.promises.writeFile(`./img/${data.filename}`, buffer, 'base64');
    },
    generateDataset: (data) => {
        return {
            type: data.type,
            label: data.name,
            data: data.data,
            borderColor: data.color,
            borderWidth: data.borderWidth || 4,
            pointRadius: data.pointRadius || 0,
            backgroundColor: data.backgroundColor || 'rgba(0,0,0,0)',
            showLine: (data.showLine === false) ? false : true,
            fill: (data.fill !== undefined) ?data.fill : false
        }
    },
    generateAxisLabel: (text, fontSize) => {
        return {
            display: true,
            text: text,
            font: {size: fontSize}
        }
    },
    generateTitle: (text, fontSize) => {
        return {
            display: true,
            text: text,
            font: {size: fontSize}
        }
    },
    visualisationPlot: async (hva, hf, na, labels) => {
        let hvaDataVisualisationPlot = {
             type: 'line',
             name: 'Hallands Väderö A',
             data: hva,
             color: '#2c45b3',
             borderWidth: 2
        };
        let hfDataVisualisationPlot = {
             type: 'line',
             name: 'Halmstad flygplats',
             data: hf,
             color: '#b32c2c',
             borderWidth: 2
        };
        let naDataVisualisationPlot = {
             type: 'line',
             name: 'Nidingen A',
             data: na,
             color: '#1b9f00',
             borderWidth: 2
        };

        let visulationPlot = {
            width: 1800,
            height: 1200,
            labels: labels,
            datasets: [
                plot.generateDataset(hvaDataVisualisationPlot),
                plot.generateDataset(hfDataVisualisationPlot),
                plot.generateDataset(naDataVisualisationPlot),
            ],
            options: {
                plugins: {
                    legend: {labels: {font: {size: 18}}},
                    title: plot.generateTitle('Temperaturer 2021-08-02 - 2021-12-10', 30)
                },
                scales: {
                    x: {
                        ticks: {font: {size: 20}},
                        title: plot.generateAxisLabel('Datum [yyyy-mm-dd]', 20)
                    },
                    y: {
                        ticks: {font: {size: 20}},
                        title: plot.generateAxisLabel('Temperatur [°C]', 20)
                    }
                },
                elements: {point: {radius: 0}}
            },
            filename: 'plot_visualisation.png'
        }

        await plot.createPlot(visulationPlot);
    },
    histogramPlot: async (hvaGaus, hfGaus, naGaus, hvaData, hfData, naData, labels) => {
        let hvaDataHistogramScatterPlot = {
            type: 'scatter',
            name: 'Hallands Väderö A - Normalfördelning',
            data: hvaGaus,
            color: '#000191'
        };
        let hfDataHistogramScatterPlot = {
            type: 'scatter',
            name: 'Halmstad flygplats - Normalfördelning',
            data: hfGaus,
            color: '#6c0215'
        };
        let naDataHistogramScatterPlot = {
            type: 'scatter',
            name: 'Nidingen A - Normalfördelning',
            data: naGaus,
            color: '#084500'
        };
        let hvaDataHistogramBarPlot = {
            type: 'bar',
            name: 'Hallands Väderö A',
            data: hvaData,
            color: '#2c45b3',
            backgroundColor: '#2c45b3'
        };
        let hfDataHistogramBarPlot = {
            type: 'bar',
            name: 'Halmstad flygplats',
            data: hfData,
            color: '#b32c2c',
            backgroundColor: '#b32c2c'
        };
        let naDataHistogramBarPlot = {
            type: 'bar',
            name: 'Nidingen A',
            data: naData,
            color: '#1b9f00',
            backgroundColor: '#1b9f00'
        };

        let histogramPlot = {
            width: 1800,
            height: 1200,
            labels: labels,
            datasets: [
                plot.generateDataset(hvaDataHistogramScatterPlot),
                plot.generateDataset(hfDataHistogramScatterPlot),
                plot.generateDataset(naDataHistogramScatterPlot),
                plot.generateDataset(hvaDataHistogramBarPlot),
                plot.generateDataset(hfDataHistogramBarPlot),
                plot.generateDataset(naDataHistogramBarPlot),
            ],
            options: {
                plugins: {
                    legend: {labels: {font: {size: 18}}},
                    title: plot.generateTitle('Histogram temperaturer 2021-08-02 - 2021-12-10', 30)
                },
                scales: {
                    x: {
                        ticks: {font: {size: 20}},
                        title: plot.generateAxisLabel('Temperatur [°C]', 20)
                    },
                    y: {
                        ticks: {font: {size: 20}},
                        title: plot.generateAxisLabel('Antal mätningar', 20)
                    }
                },
                elements: {point: {radius: 100}},
                datasets: {scatter: {
                    showLine: true,
                    tension: 0.5
                }}
            },
            filename: 'plot_historgram.png'
        }

        await plot.createPlot(histogramPlot);
    },
    scatterPlot: async (line, lower, upper, data, name, filename) => {
        console.log(`-> Generating scatter plot of <${filename}>`);
        let dataLinearLinePlot = {
            type: 'line',
            name: 'Linjär regression',
            data: line,
            color: 'blue',
        };
        let dataLinearLineLowerPlot = {
            type: 'line',
            name: 'hidden',
            data: lower,
            color: 'blue',
            backgroundColor: 'rgba(87, 142, 215, 0.5)',
            borderWidth: 1,
            fill: 0
        };
        let dataLinearLineUpperPlot = {
            type: 'line',
            name: 'Konfidensintervall',
            data: upper,
            color: 'blue',
            backgroundColor: 'rgba(87, 142, 215, 0.5)',
            borderWidth: 1,
            fill: 0
        };
        let dataLinearScatterPlot = {
            type: 'line',
            name: 'Data',
            data: data,
            color: '#2c45b3',
            pointRadius: 2,
            showLine: false
        };

        let scatterPlot = {
            width: 1800,
            height: 1200,
            datasets: [
                plot.generateDataset(dataLinearLinePlot),
                plot.generateDataset(dataLinearLineLowerPlot),
                plot.generateDataset(dataLinearLineUpperPlot),
                plot.generateDataset(dataLinearScatterPlot),
            ],
            options: {
                plugins: {
                    legend: {
                        labels: {
                            font: {size: 18},
                            filter: function(item, chart) {
                                // Logic to remove a particular legend item goes here
                                return !item.text.includes('hidden');
                            }
                        },
                    },
                    title: plot.generateTitle(name, 30)
                },
                scales: {
                    x: {
                        ticks: {font: {size: 20}},
                        title: plot.generateAxisLabel('Datum [yyyy-mm-dd]', 20)
                    },
                    y: {
                        ticks: {font: {size: 20}},
                        title: plot.generateAxisLabel('Temperatur [°C]', 20)
                    }
                },
            },
            filename: filename
        }

        await plot.createPlot(scatterPlot);
    },
    scatterPlotAll: async (hva, hf, na, name, filename) => {
        console.log(`-> Generating scatter plot of <${filename}>`);
        let data1LinearLinePlot = {
            type: 'line',
            name: 'HVA - Linjär regression',
            data: hva.line,
            color: 'blue',
        };
        let data1LinearLineLowerPlot = {
            type: 'line',
            name: 'hidden',
            data: hva.lower,
            color: 'blue',
            backgroundColor: 'rgba(87, 142, 215, 0.5)',
            borderWidth: 1,
            fill: 0
        };
        let data1LinearLineUpperPlot = {
            type: 'line',
            name: 'HVA - Konfidensintervall',
            data: hva.upper,
            color: 'blue',
            backgroundColor: 'rgba(87, 142, 215, 0.5)',
            borderWidth: 1,
            fill: 0
        };
        let data1LinearScatterPlot = {
            type: 'line',
            name: 'HVA - Data',
            data: hva.data,
            color: '#2c45b3',
            pointRadius: 2,
            showLine: false
        };
        let data2LinearLinePlot = {
            type: 'line',
            name: 'HF - Linjär regression',
            data: hf.line,
            color: 'red',
        };
        let data2LinearLineLowerPlot = {
            type: 'line',
            name: 'hidden',
            data: hf.lower,
            color: 'red',
            backgroundColor: 'rgba(209, 9, 33, 0.5)',
            borderWidth: 1,
            fill: 1
        };
        let data2LinearLineUpperPlot = {
            type: 'line',
            name: 'HF - Konfidensintervall',
            data: hf.upper,
            color: 'red',
            backgroundColor: 'rgba(209, 9, 33, 0.5)',
            borderWidth: 1,
            fill: 1
        };
        let data2LinearScatterPlot = {
            type: 'line',
            name: 'HF - Data',
            data: hf.data,
            color: '#b32c2c',
            pointRadius: 2,
            showLine: false
        };
        let data3LinearLinePlot = {
            type: 'line',
            name: 'NA - Linjär regression',
            data: na.line,
            color: 'green',
        };
        let data3LinearLineLowerPlot = {
            type: 'line',
            name: 'hidden',
            data: na.lower,
            color: 'green',
            backgroundColor: 'rgba(34, 170, 0, 0.5)',
            borderWidth: 1,
            fill: 2
        };
        let data3LinearLineUpperPlot = {
            type: 'line',
            name: 'NA - Konfidensintervall',
            data: na.upper,
            color: 'green',
            backgroundColor: 'rgba(34, 170, 0, 0.5)',
            borderWidth: 1,
            fill: 2
        };
        let data3LinearScatterPlot = {
            type: 'line',
            name: 'NA - Data',
            data: na.data,
            color: '#1b9f00',
            pointRadius: 2,
            showLine: false
        };

        let scatterPlot = {
            width: 1800,
            height: 1200,
            datasets: [
                plot.generateDataset(data1LinearLinePlot),
                plot.generateDataset(data2LinearLinePlot),
                plot.generateDataset(data3LinearLinePlot),
                plot.generateDataset(data1LinearLineLowerPlot),
                plot.generateDataset(data1LinearLineUpperPlot),
                plot.generateDataset(data2LinearLineLowerPlot),
                plot.generateDataset(data2LinearLineUpperPlot),
                plot.generateDataset(data3LinearLineLowerPlot),
                plot.generateDataset(data3LinearLineUpperPlot),
                plot.generateDataset(data1LinearScatterPlot),
                plot.generateDataset(data2LinearScatterPlot),
                plot.generateDataset(data3LinearScatterPlot),
            ],
            options: {
                plugins: {
                    legend: {
                        labels: {
                            font: {size: 18},
                            filter: function(item, chart) {
                                // Logic to remove a particular legend item goes here
                                return !item.text.includes('hidden');
                            }
                        },
                    },
                    title: plot.generateTitle(name, 30)
                },
                scales: {
                    x: {
                        ticks: {font: {size: 20}},
                        title: plot.generateAxisLabel('Datum [yyyy-mm-dd]', 20)
                    },
                    y: {
                        ticks: {font: {size: 20}},
                        title: plot.generateAxisLabel('Temperatur [°C]', 20)
                    }
                },
            },
            filename: filename
        }

        await plot.createPlot(scatterPlot);
    },
    transformedScatterPlot: async (line, transformed, lower, upper, data, name, filename) => {
        console.log(`-> Generating transformated scatter plot of <${filename}>`);
        let dataLinearLinePlot = {
            type: 'line',
            name: 'Linjär regression',
            data: line,
            color: 'blue',
        };
        let dataLinearTransformedPlot = {
            type: 'line',
            name: 'Transformerad regressionslinje',
            data: transformed,
            color: '#000191',
        };
        let dataLinearLineLowerPlot = {
            type: 'line',
            name: 'hidden',
            data: lower,
            color: 'blue',
            backgroundColor: 'rgba(87, 142, 215, 0.5)',
            borderWidth: 1,
            fill: 0
        };
        let dataLinearLineUpperPlot = {
            type: 'line',
            name: 'Konfidensintervall',
            data: upper,
            color: 'blue',
            backgroundColor: 'rgba(87, 142, 215, 0.5)',
            borderWidth: 1,
            fill: 0
        };
        let dataLinearScatterPlot = {
            type: 'line',
            name: 'Data',
            data: data,
            color: '#2c45b3',
            pointRadius: 2,
            showLine: false
        };

        let transformedScatterPlot = {
            width: 1800,
            height: 1200,
            datasets: [
                plot.generateDataset(dataLinearLinePlot),
                plot.generateDataset(dataLinearTransformedPlot),
                plot.generateDataset(dataLinearLineLowerPlot),
                plot.generateDataset(dataLinearLineUpperPlot),
                plot.generateDataset(dataLinearScatterPlot),
            ],
            options: {
                plugins: {
                    legend: {
                        labels: {
                            font: {size: 18},
                            filter: function(item, chart) {
                                // Logic to remove a particular legend item goes here
                                return !item.text.includes('hidden');
                            }
                        },
                    },
                    title: plot.generateTitle(name, 30)
                },
                scales: {
                    x: {
                        ticks: {font: {size: 20}},
                        title: plot.generateAxisLabel('Datum [yyyy-mm-dd]', 20)
                    },
                    y: {
                        ticks: {font: {size: 20}},
                        title: plot.generateAxisLabel('Temperatur [°C]', 20)
                    }
                },
            },
            filename: filename
        }

        await plot.createPlot(transformedScatterPlot);
    },
    transformedScatterPlotAll: async (hva, hf, na, name, filename) => {
        console.log(`-> Generating scatter plot of <${filename}>`);
        let data1LinearLinePlot = {
            type: 'line',
            name: 'HVA - Linjär regression',
            data: hva.line,
            color: 'blue',
        };
        let data1LinearTransformedPlot = {
            type: 'line',
            name: 'HVA - Transformerad regressionslinje',
            data: hva.transformed,
            color: '#000191',
        };
        let data1LinearLineLowerPlot = {
            type: 'line',
            name: 'hidden',
            data: hva.lower,
            color: 'blue',
            backgroundColor: 'rgba(87, 142, 215, 0.5)',
            borderWidth: 1,
            fill: 0
        };
        let data1LinearLineUpperPlot = {
            type: 'line',
            name: 'HVA - Konfidensintervall',
            data: hva.upper,
            color: 'blue',
            backgroundColor: 'rgba(87, 142, 215, 0.5)',
            borderWidth: 1,
            fill: 0
        };
        let data1LinearScatterPlot = {
            type: 'line',
            name: 'HVA - Data',
            data: hva.data,
            color: '#2c45b3',
            pointRadius: 2,
            showLine: false
        };
        let data2LinearLinePlot = {
            type: 'line',
            name: 'HF - Linjär regression',
            data: hf.line,
            color: 'red',
        };
        let data2LinearTransformedPlot = {
            type: 'line',
            name: 'HF - Transformerad regressionslinje',
            data: hf.transformed,
            color: '#6c0215',
        };
        let data2LinearLineLowerPlot = {
            type: 'line',
            name: 'hidden',
            data: hf.lower,
            color: 'red',
            backgroundColor: 'rgba(209, 9, 33, 0.5)',
            borderWidth: 1,
            fill: 1
        };
        let data2LinearLineUpperPlot = {
            type: 'line',
            name: 'HF - Konfidensintervall',
            data: hf.upper,
            color: 'red',
            backgroundColor: 'rgba(209, 9, 33, 0.5)',
            borderWidth: 1,
            fill: 1
        };
        let data2LinearScatterPlot = {
            type: 'line',
            name: 'HF - Data',
            data: hf.data,
            color: '#b32c2c',
            pointRadius: 2,
            showLine: false
        };
        let data3LinearLinePlot = {
            type: 'line',
            name: 'NA - Linjär regression',
            data: na.line,
            color: 'green',
        };
        let data3LinearTransformedPlot = {
            type: 'line',
            name: 'NA - Transformerad regressionslinje',
            data: na.transformed,
            color: '#084500',
        };
        let data3LinearLineLowerPlot = {
            type: 'line',
            name: 'hidden',
            data: na.lower,
            color: 'green',
            backgroundColor: 'rgba(34, 170, 0, 0.5)',
            borderWidth: 1,
            fill: 2
        };
        let data3LinearLineUpperPlot = {
            type: 'line',
            name: 'NA - Konfidensintervall',
            data: na.upper,
            color: 'green',
            backgroundColor: 'rgba(34, 170, 0, 0.5)',
            borderWidth: 1,
            fill: 2
        };
        let data3LinearScatterPlot = {
            type: 'line',
            name: 'NA - Data',
            data: na.data,
            color: '#1b9f00',
            pointRadius: 2,
            showLine: false
        };

        let scatterPlot = {
            width: 1800,
            height: 1200,
            datasets: [
                plot.generateDataset(data1LinearLinePlot),
                plot.generateDataset(data2LinearLinePlot),
                plot.generateDataset(data3LinearLinePlot),
                plot.generateDataset(data1LinearTransformedPlot),
                plot.generateDataset(data2LinearTransformedPlot),
                plot.generateDataset(data3LinearTransformedPlot),
                plot.generateDataset(data1LinearLineLowerPlot),
                plot.generateDataset(data1LinearLineUpperPlot),
                plot.generateDataset(data2LinearLineLowerPlot),
                plot.generateDataset(data2LinearLineUpperPlot),
                plot.generateDataset(data3LinearLineLowerPlot),
                plot.generateDataset(data3LinearLineUpperPlot),
                plot.generateDataset(data1LinearScatterPlot),
                plot.generateDataset(data2LinearScatterPlot),
                plot.generateDataset(data3LinearScatterPlot),
            ],
            options: {
                plugins: {
                    legend: {
                        labels: {
                            font: {size: 18},
                            filter: function(item, chart) {
                                // Logic to remove a particular legend item goes here
                                return !item.text.includes('hidden');
                            }
                        },
                    },
                    title: plot.generateTitle(name, 30)
                },
                scales: {
                    x: {
                        ticks: {font: {size: 20}},
                        title: plot.generateAxisLabel('Datum [yyyy-mm-dd]', 20)
                    },
                    y: {
                        ticks: {font: {size: 20}},
                        title: plot.generateAxisLabel('Temperatur [°C]', 20)
                    }
                },
            },
            filename: filename
        }

        await plot.createPlot(scatterPlot);
    },
    residuePlot: async (linear, transformed, stdDev, startDate, endDate, name, filename) => {
        console.log(`-> Generating residue plot of <${filename}>`);
        let distPlotLinearData = {
            type: 'line',
            name: 'Residualer - Linjär',
            data: linear,
            color: '#2c45b3',
            pointRadius: 1,
            showLine: false,
        };
        let distPlotTransformedData = {
            type: 'line',
            name: 'Residualer - Transformerad',
            data: transformed,
            color: '#000191',
            pointRadius: 1,
            showLine: false,
        };
        let normalDistributionUpper = {
            type: 'line',
            name: 'hidden',
            data: [
                {x: startDate, y: stdDev},
                {x: endDate, y: stdDev},
            ],
            backgroundColor: 'rgba(87, 142, 215, 0.5)',
            color: 'blue',
            borderWidth: 1,
        };
        let normalDistributionLower = {
            type: 'line',
            name: 'Normalfördelning',
            data: [
                {x: startDate, y: -stdDev},
                {x: endDate, y: -stdDev},
            ],
            color: 'blue',
            backgroundColor: 'rgba(87, 142, 215, 0.5)',
            borderWidth: 1,
            fill: 2
        };

        // Create scatter plot
        let distPlot = {
            width: 1800,
            height: 1200,
            // labels: hvaKeys,
            datasets: [
                plot.generateDataset(distPlotLinearData),
                plot.generateDataset(distPlotTransformedData),
                plot.generateDataset(normalDistributionUpper),
                plot.generateDataset(normalDistributionLower),
            ],
            options: {
                plugins: {
                    legend: {
                        labels: {
                            font: {size: 18},
                            filter: function(item, chart) {
                                // Logic to remove a particular legend item goes here
                                return !item.text.includes('hidden');
                            }
                        }
                    },
                    title: plot.generateTitle(name, 30)
                },
                scales: {
                    x: {
                        ticks: {font: {size: 20}},
                        title: plot.generateAxisLabel('Datum [yyyy-mm-dd]', 20)
                    },
                    y: {
                        ticks: {font: {size: 20}},
                        title: plot.generateAxisLabel('Temperatur [°C]', 20)
                    }
                },
            },
            filename: filename
        }

        await plot.createPlot(distPlot);
    },
    residuePlotAll: async (hva, hf, na, name, filename) => {
        console.log(`-> Generating residue plot of <${filename}>`);
        let dist1PlotLinearData = {
            type: 'line',
            name: 'HVA - Residualer - Linjär',
            data: hva.linear,
            color: '#2c45b3',
            pointRadius: 1,
            showLine: false,
        };
        let dist1PlotTransformedData = {
            type: 'line',
            name: 'HVA - Residualer - Transformerad',
            data: hva.transformed,
            color: '#000191',
            pointRadius: 1,
            showLine: false,
        };
        let normal1DistributionUpper = {
            type: 'line',
            name: 'hidden',
            data: [
                {x: hva.startDate, y: hva.stdDev},
                {x: hva.endDate, y: hva.stdDev},
            ],
            backgroundColor: 'rgba(87, 142, 215, 0.5)',
            color: 'blue',
            borderWidth: 1,
        };
        let normal1DistributionLower = {
            type: 'line',
            name: 'HVA - Normalfördelning',
            data: [
                {x: hva.startDate, y: -hva.stdDev},
                {x: hva.endDate, y: -hva.stdDev},
            ],
            color: 'blue',
            backgroundColor: 'rgba(87, 142, 215, 0.5)',
            borderWidth: 1,
            fill: 6
        };
        let dist2PlotLinearData = {
            type: 'line',
            name: 'HF - Residualer - Linjär',
            data: hf.linear,
            color: '#b32c2c',
            pointRadius: 1,
            showLine: false,
        };
        let dist2PlotTransformedData = {
            type: 'line',
            name: 'HF - Residualer - Transformerad',
            data: hf.transformed,
            color: '#6c0215',
            pointRadius: 1,
            showLine: false,
        };
        let normal2DistributionUpper = {
            type: 'line',
            name: 'hidden',
            data: [
                {x: hf.startDate, y: hf.stdDev},
                {x: hf.endDate, y: hf.stdDev},
            ],
            backgroundColor: 'rgba(209, 9, 33, 0.5)',
            color: 'blue',
            borderWidth: 1,
        };
        let normal2DistributionLower = {
            type: 'line',
            name: 'HF - Normalfördelning',
            data: [
                {x: hf.startDate, y: -hf.stdDev},
                {x: hf.endDate, y: -hf.stdDev},
            ],
            color: 'blue',
            backgroundColor: 'rgba(209, 9, 33, 0.5)',
            borderWidth: 1,
            fill: 8
        };let dist3PlotLinearData = {
            type: 'line',
            name: 'NA - Residualer - Linjär',
            data: na.linear,
            color: '#1b9f00',
            pointRadius: 1,
            showLine: false,
        };
        let dist3PlotTransformedData = {
            type: 'line',
            name: 'NA - Residualer - Transformerad',
            data: na.transformed,
            color: '#084500',
            pointRadius: 1,
            showLine: false,
        };
        let normal3DistributionUpper = {
            type: 'line',
            name: 'hidden',
            data: [
                {x: na.startDate, y: na.stdDev},
                {x: na.endDate, y: na.stdDev},
            ],
            backgroundColor: 'rgba(34, 170, 0, 0.5)',
            color: 'blue',
            borderWidth: 1,
        };
        let normal3DistributionLower = {
            type: 'line',
            name: 'NA - Normalfördelning',
            data: [
                {x: na.startDate, y: -na.stdDev},
                {x: na.endDate, y: -na.stdDev},
            ],
            color: 'blue',
            backgroundColor: 'rgba(34, 170, 0, 0.5)',
            borderWidth: 1,
            fill: 10
        };

        // Create scatter plot
        let distPlot = {
            width: 1800,
            height: 1200,
            // labels: hvaKeys,
            datasets: [
                plot.generateDataset(dist1PlotLinearData),
                plot.generateDataset(dist2PlotLinearData),
                plot.generateDataset(dist3PlotLinearData),
                plot.generateDataset(dist1PlotTransformedData),
                plot.generateDataset(dist2PlotTransformedData),
                plot.generateDataset(dist3PlotTransformedData),
                plot.generateDataset(normal1DistributionUpper),
                plot.generateDataset(normal1DistributionLower),
                plot.generateDataset(normal2DistributionUpper),
                plot.generateDataset(normal2DistributionLower),
                plot.generateDataset(normal3DistributionUpper),
                plot.generateDataset(normal3DistributionLower),
            ],
            options: {
                plugins: {
                    legend: {
                        labels: {
                            font: {size: 18},
                            filter: function(item, chart) {
                                // Logic to remove a particular legend item goes here
                                return !item.text.includes('hidden');
                            }
                        }
                    },
                    title: plot.generateTitle(name, 30)
                },
                scales: {
                    x: {
                        ticks: {font: {size: 20}},
                        title: plot.generateAxisLabel('Datum [yyyy-mm-dd]', 20)
                    },
                    y: {
                        ticks: {font: {size: 20}},
                        title: plot.generateAxisLabel('Temperatur [°C]', 20)
                    }
                },
            },
            filename: filename
        }

        await plot.createPlot(distPlot);
    }
}

module.exports = plot
