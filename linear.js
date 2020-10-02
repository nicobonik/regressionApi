var elt = document.getElementById('calculator');
var calculator = Desmos.GraphingCalculator(elt);

var regressionData = JSON.parse(data);
var xList = regressionData.xList;
var yList = regressionData.yList;

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
calculator.setExpression({id: "linear", latex: 'y_1~mx_1+b'});
calculator.setExpression({id: "m", latex: 'm'});
calculator.setExpression({id: "b", latex: 'b'});
calculator.observe('expressionAnalysis', function() {
    for(var id in calculator.expressionAnalysis) {
        var analysis = calculator.expressionAnalysis[id];
        if(analysis.evaluation) {
            console.log(analysis.evaluation.value);
            document.getElementById(id).innerHTML = '<p id=' + id + '>' + analysis.evaluation.value + '</p>'
        }
    }
});