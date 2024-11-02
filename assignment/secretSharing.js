const fs = require('fs');

function convertToDecimal(value, base) {
    return parseInt(value, base);
}

function lagrangeInterpolation(points, xValue) {
    let total = 0;
    const n = points.length;

    for (let i = 0; i < n; i++) {
        let xi = points[i][0];
        let yi = points[i][1];
        let li = 1;

        for (let j = 0; j < n; j++) {
            if (i !== j) {
                li *= (xValue - points[j][0]) / (xi - points[j][0]);
            }
        }
        total += li * yi;
    }
    return total;
}

function processFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject("Error reading file: " + err);
                return;
            }

            const jsonData = JSON.parse(data);
            const n = jsonData.keys.n;

            const points = [];
            for (let i = 1; i <= n; i++) {
                if (!jsonData[i]) continue;
                const base = parseInt(jsonData[i].base);
                const value = jsonData[i].value;
                const x = i;
                const y = convertToDecimal(value, base);
                points.push([x, y]);
            }

            const secretC = lagrangeInterpolation(points, 0);
            resolve(secretC);
        });
    });
}

Promise.all([processFile('input1.json'), processFile('input2.json')])
    .then(results => {
        console.log("The constant term c for test case 1 is:", results[0]);
        console.log("The constant term c for test case 2 is:", results[1]);
    })
    .catch(error => {
        console.error(error);
    });

