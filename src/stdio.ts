import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {getServer} from "@/mcp/server";

const server = getServer();

const transport = new StdioServerTransport();

(async () => {
    await server.connect(transport);
})();
