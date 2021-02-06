var rateListElement = document.querySelector('.rateListLabel');
var rateListElementLabel = '';

window.onload = function(e){ 
    fetch('https://api.exchangeratesapi.io/latest?base=PLN')
        .then(response => response.json())
        .then(responseData => {
            console.log(responseData)
            loadRates(responseData.rates)
        })
        .catch(err => {
          console.log('error : ' + err);
        });    
}

function loadRates(rates) {
    var index = 0;
    for (var element in rates) {
        if (Object.prototype.hasOwnProperty.call(rates, element)) {
            rateListElementLabel += `<div class="labelItem" id=` + index + ` onclick="getDetails('`+ element +`')">
                                        <div class=labelName>`+ element +`</div>
                                        <div class=labelValue>` + rates[element] + `</div>
                                     </div>`
            index += 1;
        }
    }
    rateListElement.innerHTML = rateListElementLabel;
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function getDetails(currency) {
    var currentDate = formatDate(new Date());
    fetch('https://api.exchangeratesapi.io/history?start_at=2021-01-1&end_at='+currentDate+'&symbols=PLN&base='+currency)
    .then(response => response.json())
    .then(responseData => {
        console.log(responseData)
    })
    .catch(err => {
      console.log('error : ' + err);
    });    
}