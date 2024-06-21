const book = require('../../services/flightEngine/bookFlight');

const bookFlight = async (req, res) => {
  const { travelers, ticketId } = req.body;

  const FlightSelected = req.session.pricingResponse;

  if(!FlightSelected) {
    return res.status(400).json("Undefined Selected flight")
  }

  console.log("FlightSelected", FlightSelected);

  const { data, message } = await book(travelers, FlightSelected);

  if (!data) {
    return res.status(400).json({ message: message || "Booking failed" });
  }

  console.log("PNR GENERATED:", data);

  res.status(200).json(data);
};

module.exports = bookFlight;
 