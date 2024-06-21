const ajv = require('../../utils/ajv')

const searchFlightSchema = {
    type: 'object',
    properties: {
        originLocationCode: {type: 'string'},
        destinationLocationCode: {type: 'string'},
        date: {type: 'string', format: 'date'},
        travelers: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    travelerType: { type: 'string' }
                },
                required: ['id', 'travelerType']
            }
        },
        cabinRestrictions: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    cabin: { type: 'string' },
                    coverage: { type: 'string' },
                    originDestinationIds: {
                        type: 'array',
                        items: { type: 'string' }
                    }
                },
                required: ['cabin', 'coverage', 'originDestinationIds']
            }
        }
    },
    required: [
        'originLocationCode',
        'destinationLocationCode',
        'date',
        'travelers'
    ],
    additionalProperties: false
}

module.exports = ajv.compile(searchFlightSchema)