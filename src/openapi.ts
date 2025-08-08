import {createDocument} from 'zod-openapi';
import {anchorRequestPathSchema, anchorRequestBodySchema, anchorResponseSchema} from "@/modules/visualization";

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
                                schema: anchorResponseSchema,
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
                                schema: anchorResponseSchema,
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
    },
});
