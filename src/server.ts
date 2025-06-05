import express from 'express';
import next from 'next';
import {getMcpHandler, postMcpHandler, deleteMcpHandler} from "./mcp";

const port = parseInt(process.env.PORT || '3000', 10);

const app = next({
    dev: process.env.NODE_ENV !== 'production',
});
const commonHandler = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    server.get('/api/mcp{/*route}', (req, res) => {
        return getMcpHandler(req, res);
    });

    server.post('/api/mcp{/*route}', (req, res) => {
        return postMcpHandler(req, res);
    });

    server.delete('/api/mcp{/*route}', (req, res) => {
        return deleteMcpHandler(req, res);
    });

    server.all('/*route', (req, res) => {
        return commonHandler(req, res);
    });

    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});
