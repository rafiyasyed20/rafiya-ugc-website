import { NodeRequest, sendNodeResponse } from "srvx/node";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type FetchHandler = {
    fetch: (request: Request, env?: unknown, ctx?: unknown) => Promise<Response>;
};

let handler: FetchHandler | null = null;

async function getHandler(): Promise<FetchHandler> {
    if (!handler) {
        const serverPath = join(__dirname, "..", "dist", "server", "server.js");
        const mod = (await import(serverPath)) as { default: FetchHandler };
        handler = mod.default;
    }
    return handler;
}

export default async function vercelHandler(
    req: IncomingMessage,
    res: ServerResponse,
) {
    const h = await getHandler();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const webReq = new NodeRequest({ req: req as any, res: res as any });
    const webRes = await h.fetch(webReq as unknown as Request);
    if (webRes.headers.get("content-type")?.startsWith("text/html")) {
        res.setHeader("content-encoding", "identity");
    }
    await sendNodeResponse(res as any, webRes);
}
