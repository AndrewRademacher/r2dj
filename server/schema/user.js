module.exports = {
    title: 'User',
    type: 'object',
    properties: {
        _id: { type: 'string' },
        rdio_oauth: { type: 'string', required: true }
    },
    additionalProperties: false
};
