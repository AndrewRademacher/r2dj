module.exports = {
    title: 'Manager',
    type: 'object',
    properties: {
        _id: { type: 'string' },
        rdioOauth: { type: 'string', required: true }
    },
    additionalProperties: false
};
