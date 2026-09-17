import { RequestPacket, sendQuery } from "@infernus/query";

const SERVER_IP = "51.79.165.9";
const SERVER_PORT = 7777;

function json(data, status = 200) {
    return Response.json(data, {
        status,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Cache-Control": "no-store"
        }
    });
}

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        }
    });
}

export async function GET() {
    try {
        const server = await sendQuery({
            address: SERVER_IP,
            port: SERVER_PORT,
            opcode: RequestPacket.INFORMATION
        });

        if (!server) {
            return json({
                online: false,
                players: 0,
                maxPlayers: 0
            });
        }

        return json({
            online: true,
            hostname: server.hostname,
            players: server.playerCount,
            maxPlayers: server.maxPlayers,
            gamemode: server.gameMode,
            language: server.language
        });

    } catch (error) {
        console.error("PHLRP query failed:", error);

        return json({
            online: false,
            players: 0,
            maxPlayers: 0
        });
    }
}
