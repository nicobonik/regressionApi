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
calculator.setExpression({id: "quadratic", latex: 'y_1~ax_1^2+bx_1+c'});
calculator.setExpression({id: "a", latex: 'a'});
calculator.setExpression({id: "b", latex: 'b'});
calculator.setExpression({id: "c", latex: 'c'});
calculator.observe('expressionAnalysis', function() {
    for(var id in calculator.expressionAnalysis) {
        var analysis = calculator.expressionAnalysis[id];
        if(analysis.evaluation) {
            console.log(analysis.evaluation.value);
            document.getElementById(id).innerHTML = '<p id=' + id + '>' + analysis.evaluation.value + '</p>'
        }
    }
});