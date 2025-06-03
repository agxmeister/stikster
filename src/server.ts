import express from 'express';
import next from 'next';
import {mcpHandler} from "./mcp";

const port = parseInt(process.env.PORT || '3000', 10);

const app = next({
    dev: process.env.NODE_ENV !== 'production',
});
const commonHandler = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    server.all('/api/mcp{/*route}', (req, res) => {
        return mcpHandler(req, res);
    });

    server.all('/*route', (req, res) => {
        return commonHandler(req, res);
    });

    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});
