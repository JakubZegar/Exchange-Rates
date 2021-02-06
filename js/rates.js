var rateListElement = document.querySelector('.rateListLabel');
var rateListElementInner = '';

var detailListElement = document.querySelector('.detailsList');

var currentDate = new Date();
var prevMonday = new Date();

var whereToScroll = document.getElementById('currencyDetailsColumn')

window.onload = function(e){ 
    fetch('https://api.exchangeratesapi.io/latest?base=PLN')
        .then(response => response.json())
        .then(responseData => {
            loadRates(responseData.rates)
        })
        .catch(err => {
          console.log('error : ' + err);
        });

    prevMonday.setDate(prevMonday.getDate()-7)
    while (prevMonday.getDay() !== 1) {
        prevMonday.setDate(prevMonday.getDate()-1)
    }
}

function loadRates(rates) {
    var index = 0;
    for (var element in rates) {
        if (Object.prototype.hasOwnProperty.call(rates, element)) {
            rateListElementInner += `<div class="labelItem" id=` + index + ` onclick="getDetails('`+ element +`')">
                                        <div class=labelName>`+ element +`</div>
                                        <div class=labelValue>` + rates[element] + `</div>
                                     </div>`
            index += 1;
        }
    }
    rateListElement.innerHTML = rateListElementInner;
}

function loadRatesDetails(ratesDetails, currency) {
    var sortedDetailsByDate = sortObject(ratesDetails.rates);
    var detailListElementInner = '';
    document.getElementById('chooseCurrencyToCheckDetailsInfo').style.display="none";
    detailListElementInner += `<div class="detailHeader">
                                    <div class="detailDate"><h5>Data</h5></div>
                                    <div class="detailValue"><h5>Wartość ` + currency + ` w złotówkach</h5></div>
                                </div>`
    for (var element in sortedDetailsByDate) {
        if (Object.prototype.hasOwnProperty.call(sortedDetailsByDate, element)) {
            detailListElementInner += `<div class="detailItem">
                                            <div class="detailDate">`+ element +`</div>
                                            <div class="detailValue">` + sortedDetailsByDate[element].PLN + ` <b>PLN</b></div>
                                       </div>`
        }
        detailListElement.innerHTML = detailListElementInner;
    }
}

function sortObject(object) {
    var sorted = {},
    key, keyArray = [];

    for (key in object) {
        if (object.hasOwnProperty(key)) {
            keyArray.push(key);
        }
    }
    keyArray.sort();
    keyArray = keyArray.reverse()

    for (key = 0; key < keyArray.length; key++) {
        sorted[keyArray[key]] = object[keyArray[key]];
    }
    return sorted;
}

function formatDate(date) {
    var date = new Date(date),
        month = '' + (date.getMonth() + 1),
        day = '' + date.getDate(),
        year = date.getFullYear();

    if (month.length < 2) {
        month = '0' + month;
    }
    if (day.length < 2) {
        day = '0' + day;
    }
    return [year, month, day].join('-');
}

function getDetails(currency) {
    fetch('https://api.exchangeratesapi.io/history?start_at=' + formatDate(prevMonday) + 
            '&end_at=' + formatDate(currentDate) + '&symbols=PLN&base=' + currency)
    .then(response => response.json())
    .then(responseData => {
        loadRatesDetails(responseData, currency)
    })
    .catch(err => {
      console.log('error : ' + err);
    });
    whereToScroll.scrollIntoView({behavior: "smooth"});
}