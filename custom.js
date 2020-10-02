var elt = document.getElementById('calculator');
var calculator = Desmos.GraphingCalculator(elt);

var regressionData = JSON.parse(data);
var xList = regressionData.xList;
var yList = regressionData.yList;
var latex = regressionData.latex;
var params = regressionData.params;

calculator.setExpression({
    type: 'table',
    columns: [
        {
            latex: 'x_1',
            values: xList
          },
          {
            latex: 'y_1',
            values: yList
          }
    ]
});
calculator.setExpression({id: "linear", latex: latex});

params.forEach(element => {
    calculator.setExpression({id: element, latex: element});
    var placeholder = document.createElement("p");
    placeholder.setAttribute("id", element);

    var constants = document.getElementById("constants");
    constants.appendChild(placeholder);
});

calculator.observe('expressionAnalysis', function() {
    for(var id in calculator.expressionAnalysis) {
        var analysis = calculator.expressionAnalysis[id];
        if(analysis.evaluation) {
            console.log(analysis.evaluation.value);
            document.getElementById(id).innerHTML = '<p id=' + id + '>' + analysis.evaluation.value + '</p>'
        }
    }
});