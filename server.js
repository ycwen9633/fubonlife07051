var express = require('express')
var bodyparser = require('body-parser')
var methodOverride = require('method-override')
var fs = require('fs')
var request = require('request')
var port = process.env.PORT || 8000

// /* Const */
const SERVER_URL_SANDBOX = 'https://sandbox.tappayapis.com/tpc/applepay/paymenttoken/pay'
const PARTNER_KEY = ''
const MERCHANT = ''
const APP_ID = 0
const APPLE_PAY_MERCHANT = ''
//
//
//
// var portNumber = 80
var app = express()
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json({ type: 'application/vnd.api+json' }))
app.use(methodOverride())

app.use('/', express.static(__dirname + '/public/html'))
app.use('/js', express.static(__dirname + '/public/js'))
app.use('/css', express.static(__dirname + '/public/css'))
app.use('/images', express.static(__dirname + '/public/images'))



/**
 * A POST endpoint to TapPay For Payment Processing.
 */
app.post('/apple-pay/pay', (req, res) => {


    var options = {
        url: SERVER_URL_SANDBOX,
        method: 'POST',
        json: true,
        headers: {
            'content-type': 'application/json',
            'x-api-key': PARTNER_KEY
        },
        body: {
            'appId': APP_ID,
            'partnerKey': PARTNER_KEY,
            'payTokenData': req.body.paymentData,
            'merchantId': MERCHANT,
            'appleMerchantId': APPLE_PAY_MERCHANT,
            'platformType': 2 // app=1 web=2
        }
    }

    request(options, function(err, response, result) {

        if (err) {
            return res.send({ status: -1 })
        }

        if (result.status != 0) {
            return res.send({ status: -1 })
        }

        res.send({ status: 0 })

    })

})


/**  app.listen(portNumber, (error) => {

    console.log('Requester is listening on port : ' + portNumber)

});
**/
// app.post('/123',function(req,res){
//   res.send('123');
// })
// app.get('/ccc',function(req,res){
//   res.send('ccccc');
// })
  app.listen( process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
    //console.log("hihihhi");
});

/**server.listen(port, function() {
    console.log("App is running on port " + port);
});
**/
