import {createDocument} from 'zod-openapi';
import {anchorSchema, anchorRequestPathSchema, anchorRequestBodySchema} from "@/modules/visualization";
import {configurationSchema, configurationDataSchema, configurationRequestPathSchema} from "@/modules/configuration";

export const openApiDocument = createDocument({
    openapi: '3.1.0',
    info: {
        title: 'Stikster',
        version: '1.0.0',
        description: 'API documentation for Stikster',
    },
    paths: {
        '/anchor': {
            post: {
                summary: 'Creates an anchor pointing to a sticky note on a Miro board.',
                requestBody: {
                    content: {
                        'application/json': {
                            schema: anchorRequestBodySchema,
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Anchor created.',
                        content: {
                            'application/json': {
                                schema: anchorSchema,
                            },
                        },
                    },
                    '400': {
                        description: 'Failed to create anchor.',
                    },
                },
            },
        },
        '/anchor/{anchorId}': {
            get: {
                summary: 'Retrieves an anchor by its identity.',
                requestParams: {
                    path: anchorRequestPathSchema,
                },
                responses: {
                    '200': {
                        description: 'Anchor found.',
                        content: {
                            'application/json': {
                                schema: anchorSchema,
                            },
                        },
                    },
                    '404': {
                        description: 'Anchor not found.',
                    },
                },
            },
            delete: {
                summary: 'Deletes an anchor by its identity.',
                requestParams: {
                    path: anchorRequestPathSchema,
                },
                responses: {
                    '200': {
                        description: 'Anchor deleted.',
                    },
                    '404': {
                        description: 'Anchor not found.',
                    },
                },
            },
        },
        '/configuration': {
            post: {
                summary: 'Creates a configuration.',
                requestBody: {
                    content: {
                        'application/json': {
                            schema: configurationDataSchema,
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Configuration created.',
                        content: {
                            'application/json': {
                                schema: configurationSchema,
                            },
                        },
                    },
                    '400': {
                        description: "Configuration data doesn't match the schema.",
                    },
                },
            },
        },
        '/configuration/{configurationId}': {
            get: {
                summary: 'Retrieves a configuration by its identity.',
                requestParams: {
                    path: configurationRequestPathSchema,
                },
                responses: {
                    '200': {
                        description: 'Configuration found.',
                        content: {
                            'application/json': {
                                schema: configurationSchema,
                            },
                        },
                    },
                    '404': {
                        description: 'Configuration not found or invalid.',
                    },
                },
            },
            put: {
                summary: 'Updates a configuration by its identity.',
                requestParams: {
                    path: configurationRequestPathSchema,
                },
                requestBody: {
                    content: {
                        'application/json': {
                            schema: configurationDataSchema.partial(),
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Configuration updated.',
                        content: {
                            'application/json': {
                                schema: configurationSchema,
                            },
                        },
                    },
                    '400': {
                        description: "Configuration data doesn't match the schema.",
                    },
                    '404': {
                        description: 'Configuration not found or invalid.',
                    },
                },
            },
        },
    },
});
