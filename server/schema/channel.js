module.exports = {
    title: 'Channel',
    type: 'object',
    properties: {
        _id: { type: 'string' },
        ownerId: { type: 'string', required: true },
        name: { type: 'string', required: true }
    },
    additionalProperties: false
};
