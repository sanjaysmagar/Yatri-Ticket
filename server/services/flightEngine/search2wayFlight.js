const amadeus = require('../../utils/amadeus')
const {fetchCarrierDetails, fetchAirportDetails} = require('../../utils/iataCodeConverter')

const searchTickets = async (originLocationCode, destinationLocationCode, departureDate, arrivalDate, cabin, nationality, travelers) =>{

    const ticketDetails ={ 
        "currencyCode": "NPR",
        "originDestinations": [{
          "id": "1",
          "originLocationCode": originLocationCode,
          "destinationLocationCode": destinationLocationCode,
          "departureDateTimeRange": {
            "date": departureDate
            // "time": "10:00:00"
          }
        },
        {
          "id": "2",
          "originLocationCode": destinationLocationCode,
          "destinationLocationCode": originLocationCode,
          "departureDateTimeRange": {
            "date": arrivalDate
            // "time": "10:00:00"
          }
        }
        ],
        "travelers": travelers,
        "sources": [
          "GDS"
        ],
        "searchCriteria": {
          "maxFlightOffers": 5,
          "flightFilters": {
            "cabinRestrictions": [{
              "cabin": cabin,
              "coverage": "MOST_SEGMENTS",
              "originDestinationIds": [
                "1"
              ]
            }],
            "carrierRestrictions": {
              "excludedCarrierCodes": [
                "AA",
                "TP",
                "AZ"
              ]
            }
          }
        }
      }
    
    
      amadeus.shopping.flightOffersSearch.post(JSON.stringify(ticketDetails))
        .then(function (flightOffersSearchResponse) {
          return amadeus.shopping.flightOffers.pricing.post(
            JSON.stringify({
              'data': {
                'type': 'flight-offers-pricing',
                'flightOffers': flightOffersSearchResponse.data
              }
            })
          );
        })
    
        //     sending data to frontend     
    
        .then(async (response) => {
          const carrierDetails = await fetchCarrierDetails(); // Fetch carrier details for business names
    
          const transformedData = await Promise.all(response.data.flightOffers.map(async (offer) => {
              // Create a lookup for the fare details by segment ID
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
                          duration: segment.duration,
                          noOfStops: segment.numberOfStops,
                          cabin: fareDetailsBySegmentId[segment.id].cabin,
                          // weight: fareDetailsBySegmentId[segment.id].includedCheckedBags
                      };
                  })
              ));

              const noOfStops = segments.length -1
      
              return {
                  noOfStops: noOfStops,
                  price: offer.price.grandTotal,
                  currency: offer.price.billingCurrency,
                  segments: segments
              };
          }));
      
    //req.session.flightOffers = response.data.flightOffers; // Store the flight offers in 
    return transformedData;
      })
      
    .catch(error => console.error(error))
      }


    module.exports = searchTickets