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
                type: 'object',
                properties: {
                    songId: { type: 'string', required: true },
                    artist: { type: 'string'},
                    title: { type: 'string' },
                    album: { type: 'string' },
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
                    songId: { type: 'string', required: true },
                    artist: { type: 'string' },
                    title: { type: 'string' },
                    album: { type: 'string' },
                    votes: { type: 'integer' }
                },
                additionalProperties: false
            }
        }
    },
    additionalProperties: false
};
