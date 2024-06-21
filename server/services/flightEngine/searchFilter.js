const Amadeus = require('amadeus');
const amadeus = require('../../utils/amadeus')

const filter = (location) =>{
    amadeus.referenceData.locations.get({
        keyword: location,
        subType: Amadeus.location.any
      }).then(response => {
        //Filters the data and returns only name and iataCode
       const airpotDetails = response.data.filter(location => location.subType === 'AIRPORT')
        .map(Data => ({name: Data.name, iataCode: Data.iataCode}))
        return airpotDetails
      })
      .catch(response => console.error(response))
}

module.exports = filter