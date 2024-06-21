const amadeus = require('../../utils/amadeus')

const order = async (id) =>{
    amadeus.booking.flightOrder(id).get()
    .then(response => {
        return(response.data)
})
    .catch(error => {
        console.error(error)
        return(null)
})
}

const remove = async (id) =>{
    amadeus.booking.flightOrder(id).delete()
    .then(response => {
        return(response.data)
    })
    .catch(error => {
        console.error(error)
        return(null)
})
}


module.exports = {order, remove}