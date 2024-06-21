const {fetchCarrierDetails, fetchAirportDetails} = require('../../utils/iataCodeConverter')
const amadeus = require('../../utils/amadeus')

const convertDurationToMinutes = (duration) => {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?/;
    const matches = duration.match(regex);
    const hours = parseInt(matches[1] || '0', 10);
    const minutes = parseInt(matches[2] || '0', 10);
    return (hours * 60) + minutes;
};

const priceCheck = async (flightOffersSearchResponse) => {

    // console.log("flightOffersSearchResponse", flightOffersSearchResponse)
try{  
const pricingResponse = await amadeus.shopping.flightOffers.pricing.post(
  JSON.stringify({
      'data': {
          'type': 'flight-offers-pricing',
          'flightOffers': flightOffersSearchResponse
      }
  })
);

const carrierDetails = await fetchCarrierDetails(); // Fetch carrier details for business names

const transformedData = await Promise.all(pricingResponse.data.flightOffers.map(async (offer) => {
  const fareDetailsBySegmentId = offer.travelerPricings[0].fareDetailsBySegment.reduce((acc, fareDetail) => {
      acc[fareDetail.segmentId] = {
          includedCheckedBags: fareDetail.includedCheckedBags,
          cabin: fareDetail.cabin
      };
      return acc;
  }, {});

  const segments = await Promise.all(offer.itineraries.flatMap(itinerary =>
      itinerary.segments.map(async (segment) => {
          const departureAirport = await fetchAirportDetails(segment.departure.iataCode);
          const arrivalAirport = await fetchAirportDetails(segment.arrival.iataCode);

          return {
              id: segment.id,
              departureIataCode: segment.departure.iataCode,
              departureAirport: departureAirport ? departureAirport.name : 'Unknown',
              departureAt: segment.departure.at,

              arrivalIataCode: segment.arrival.iataCode,
              arrivalAirport: arrivalAirport ? arrivalAirport.name : 'Unknown',
              arrivalAt: segment.arrival.at,

              carrierCode: segment.carrierCode,
              businessName: carrierDetails[segment.carrierCode] || segment.carrierCode,
              airlineLogo: `https://pics.avs.io/200/200/${segment.carrierCode}.png`,
              duration: segment.duration,
              noOfStops: segment.numberOfStops,
              cabin: fareDetailsBySegmentId[segment.id].cabin,
              carryBaggage: '7 Kg',
                        checkedBaggage: fareDetailsBySegmentId[segment.id].includedCheckedBags.quantity
                        ? `${fareDetailsBySegmentId[segment.id].includedCheckedBags.quantity} Pieces`
                        : `${fareDetailsBySegmentId[segment.id].includedCheckedBags.weight} ${fareDetailsBySegmentId[segment.id].includedCheckedBags.weightUnit}`
          };
      })
  ));

  const noOfStops = segments.length -1

  // Calculate layover times and total flight time
  let totalFlightTimeInMinutes = 0;
  for (let i = 0; i < segments.length; i++) {
      const currentSegment = segments[i];
      totalFlightTimeInMinutes += convertDurationToMinutes(currentSegment.duration);

      if (i < segments.length - 1) {
          const nextSegment = segments[i + 1];
          const arrivalAt = new Date(currentSegment.arrivalAt);
          const departureAt = new Date(nextSegment.departureAt);
          const layoverTime = (departureAt - arrivalAt) / (1000 * 60); // Layover time in minutes
          totalFlightTimeInMinutes += layoverTime;

          const hours = Math.floor(layoverTime / 60);
          const minutes = layoverTime % 60;
          currentSegment.layoverTime = `${hours}H ${minutes}M`;
      }
  }

  const totalFlightTimeHours = Math.floor(totalFlightTimeInMinutes / 60);
  const totalFlightTimeMinutes = totalFlightTimeInMinutes % 60;
  const totalFlightTime = `${totalFlightTimeHours}H ${totalFlightTimeMinutes}M`;

  return {
      id: offer.id,
      noOfStops: noOfStops,
      price: offer.price.grandTotal,
      currency: offer.price.billingCurrency,
      totalFlightTime: totalFlightTime,
      segments: segments,
      travelerPricings: offer.travelerPricings.map(travelerPricing => ({
        travelerId: travelerPricing.travelerId,
        travelerType: travelerPricing.travelerType,
        currency: travelerPricing.price.currency,
        price: travelerPricing.price.total
    }))
  };
}));

return {transformedData, pricingResponse};s
}
catch(error){
  console.error(error)
  return {transformedData: null, pricingResponse: null};
}
}

module.exports = priceCheck