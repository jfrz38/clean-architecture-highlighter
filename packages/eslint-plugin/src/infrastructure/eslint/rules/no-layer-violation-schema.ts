export function noLayerViolationSchema(): object[] {
    return [{
        type: 'object',
        additionalProperties: false,
        properties: {
            sourceFolder: { type: 'string' },
            layers: {
                type: 'object',
                additionalProperties: false,
                properties: {
                    domain: layerSchema(),
                    application: layerSchema(),
                    infrastructure: layerSchema()
                }
            },
            ignoreTypeImports: { type: 'boolean' },
            ignoreExternalDependencies: { type: 'boolean' }
        }
    }];
}

function layerSchema(): object {
    return {
        type: 'object',
        additionalProperties: false,
        properties: {
            aliases: {
                type: 'array',
                items: { type: 'string' }
            },
            allowedDependencies: {
                type: 'array',
                items: {
                    enum: ['domain', 'application', 'infrastructure']
                }
            }
        }
    };
}
