
const filter = require('../../services/flightEngine/searchFilter')


const searchFilter = async (req, res) => {
    const {location} = req.query
     
    const airportDetails = await filter(location)

    if(!airportDetails){
        return res.status(400).json(null)
    }

    res.status(200).json(airportDetails)
  }

  module.exports = searchFilter