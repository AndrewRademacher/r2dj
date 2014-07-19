module.exports = {
    title: 'Channel',
    type: 'object',
    properties: {
        _id: {
            type: 'string'
        },
        ownerId: {
            type: 'string',
            required: true
        },
        name: {
            type: 'string',
            required: true
        },
        history: {
            type: 'array',
            value: {
                type: 'object'
                properties: {
                    _id: { type: 'string', required: true },
                    artist: { type: 'string', required: true },
                    title: { type: 'string', required: true },
                    votes: { type: 'integer' }
                },
                additionalProperties: false
            }
        },
        queue: {
            type: 'array',
            value: {
                type: 'object',
                properties: {
                    _id: { type: 'string', required: true },
                    artist: { type: 'string', required: true },
                    title: { type: 'string', required: true },
                    votes: { type: 'integer' }
                }
                additionalProperties: false
            }
        }
    },
    additionalProperties: false
};
