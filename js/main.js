/**
 * Created by Peter on 8/10/2017.
 */

var usdPerMIOTA = null
var btcPerMIOTA = null
var ethPerMIOTA = null
var usdPerBTC = null
var usdPerETH = null
var btcPerETH = null

function priceChangedHandler(target, property, value, receiver) {
    target[property] = value
    updateTable()
    return true
}

const startingUSD = 1000

function updateTable() {
    updateCurrencyConversions()
    updateBuyStrategies()
    updateHysteresesStrategies()
}

function updateCurrencyConversions() {
    $("#usdPerMIOTA").text(usdPerMIOTA)
    $("#usdPerBTC").text(usdPerBTC)
    $("#usdPerETH").text(usdPerETH)
    $("#btcPerMIOTA").text(btcPerMIOTA)
    $("#btcPerETH").text(btcPerETH)
    $("#ethPerMIOTA").text(ethPerMIOTA)
}

function updateBuyStrategies() {
    let usdToMIOTA = startingUSD / usdPerMIOTA
    let usdToBTCToMIOTA = startingUSD / usdPerBTC / btcPerMIOTA
    let usdToETHToMIOTA = startingUSD / usdPerETH / ethPerMIOTA

    // TODO: Refactor to use templating
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

const startingMIOTA = 1

function updateHysteresesStrategies() {
    const miotaToUSDToBTCToMIOTA = startingMIOTA * usdPerMIOTA / usdPerBTC / btcPerMIOTA
    const miotaToUSDToETHToMIOTA = startingMIOTA * usdPerMIOTA / usdPerETH / ethPerMIOTA
    const miotaToBTCToUSDToMIOTA = startingMIOTA * btcPerMIOTA * usdPerBTC / usdPerMIOTA
    const miotaToETHToUSDToMIOTA = startingMIOTA * ethPerMIOTA * usdPerETH / usdPerMIOTA
    const miotaToBTCToETHToMIOTA = startingMIOTA * btcPerMIOTA / btcPerETH / ethPerMIOTA
    const miotaToETHToBTCToMIOTA = startingMIOTA * ethPerMIOTA * btcPerETH / btcPerMIOTA

    // TODO: Refactor to use templating
    const hystereses = [
        {
            panelElement: $("#miotaToUSDToBTCToMIOTAPanel"),
            priceElement: $("#miotaToUSDToBTCToMIOTA")[0],
            price: miotaToUSDToBTCToMIOTA,
            pricePercentageElement: $("#miotaToUSDToBTCToMIOTAPercent")[0],
        },
        {
            panelElement: $("#miotaToUSDToETHToMIOTAPanel"),
            priceElement: $("#miotaToUSDToETHToMIOTA")[0],
            price: miotaToUSDToETHToMIOTA,
            pricePercentageElement: $("#miotaToUSDToETHToMIOTAPercent")[0],
        },
        {
            panelElement: $("#miotaToBTCToUSDToMIOTAPanel"),
            priceElement: $("#miotaToBTCToUSDToMIOTA")[0],
            price: miotaToBTCToUSDToMIOTA,
            pricePercentageElement: $("#miotaToBTCToUSDToMIOTAPercent")[0],
        },
        {
            panelElement: $("#miotaToETHToUSDToMIOTAPanel"),
            priceElement: $("#miotaToETHToUSDToMIOTA")[0],
            price: miotaToETHToUSDToMIOTA,
            pricePercentageElement: $("#miotaToETHToUSDToMIOTAPercent")[0],
        },
        {
            panelElement: $("#miotaToBTCToETHToMIOTAPanel"),
            priceElement: $("#miotaToBTCToETHToMIOTA")[0],
            price: miotaToBTCToETHToMIOTA,
            pricePercentageElement: $("#miotaToBTCToETHToMIOTAPercent")[0],
        },
        {
            panelElement: $("#miotaToETHToBTCToMIOTAPanel"),
            priceElement: $("#miotaToETHToBTCToMIOTA")[0],
            price: miotaToETHToBTCToMIOTA,
            pricePercentageElement: $("#miotaToETHToBTCToMIOTAPercent")[0],
        }
    ]

    hystereses.forEach(function(hysteresis, index){
        hysteresis.priceElement.innerText = hysteresis.price
        const percentageChange = (hysteresis.price - 1) * 100
        var percentageChangeString
        if (percentageChange > 0) {
            percentageChangeString = `(+${percentageChange}%)`
            hysteresis.panelElement.attr("class", "panel panel-success")
        } else {
            percentageChangeString = `(${percentageChange}%)`
            hysteresis.panelElement.attr("class", "panel panel-danger")
        }
        hysteresis.pricePercentageElement.innerText = percentageChangeString
    })
}

const currencyExchange = "Bitfinex"

$(function(){
    $.getJSON(`https://min-api.cryptocompare.com/data/price?fsym=IOT&tsyms=BTC,USD,ETH&tryConversion=false&e=${currencyExchange}`, function(data) {
        usdPerMIOTA = data.USD
        btcPerMIOTA = data.BTC
        ethPerMIOTA = data.ETH
        updateTable()
    })
    .fail(function(data) {
        failure()
    });

    $.getJSON(`https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD&tryConversion=false&e=${currencyExchange}`, function(data) {
        usdPerBTC = data.USD
        updateTable()
    })
    .fail(function(data) {
        failure()
    });

    $.getJSON(`https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,BTC&tryConversion=false&e=${currencyExchange}`, function(data) {
        usdPerETH = data.USD
        btcPerETH = data.BTC
        updateTable()
    })
    .fail(function(data) {
        failure()
    });

    let donateButton = $("#donateButton")
    donateButton.tooltip({
        trigger: "click",
        placement: "top"
    })

    function setTooltip(message) {
        donateButton.tooltip('hide')
            .attr('data-original-title', message)
            .tooltip('show')
    }

    function hideTooltip() {
        setTimeout(function() {
            donateButton.tooltip('hide')
        }, 1000)
    }

    var clipboard = new Clipboard('#donateButton');

    clipboard.on('success', function(e) {
        setTooltip('IOTA Address Copied!')
        hideTooltip()
    });

    clipboard.on('error', function(e) {
        setTooltip('Failed!')
        hideTooltip()
    })
});
