
function binomialCoefficient(n) {
    var array = [[1]];
    for (let i = 1; i <= n; i++) {
        for (let j = 0; j <= i; j++) {
            if (j === 0) {
                array.push([1]);
            } else {
                if (j === i) {
                    array[i].push(1);
                } else {
                    array[i].push(array[i - 1][j] + array[i - 1][j - 1]);
                }
            }
        }
    }
    return array;
}

function bernsteinBasisPolynomial(i, n, t, binomial) {
    return binomial[n][i] * Math.pow(1 - t, n - i) * Math.pow(t, i);
}

// dla testow napisałem rowniez zwyklego bernsteina 
function bernstein(n, t, xs, binomial) {
    let result = {"xcord": 0, "ycord": 0};
    for(let i = 0; i <= n; i++) {
        let actualBasis = bernsteinBasisPolynomial(i, n, t, binomial);
        result.xcord += xs.xcord * actualBasis;
        result.ycord += xs.ycord * actualBasis;
    }
    return result;
}


function deCastlejau(controlPoints, n, t) {
    let arr = JSON.parse(JSON.stringify(controlPoints));

    for(let r = 1; r < n; r++) {
        for (let j = 0; j < n-r; j++) {
            arr[j].xcord = arr[j].xcord * (1 - t) + arr[j+1].xcord * t;
            arr[j].ycord = arr[j].ycord * (1 - t) + arr[j+1].ycord * t;
        }
    }

    return arr[0]; 
}

function createPointsWithDeCastlejau(pointsNumber, controlPoints) {
    let result = [];
    let n = controlPoints.length;

    for(let i = 0; i <= pointsNumber; i++) {
        let t = i/pointsNumber;
        result.push(deCastlejau(controlPoints, n, t));
    }

    return result;
}


export {createPointsWithDeCastlejau}