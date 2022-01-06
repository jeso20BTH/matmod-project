const file = require('./modules/file');
const plot = require('./modules/plot');
const table = require('./modules/table');
const calc = require('./modules/calculations');

async function main() {
    /**
     * -------------------------------Setup----------------------------------------------
     */
    console.log('-> Starting analysis');
    console.log('-> Reading files');
    let hva = {linear: {}, transformation: {}, res: {}};
    let hf = {linear: {}, transformation: {}, res: {}};
    let na = {linear: {}, transformation: {}, res: {}};
    let keys = Object.keys(file.data);
    for await (const key of keys) {
        await file.readFile(key);
    }

    /**
     * -------------------Visualisation--------------------------------------------------
     */
    console.log('-> Generating visualisation plot <plot_visualisation.png>');
    await plot.visualisationPlot(
        file.data['hallands_vadero_a'].data,
        file.data['halmstad_flygplats'].data,
        file.data['nidingen_a'].data,
        file.data['hallands_vadero_a'].dates
    )

    /**
     * -----------------------------------Describing statistics--------------------------
     */
    console.log('-> Calculating describing statistics');
    // Calculate mean
    hva.mean = calc.mean(file.data['hallands_vadero_a'].data);
    hf.mean = calc.mean(file.data['halmstad_flygplats'].data);
    na.mean = calc.mean(file.data['nidingen_a'].data);

    // Calculate stdDev
    hva.stdDev = calc.stdDev(file.data['hallands_vadero_a'].data);
    hf.stdDev = calc.stdDev(file.data['halmstad_flygplats'].data);
    na.stdDev = calc.stdDev(file.data['nidingen_a'].data);

    // Calculate the extreme values
    hva.extreme = calc.extreme(file.data['hallands_vadero_a'].data);
    hf.extreme = calc.extreme(file.data['halmstad_flygplats'].data);
    na.extreme = calc.extreme(file.data['nidingen_a'].data);

    // Calculate the corelation between the variables
    hva.corel = calc.correlation(file.data['hallands_vadero_a'].data, file.data['halmstad_flygplats'].data)
    hf.corel = calc.correlation(file.data['hallands_vadero_a'].data, file.data['nidingen_a'].data)
    na.corel = calc.correlation(file.data['halmstad_flygplats'].data, file.data['nidingen_a'].data)

    // Generate an table with the data
    console.log('-> Generating table of describing statistics <table_summary.png>');
    await table.generateSummary('table_summary.png', hva, hf, na)

    console.log('-> Generating heatmap plot of correlations <plot_heatmap.png>');
    table.generateHeatmap('plot_heatmap.png', ['Hallands Väderö A', 'Halmstad flygplats', 'Nidingen A'], [
        [hf.corel, na.corel, 0],
        [hva.corel, 0, na.corel],
        [0, hva.corel, hf.corel]
    ])

    /**
     * ---------------------------------------Describing graphs--------------------------
     */
    //Skapar ett histogram, behöver bestämma intervall och beräkna antal inom varje intervall
    //Jag väljer att sätta mina intervall till 1 grad °C
    let interval = 1;
    let startPoint = 0;

    console.log('-> Calculate histogram interval');
    let histogramObject = calc.sortDataInIntervals(
        [
            file.data['hallands_vadero_a'].data,
            file.data['halmstad_flygplats'].data,
            file.data['nidingen_a'].data
        ],
        startPoint,
        interval
    )

    console.log('-> Generating histogram plot <plot_histogram.png>');
    await plot.histogramPlot(
        histogramObject['0'].gaussian,
        histogramObject['1'].gaussian,
        histogramObject['2'].gaussian,
        histogramObject['0'].data,
        histogramObject['1'].data,
        histogramObject['2'].data,
        histogramObject.keys
    )

    /**
     * --------------------------------------Linear regression---------------------------
     */
    // Calculate consonants in the linear regression
    console.log('-> Calculating the linear regression');
    hva.linear.coef = calc.linearRegression(file.data['hallands_vadero_a'].dates, file.data['hallands_vadero_a'].data);
    hf.linear.coef = calc.linearRegression(file.data['halmstad_flygplats'].dates, file.data['halmstad_flygplats'].data);
    na.linear.coef = calc.linearRegression(file.data['nidingen_a'].dates, file.data['nidingen_a'].data);

    // Calculate coinfidence interval for the linear regression
    console.log('-> Calculate coenfidence interval of linear regression');
    hva.linear.conf = calc.confidensOfLinear(file.data['hallands_vadero_a'].dates, file.data['hallands_vadero_a'].data);
    hf.linear.conf = calc.confidensOfLinear(file.data['halmstad_flygplats'].dates, file.data['halmstad_flygplats'].data);
    na.linear.conf = calc.confidensOfLinear(file.data['nidingen_a'].dates, file.data['nidingen_a'].data);

    // Generate an table with data about the linear regression
    console.log('-> Generating table for linear regression <table_linear.png>');
    await table.generateLinear('table_linear.png', hva, hf, na)

    // Creates coordinates for scatter-plot of original data

    // Get keys to generate points for the linear regression
    hva.linear.data = calc.generateCoordinates(file.data['hallands_vadero_a'].dates, file.data['hallands_vadero_a'].data);
    hva.linear.keys = calc.generateUniqueKeys(file.data['hallands_vadero_a'].dates)
    hva.linear.points = calc.generateLinearPoints(hva.linear.keys, hva.linear.coef);
    hva.linear.confPoints = calc.generateLinearConfidence(hva.linear.keys, hva.linear.coef, hva.linear.conf)

    hf.linear.data = calc.generateCoordinates(file.data['halmstad_flygplats'].dates, file.data['halmstad_flygplats'].data);
    hf.linear.keys = calc.generateUniqueKeys(file.data['halmstad_flygplats'].dates)
    hf.linear.points = calc.generateLinearPoints(hf.linear.keys, hf.linear.coef);
    hf.linear.confPoints = calc.generateLinearConfidence(hf.linear.keys, hf.linear.coef, hf.linear.conf)

    na.linear.data = calc.generateCoordinates(file.data['nidingen_a'].dates, file.data['nidingen_a'].data);
    na.linear.keys = calc.generateUniqueKeys(file.data['nidingen_a'].dates)
    na.linear.points = calc.generateLinearPoints(na.linear.keys, na.linear.coef);
    na.linear.confPoints = calc.generateLinearConfidence(na.linear.keys, na.linear.coef, na.linear.conf)

    await plot.scatterPlot(
        hva.linear.points,
        hva.linear.confPoints.lower,
        hva.linear.confPoints.upper,
        hva.linear.data,
        'Hallands Väderö A - Linjär regression med data och konfidensintervall',
        'plot_scatter_hva.png'
    )

    await plot.scatterPlot(
        hf.linear.points,
        hf.linear.confPoints.lower,
        hf.linear.confPoints.upper,
        hf.linear.data,
        'Halmstad flygplats - Linjär regression med data och konfidensintervall',
        'plot_scatter_hf.png'
    )

    await plot.scatterPlot(
        na.linear.points,
        na.linear.confPoints.lower,
        na.linear.confPoints.upper,
        na.linear.data,
        'Nidingen A - Linjär regression med data och konfidensintervall',
        'plot_scatter_na.png'
    )
    await plot.scatterPlotAll(
        {
            line: hva.linear.points,
            lower:hva.linear.confPoints.lower,
            upper:hva.linear.confPoints.upper,
            data:hva.linear.data,
        },
        {
            line: hf.linear.points,
            lower:hf.linear.confPoints.lower,
            upper:hf.linear.confPoints.upper,
            data:hf.linear.data,
        },
        {
            line: na.linear.points,
            lower:na.linear.confPoints.lower,
            upper:na.linear.confPoints.upper,
            data:na.linear.data,
        },
        'Linjär regression med data och konfidensintervall',
        'plot_scatter_all.png'
    );

    /**
     * ----------------------------------------Transformed data--------------------------
     */
    console.log('-> Trasformating data');
    hva.transformation.transformedTemps = calc.transformData(hva.linear.keys, hva.linear.coef);
    hva.transformation.coef = calc.linearRegression(hva.linear.keys, hva.transformation.transformedTemps);
    hva.transformation.retransformedTemps = calc.transformDataBack(hva.linear.keys, hva.transformation.coef)
    hva.transformation.data = calc.generateCoordinates(hva.linear.keys, hva.transformation.retransformedTemps);

    hf.transformation.transformedTemps = calc.transformData(hf.linear.keys, hf.linear.coef);
    hf.transformation.coef = calc.linearRegression(hf.linear.keys, hf.transformation.transformedTemps);
    hf.transformation.retransformedTemps = calc.transformDataBack(hf.linear.keys, hf.transformation.coef)
    hf.transformation.data = calc.generateCoordinates(hf.linear.keys, hf.transformation.retransformedTemps);

    na.transformation.transformedTemps = calc.transformData(na.linear.keys, na.linear.coef);
    na.transformation.coef = calc.linearRegression(na.linear.keys, na.transformation.transformedTemps);
    na.transformation.retransformedTemps = calc.transformDataBack(na.linear.keys, na.transformation.coef)
    na.transformation.data = calc.generateCoordinates(na.linear.keys, na.transformation.retransformedTemps);

    await plot.transformedScatterPlot(
        hva.linear.points,
        hva.transformation.data,
        hva.linear.confPoints.lower,
        hva.linear.confPoints.upper,
        hva.linear.data,
        'Hallands Värderö A - Linjär regression vanlig och transformerad data',
        'plot_scatter_transformed_hva.png'
    );

    await plot.transformedScatterPlot(
        hf.linear.points,
        hf.transformation.data,
        hf.linear.confPoints.lower,
        hf.linear.confPoints.upper,
        hf.linear.data,
        'Halmstad flygplats - Linjär regression vanlig och transformerad data',
        'plot_scatter_transformed_hf.png'
    );

    await plot.transformedScatterPlot(
        na.linear.points,
        na.transformation.data,
        na.linear.confPoints.lower,
        na.linear.confPoints.upper,
        na.linear.data,
        'Nidingen A - Linjär regression vanlig och transformerad data',
        'plot_scatter_transformed_na.png'
    );

    await plot.transformedScatterPlotAll(
        {
            line: hva.linear.points,
            transformed: hva.transformation.data,
            lower:hva.linear.confPoints.lower,
            upper:hva.linear.confPoints.upper,
            data:hva.linear.data,
        },
        {
            line: hf.linear.points,
            transformed: hf.transformation.data,
            lower:hf.linear.confPoints.lower,
            upper:hf.linear.confPoints.upper,
            data:hf.linear.data,
        },
        {
            line: na.linear.points,
            transformed: na.transformation.data,
            lower:na.linear.confPoints.lower,
            upper:na.linear.confPoints.upper,
            data:na.linear.data,
        },
        'Linjär regression vanlig och transformerad data',
        'plot_scatter_transformed_all.png'
    );
    /**
     * --------------------------------------Residueal analysis-------------------------
     */
    console.log(`-> Running residual analysis`);
    hva.res.line = calc.residueAnalysis(
        file.data['hallands_vadero_a'].dates,
        file.data['hallands_vadero_a'].data,
        hva.linear.coef
    )
    hva.res.transformed = calc.residueAnalysisTransformed(
        file.data['hallands_vadero_a'].dates,
        file.data['hallands_vadero_a'].data,
        hva.transformation.coef
    )

    hf.res.line = calc.residueAnalysis(
        file.data['halmstad_flygplats'].dates,
        file.data['halmstad_flygplats'].data,
        hf.linear.coef
    )
    hf.res.transformed = calc.residueAnalysisTransformed(
        file.data['halmstad_flygplats'].dates,
        file.data['halmstad_flygplats'].data,
        hf.transformation.coef
    )

    na.res.line = calc.residueAnalysis(
        file.data['nidingen_a'].dates,
        file.data['nidingen_a'].data,
        na.linear.coef
    )
    na.res.transformed = calc.residueAnalysisTransformed(
        file.data['nidingen_a'].dates,
        file.data['nidingen_a'].data,
        na.transformation.coef
    )

    await plot.residuePlot(
        hva.res.line,
        hva.res.transformed,
        hva.stdDev,
        file.data['hallands_vadero_a'].dates[0],
        file.data['hallands_vadero_a'].dates.slice(-1).pop(),
        'Hallands Värderö A - Residualanalys',
        'plot_dist_linear_hva.png'
    )

    await plot.residuePlot(
        hf.res.line,
        hf.res.transformed,
        hf.stdDev,
        file.data['halmstad_flygplats'].dates[0],
        file.data['halmstad_flygplats'].dates.slice(-1).pop(),
        'Halmstad flygplats - Residualanalys',
        'plot_dist_linear_hf.png'
    )

    await plot.residuePlot(
        na.res.line,
        na.res.transformed,
        na.stdDev,
        file.data['nidingen_a'].dates[0],
        file.data['nidingen_a'].dates.slice(-1).pop(),
        'Nidingen A - Residualanalys',
        'plot_dist_linear_na.png'
    )

    await plot.residuePlotAll(
        {
            linear: hva.res.line,
            transformed: hva.res.transformed,
            startDate: file.data['hallands_vadero_a'].dates[0],
            endDate: file.data['hallands_vadero_a'].dates.slice(-1).pop(),
            stdDev: hva.stdDev,
        },
        {
            linear: hf.res.line,
            transformed: hf.res.transformed,
            startDate: file.data['halmstad_flygplats'].dates[0],
            endDate: file.data['halmstad_flygplats'].dates.slice(-1).pop(),
            stdDev: hf.stdDev,
        },
        {
            linear: na.res.line,
            transformed: na.res.transformed,
            startDate: file.data['nidingen_a'].dates[0],
            endDate: file.data['nidingen_a'].dates.slice(-1).pop(),
            stdDev: na.stdDev,
        },
        'Residualanalys',
        'plot_dist_linear_all.png'
    )

    console.log(`-> Calculating varience of residues`);
    hva.res.varLine = calc.varianceResidual(hva.res.line)
    hva.res.varTrans = calc.varianceResidual(hva.res.transformed)

    hf.res.varLine = calc.varianceResidual(hf.res.line)
    hf.res.varTrans = calc.varianceResidual(hf.res.transformed)

    na.res.varLine = calc.varianceResidual(na.res.line)
    na.res.varTrans = calc.varianceResidual(na.res.transformed)

    console.log(`-> Generating table for varience <table_variance.png>`);
    await table.generateVariance(
        'table_variance.png',
        {linear: hva.res.varLine, transformed: hva.res.varTrans},
        {linear: hf.res.varLine, transformed: hf.res.varTrans},
        {linear: na.res.varLine, transformed: na.res.varTrans},
    )

    console.log(`-> Analysis done`);
}

main();
