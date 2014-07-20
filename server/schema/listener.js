module.exports = {
    title: 'Listener',
    type: 'object',
    properties: {
        _id: { type: 'string' },
        channelId: { type: 'string' },
        votes: {
            type:'array',
            value: {
                type:'object',
                properties: {
                    songId: { type:'string', required: true },
                    vote: { type: 'integer', required: true }
                },
                additionalProperties: false
            }
        }
    },
    additionalProperties: false
};
