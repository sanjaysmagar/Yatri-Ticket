const express = require('express')
const router = express.Router()
const authenticate = require('../middleware/authenticate')
const searchFlight = require('../controller/flightEngine/searchFlight')
const searchPrice = require('../controller/flightEngine/oneFlightDetail')
const search2wayFlight = require('../controller/flightEngine/search2wayFlight')
const searchFilter = require('../controller/flightEngine/searchFilter')
const bookFlight = require('../controller/flightEngine/bookFlight')
const {getOrder, deleteOrder} = require('../controller/flightEngine/manageOrder')
const validator = require('../middleware/validator')
const searchFlightSchema = require('../schema/flightEngine/searchFlight')



router.route('/search/suggestion').get(searchFilter)

router.route('/search').post(validator(searchFlightSchema), searchFlight)

router.route('/searchPrice').post(searchPrice)

router.route('/search2way').post(search2wayFlight)

router.route('/book').post(bookFlight)

router.route('/order/management/:id').get(authenticate, getOrder).delete(authenticate, deleteOrder)




module.exports = router