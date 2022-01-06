const utils = require('./utils');

let calculations = {
    round: (value, decimals) => {
        return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)
    },
    mean: (x) => {
        /**
         * Formel för att beräkna medel är 1/n * sum(x)
         */
        let sum = 0;
        // Beräknar summan
        x.forEach((xi) => {
            sum += xi
        });

        //n är antalet mäntningar, dvs längden på x.
        let n = x.length

        return 1/n * sum;
    },
    stdDev: (x) => {
        /**
         * Formel för att beräkna standardavvikelse är
         * s = sqrt(1/(n-1) * (sum(x^2) - 1/n*sum(x)^2))
         */
        let sum = 0;
        let sum2 = 0;
        // Vi behöver beräkna sum(x) och sum(x^2)
        x.forEach((xi) => {
            sum += xi
            sum2 += Math.pow(xi, 2)
        });

        //n är antalet mäntningar, dvs längden på x.
        let n = x.length

        // Vi beräknar standardavvikelsen
        return Math.sqrt(1/(n-1) * (sum2 - 1/n * Math.pow(sum, 2)))
    }, extreme: (x) => {
        /**
         * Vi loopar igenom alla värden för att hitta min respektive max
         */
        let min = null;
        let max = null;

        x.forEach((xi) => {
            min = (!min || xi < min) ? xi : min
            max = (!max || xi > max) ? xi : max
        });

        return {min: min, max: max}
    },
    correlation: (xData, yData) => {
        // console.log(xData);
    let x = [...xData]
    let y = [...yData]
    const promedio = l => l.reduce((s, a) => s + a, 0) / l.length
    const calc = (v, prom) => Math.sqrt(v.reduce((s, a) => (s + a * a), 0) - n * prom * prom)
    let n = x.length
    let nn = 0
    for (let i = 0; i < n; i++, nn++) {
        if ((!x[i] && x[i] !== 0) || (!y[i] && y[i] !== 0)) {
          nn--
          continue
        }
        x[nn] = x[i]
        y[nn] = y[i]
    }
    if (n !== nn) {
        x = x.splice(0, nn)
        y = y.splice(0, nn)
        n = nn
    }
    const prom_x = promedio(x), prom_y = promedio(y)
    return (x
      .map((e, i) => ({ x: e, y: y[i] }))
      .reduce((v, a) => v + a.x * a.y, 0) - n * prom_x * prom_y
    ) / (calc(x, prom_x) * calc(y, prom_y))
    },

    /**
     * An formula used for calculate the linear regression of the given data.
     *
     * @param {String[]} d is an array containing the dates of each observation, for example ['2021-10-10', '2021-10-11']
     * @param {Float[]} t is an array containing the messurements of the temperature on above given days, for example [1.0, 2.3]
     * @return {Number{}} {a, b} where a and b is the coifficients in Y = a + b*X
     */
    linearRegression: (d, t) => {
        // Vi låter n vara antal mätningar
        let n = d.length;

        /**
         * Vi behöver beräkna flera summor för att sedan kunna beräkna a och b.
         * sum(d), sum(t), sum(d^2), sum(t^2) & sum(dt)
         */
        let sumD, sumT, sumD2, sumDT;
        sumD = sumT = sumD2 = sumDT = 0;
        let startDate = null;

        d.forEach((di, i) => {
            startDate = (!startDate) ? di : startDate;

            let days = utils.calculateDays(startDate, di);
            let ti = t[i];

            sumD += days;
            sumT += ti;
            sumD2 += Math.pow(days, 2);
            sumDT += days * ti
        });

        /**
         * Vi har sedan följande formel för att beräkna a respektive b
         * a = sumY/n - b*sumX/n
         * b = (sumXY - ((sumX * sumY)/n)) / (sumX2 - ((sumX)^2)/n)
         * vi börjar med att beräkna b, då a är beroende av b
         */
        let b = (sumDT - sumD *sumT / n) / (sumD2 - Math.pow(sumD, 2) / n);

        // Vi beräknar sedan även b
        let a = sumT / n - b * sumD / n;

        return {a: a, b: b};
    },

    /**
     * An formula used for calculate the 95% confidencinterval for an linear regression..
     *
     * @param {String[]} d is an array containing the dates of each observation, for example ['2021-10-10', '2021-10-11']
     * @param {Float[]} t is an array containing the messurements of the temperature on above given days, for example [1.0, 2.3]
     * @return {Number{}} {a, b} where a and b is the coifficients in Y = a + b*X
     */
    confidensOfLinear: (d, t) => {
        // Vi låter n vara antal mätningar
        let n = d.length
        // Vi tar hjälp av föregående uppgift för att hämta a och b
        let coificients = calculations.linearRegression(d, t);
        let a = coificients.a;
        let b = coificients.b;
        // Vi behöver summorna sum(d) och sum(t) för att kunna beräkna medelvärden
        let sumD = 0;
        let sumT = 0;

        let startDate = null
        d.forEach((di, i) => {
            startDate = (!startDate) ? di : startDate;

            let days = utils.calculateDays(startDate, di);
            let ti = t[i];

            sumD += days;
            sumT += ti;
        });

        // Vi beräknar sedan medelvärden
        let meanD = sumD / n
        let meanT = sumT / n

        /**
         * Vi behöver sedan ytterligare summor för att kunna beräkna variationer
         * Dessa behövs sedan för att kunna räkna ut medelkvadratsumman (MSE)
         * Vi behöver följande summor
         * sum(t^2) betecknas nedan sumT2
         * sum((d-mean(d))^2) beteknas nedan som sumDD2
         * sum((d-mean(d)) * (t-mean(t))) beteknas nedan som sumDDTT
         */
        let sumT2 = 0
        let sumDD2 = 0
        let sumDDTT = 0

        d.forEach((di, i) => {
            let days = utils.calculateDays(startDate, di);
            let ti = t[i];

            sumT2 += Math.pow(ti, 2)
            sumDD2 += Math.pow((days - meanD), 2)
            sumDDTT += (days - meanD) * (ti - meanT)
        });

        /**
         * Vi kan då beräkna den totala variationen (SST) med formeln
         * SST = sum(y^2) - (sum(y)^2 / n)
         */
        let SST = sumT2 - Math.pow(sumT, 2) / n

        /**
         * Vi behöver även den förklarade variationen SSR, den fås med hjälp av
         * SSR = b * sum((x-mean(x)) * (y-mean(y)))
         */
        let SSR = b * sumDDTT

        /**
         * För att sedan kunna beräkna medelkvadratsumman MSE, behöver vi SSE
         * Vilket är den okända variationen (SSE). Formeln SST = SSR + SSE är känd
         * vi kan då bryta ut SSE och får då.
         * SSE = SST - SSR
         */
        let SSE = SST - SSR

        /**
         * För att kunna beräkna  alpha och beta, vilket är avvikelserna för a
         * respektive b. Behöver vi beräkna medelkvadratsumman för den okända
         * variationen, den har en frihetsgrad på n-2 Det ger oss formel.
         * MSE = SSE / (n-2)
         */
        let MSE = SSE / (n - 2)

        /**
         * Vi är ute efter ett konfidensintervall på 95%, vilket ger oss en kvantil
         * på 1.96
         */
        let quantile = 1.96

        /**
         * Vi har formel för att beräkna alpha, dvs konfidensintervallet för a
         * den formel ser ut enligt följande
         * alpha = a +- quantile * sqrt(MSE * ((1/n) + (mean(x)^2 / sum((x-mean(x))^2))))
         * Jag väljer att beräkna aDiff = quantile * sqrt(MSE * ((1/n) + (mean(x)^2 / sum((x-mean(x))^2))))
         * för att inte behöva beräkna både övre och nedre gräns
         */

        let aDiff = quantile * Math.sqrt(MSE * (1 / n + Math.pow(meanD, 2) / sumDD2))
        /**
         * Vi har formel för att beräkna beta, dvs konfidensintervallet för b
         * den formel ser ut enligt följande
         * beta = b +- quantile * sqrt(MSE / sum(x-mean(x))^2)
         * Jag väljer att beräkna bDiff = quantile * sqrt(MSE / sum(x-mean(x))^2)
         * för att inte behöva beräkna både övre och nedre gräns
         */
        let bDiff = quantile * Math.sqrt(MSE / sumDD2)

        return {aDiff: aDiff, bDiff: bDiff, mse: MSE};
    },
    sortDataInIntervals: (dataArray, start, interval) => {
        let output = {};
        let min = null;
        let max = null;

        // Lägger till all data i intervaller
        dataArray.forEach((data, i) => {
            data.forEach((temp) => {
                let inter = (temp - start - interval / 2) / interval

                inter = Math.ceil(inter);

                min = (!min || inter < min) ? inter : min
                max = (!max || inter > max) ? inter : max

                if (!output[inter]) {
                    output[inter] = {}
                }
                (output[inter][i]) ? output[inter][i]++ : output[inter][i] = 1;
            });
        });

        // För att få en snyggare utskrift behöver vi lägga till alla tomma intervall inom området för data
        for (var i = min; i < max; i++) {
            if (!output[i]) {
                output[i] = {}
            }
        }

        let outputObject = {
            keys: []
        }

        // Vi behöver göra om intervallens nycklar till tal och sortera från minsta och största
        Object.keys(output).forEach((key, i) => {
            outputObject.keys.push(parseInt(key))
        });

        outputObject.keys.sort(function compareNumbers(a, b) {
            return a - b;
        })




        outputObject.keys.forEach((key, x) => {
            for (var i = 0; i < dataArray.length; i++) {
                let mean = calculations.mean(dataArray[i]);
                let stdDev = calculations.stdDev(dataArray[i]);


                if (!outputObject[i]) {
                    outputObject[i] = {data: [], gaussian: []};
                }
                (!output[key][i]) ? outputObject[i].data.push(0) : outputObject[i].data.push(output[key][i]);

                outputObject[i].gaussian.push({x: key, y:calculations.gaussian(key, mean, stdDev) * dataArray[i].length})
            }
        });

        // Lägger till kurvor för normalfördelning

        return outputObject;
    },
    gaussian: (x, mean, stdDev) => {
        let gaussianConstant = 1 / Math.sqrt(2 * Math.PI);
        x = (x - mean) / stdDev;
        return gaussianConstant * Math.exp(-.5 * x * x) / stdDev;
    },
    generateCoordinates: (x, y) => {
        let coords = []

        x.forEach((xi, i) => {
            let yi = y[i];

            coords.push({x: xi, y: yi});
        });

        return coords;
    },
    generateUniqueKeys: (keys) => {
        let keyOutput = []

        keys.forEach((key) => {
            if (!keyOutput.includes(key)) {
                keyOutput.push(key);
            }
        });

        return keyOutput;
    },
    generateLinearPoints: (dates, consonants) => {
        let linearPoints = [];

        // Set start date
        let startDate = dates[0];

        dates.forEach((day) => {
            let days = utils.calculateDays(startDate, day);

            let y = consonants.a + consonants.b * days;

            linearPoints.push({x: day, y: y})
        });

        return linearPoints;
    },
    generateLinearConfidence: (dates, consonants, coefficient) => {
        let linearCoenfidence = {lower: [], upper: []};
        let n = dates.length;
        let a = consonants.a
        let b = consonants.b;
        let MSE = coefficient.mse
        let quantile = 1.96;

        // Set start date
        let startDate = dates[0];
        let d0 = 0;

        let sumD = 0

        dates.forEach((day) => {
            sumD += utils.calculateDays(startDate, day)
        });

        let meanD = sumD / dates.length;

        let sumDmD2 = 0

        dates.forEach((day) => {
            sumDmD2 += Math.pow(utils.calculateDays(startDate, day) - meanD, 2)
        });


        dates.forEach((day) => {
            let days = utils.calculateDays(startDate, day);

            let yLower = (a + b * days) - quantile * Math.sqrt(MSE * (1/n + Math.pow(days - meanD, 2)/sumDmD2));
            let yUpper = (a + b * days) + quantile * Math.sqrt(MSE * (1/n + Math.pow(days - meanD, 2)/sumDmD2));

            linearCoenfidence.lower.push({x: day, y: yLower})
            linearCoenfidence.upper.push({x: day, y: yUpper})
        });

        return linearCoenfidence;
    },
    transformData: (dates, consonants) => {
        let transformedData = [];
        let a = consonants.a;
        let b = consonants.b;
        let startDay = dates[0];

        dates.forEach((day) => {
            let days = utils.calculateDays(startDay, day);

            transformedData.push(Math.log(a + b * days));
        });

        // console.log(transformedData);

        return transformedData;

    },
    transformDataBack: (dates, consonants) => {
        let transformedData = [];
        let a = consonants.a;
        let b = consonants.b;
        let startDay = dates[0];

        dates.forEach((day) => {
            let days = utils.calculateDays(startDay, day);

            transformedData.push(Math.exp(a + b * days));
        });

        // console.log(transformedData);

        return transformedData;

    },
    residueAnalysis: (dates, realValues, linearConsonants) => {
        let e = []
        let startDate = dates[0];
        dates.forEach((date, i) => {
            let days = utils.calculateDays(startDate, date)
            let realValue = realValues[i];
            let linearValue = linearConsonants.a + linearConsonants.b * days;

            e.push({x: date, y: realValue - linearValue})
        })
        return e;
    },
    residueAnalysisTransformed: (dates, realValues, linearConsonants) => {
        let e = []
        let startDate = dates[0];
        let sum = 0
        dates.forEach((date, i) => {
            let days = utils.calculateDays(startDate, date)
            let realValue = realValues[i];
            let linearValue = Math.exp(linearConsonants.a + linearConsonants.b * days);

            e.push({x: date, y: realValue - linearValue})
            sum += realValue - linearValue
        })
        return e;
    },
    varianceResidual: (data) => {
        let values = [];

        data.forEach((item) => {
            values.push(item.y)
        });

        let mean = calculations.mean(values)
        let stdDev = calculations.stdDev(values)

        return Math.pow(stdDev, 2);
    }
}

module.exports = calculations
