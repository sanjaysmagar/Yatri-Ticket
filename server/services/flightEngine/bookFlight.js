const amadeus = require('../../utils/amadeus');

const book = async (travelers, FlightSelected) => {
  const fs = FlightSelected.flightOffers;
  // console.log("FlightSelected.flightOffers", fs);

  // Transform the travelers data
  const formattedTravelers = travelers.map((traveler, index) => {
    const formattedTraveler = {
      id: (index + 1).toString(),
      dateOfBirth: traveler.dateOfBirth,
      name: {
        firstName: traveler.firstName,
        lastName: traveler.lastName,
      },
      gender: traveler.gender,
      contact: {
        emailAddress: traveler.emailAddress,
        phones: [
          {
            deviceType: traveler.phone.deviceType,
            countryCallingCode: traveler.phone.countryCallingCode,
            number: traveler.phone.number,
          },
        ],
      },
    };

    if (traveler.passport) {
      formattedTraveler.documents = [
        {
          documentType: traveler.passport.documentType,
          birthPlace: traveler.passport.birthPlace,
          issuanceLocation: traveler.passport.issuanceLocation,
          issuanceDate: traveler.passport.issuanceDate,
          number: traveler.passport.number,
          expiryDate: traveler.passport.expiryDate,
          issuanceCountry: traveler.passport.issuanceCountry,
          validityCountry: traveler.passport.validityCountry,
          nationality: traveler.passport.nationality,
          holder: traveler.passport.holder,
        },
      ];
    }

    return formattedTraveler;
  });

  try {
    const response = await amadeus.booking.flightOrders.post(
      JSON.stringify({
        data: {
          type: 'flight-order',
          flightOffers: fs,
          travelers: formattedTravelers,
        },
      })
    );
    return { data: response.data, message: "" };
  } catch (error) {
    console.error(error);
    return { data: null, message: "An error occurred" };
  }
};

module.exports = book;
