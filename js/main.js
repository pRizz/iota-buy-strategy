/**
 * Created by Peter on 8/10/2017.
 */

var usdPerMIOTA = null
var btcPerMIOTA = null
var ethPerMIOTA = null
var usdPerBTC = null
var usdPerETH = null

function priceChangedHandler(target, property, value, receiver) {
    target[property] = value
    updateTable()
    return true
}

const startingUSD = 1000

function updateTable() {
    $("#usdPerMIOTA").text(usdPerMIOTA)
    $("#usdPerBTC").text(usdPerBTC)
    $("#usdPerETH").text(usdPerETH)
    $("#btcPerMIOTA").text(btcPerMIOTA)
    $("#ethPerMIOTA").text(ethPerMIOTA)

    let usdToMIOTA = startingUSD / usdPerMIOTA
    let usdToBTCToMIOTA = startingUSD / usdPerBTC / btcPerMIOTA
    let usdToETHToMIOTA = startingUSD / usdPerETH / ethPerMIOTA

    let currencies = [
        {
            panelElement: $("#usdToMIOTAPanel"),
            priceElement: $("#usdToMIOTA")[0],
            price: usdToMIOTA
        },
        {
            panelElement: $("#usdToBTCToMIOTAPanel"),
            priceElement: $("#usdToBTCToMIOTA")[0],
            price: usdToBTCToMIOTA
        },
        {
            panelElement: $("#usdToETHToMIOTAPanel"),
            priceElement: $("#usdToETHToMIOTA")[0],
            price: usdToETHToMIOTA
        }
    ]

    let bestValue = currencies.map(currency => currency.price).reduce((a, b) => Math.max(a, b))
    let indexOfBestValue = currencies.map(currency => currency.price).indexOf(bestValue)
    currencies.forEach(function(currency, index){
        currency.priceElement.innerText = currency.price
        if(index == indexOfBestValue) {
            currency.panelElement.attr("class", "panel panel-success")
        } else {
            currency.panelElement.attr("class", "panel panel-danger")
        }
    })
}

$(function(){
    $.getJSON(`https://min-api.cryptocompare.com/data/price?fsym=IOT&tsyms=BTC,USD,ETH&tryConversion=false`, function(data) {
        usdPerMIOTA = data.USD
        btcPerMIOTA = data.BTC
        ethPerMIOTA = data.ETH
        updateTable()
    })
        .fail(function(data) {
            failure()
        });

    $.getJSON(`https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD&tryConversion=false`, function(data) {
        usdPerBTC = data.USD
        updateTable()
    })
        .fail(function(data) {
            failure()
        });

    $.getJSON(`https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&tryConversion=false`, function(data) {
        usdPerETH = data.USD
        updateTable()
    })
        .fail(function(data) {
            failure()
        });
});
