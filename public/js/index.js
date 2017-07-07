document.addEventListener('DOMContentLoaded', function() {

    if (TPDirect.applePay.checkAvailability()) {
        document.getElementById('apple-pay-button').style.display = 'block';
        document.getElementById('apple-pay-button').addEventListener('click', applePayButtonClicked);
    }

});


function applePayButtonClicked() {
    const paymentRequest = {
        countryCode: 'TW',
        currencyCode: 'TWD',
        shippingMethods: [{
                label: 'Free Shipping',
                amount: '0.00',
                identifier: 'free',
                detail: 'Delivers in five business days',
            },
            {
                label: 'Express Shipping',
                amount: '5.00',
                identifier: 'express',
                detail: 'Delivers in two business days',
            },
        ],

        lineItems: [{
                label: 'Book',
                amount: '1.00',
            },
            {
                label: 'Pan',
                amount: '1.00',
            }
        ],

        total: {
            label: 'TapPay!',
            amount: '2.00',
        },

        supportedNetworks: ['amex', 'discover', 'masterCard', 'visa'],
        merchantCapabilities: ['supports3DS'],

        requiredShippingContactFields: ['postalAddress', 'email'],
    };

    const session = TPDirect.applePay.buildSession(paymentRequest, "merchant.com.ycFubon")


    /**
     * Shipping Method Selection
     * If the user changes their chosen shipping method we need to recalculate
     * the total price. We can use the shipping method identifier to determine
     * which method was selected.
     */
    session.onshippingmethodselected = function(event) {

        console.log("===============================")
        console.log("onshippingmethodselected event");
        console.log(event);
        console.log("===============================")

        const shippingCost = event.shippingMethod.identifier === 'free' ? '0.00' : '2.00';
        const totalCost = event.shippingMethod.identifier === 'free' ? '5.00' : '7.00';

        const lineItems = [{
                label: 'Book',
                amount: '1.00',
            },
            {
                label: 'Pan',
                amount: '1.00',
            }
        ];

        const total = {
            label: 'TapPay!',
            amount: totalCost,
        };

        session.completeShippingMethodSelection(ApplePaySession.STATUS_SUCCESS, total, lineItems);
    };

    /**
     * Payment Authorization
     * Here you receive the encrypted payment data. You would then send it
     * on to your payment provider for processing, and return an appropriate
     * status in session.completePayment()
     */
    session.onpaymentauthorized = function(event) {
        // Send payment for processing...
        const payment = event.payment;
        const payTokenData = JSON.stringify(payment.token.paymentData)

        sendPaymentToken(payment.shippingContact, payTokenData).then(function(response) {
            console.log(response);

            var resutlStatus = (response.status != 0) ? ApplePaySession.STATUS_FAILURE : ApplePaySession.STATUS_SUCCESS
            var resultView = (response.status != 0) ? "/failure.html" : "/success.html"

            // ...return a status and redirect to a confirmation page
            session.completePayment(resutlStatus);
            window.location.href = resultView;
        });

    }

    // All our handlers are setup - start the Apple Pay payment
    session.begin();
}


function sendPaymentToken(shippingContact, payTokenData) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/apple-pay/pay');
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                resolve(JSON.parse(xhr.response));
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function() {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify({ shippingContact: shippingContact, payTokenData, payTokenData }));
    });
}
