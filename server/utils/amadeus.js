const Amadeus = require('amadeus');
const{CLIENTID, CLIENTSECRET} = require('../config/config')

var amadeus = new Amadeus({
    clientId: CLIENTID,
    clientSecret: CLIENTSECRET
  });

  module.exports = amadeus