# node 6

# 1. Enter your AppID, AppKey in public/html/index.html == >line:18 
==>18| "TPDirect.setPublishableKey(AppID, "AppKey", 'sandbox')"

# 2. Enter your Apple Merchant ID in public/js/index.js ==>line:50
==>50| "const session = TPDirect.applePay.buildSession(paymentRequest, "Your Apple Merchant ID")"

# 3. Enter some parameters in server.js
==> 8| const SERVER_URL = 'https://sandbox.tappayapis.com'
==> 9| const PARTNER_KEY = ''
==>10| const MERCHANT = ''
==>11| const APP_ID = 0
==>12| const APPLE_PAY_MERCHANT = ''

# 4. Run 'npm install' to install all module.
npm install

# 5. Run server
npm run start

