import sendResponse from "@/app/lib/responseWrapper";
import { errorHandler } from "@/app/middleware/errorHandler";
import { AppError } from "@/utils/CustomError";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @method POST
 * @route /api/team
 * @description Creates a new team in the database.
 * 
 * @param {Request} req - The request object containing the payload in JSON format.
 *    - `name` (string): Name of the team (required).
 *    - `players` (string[]): Array of player IDs to associate with the team (at least 1 required).
 *    - `captainId` (string): ID of the team captain (required).
 * 
 * @throws {AppError} 400 - If payload is invalid or missing required fields.
 * @throws {AppError} 409 - If a team with the same name already exists.
 * 
 * @returns {Promise<Response>} 201 - JSON object of the created team, including players and captain details.
 *    Example:
 *    {
 *      id: "teamId",
 *      name: "Team Name",
 *      players: [{ id: "playerId1" }, { id: "playerId2" }],
 *      captain: { id: "captainId" }
 *    }
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { name, players, captainId } = body;

        console.log(body)

        if (!body || typeof body !== 'object') {
            console.log("error in !body")
            throw new AppError("Payload must be a valid object.", 400, false);
        }
        if (!name || !captainId) {
            throw new AppError("Enter all details", 400, false);
        }
        if (!players || players.length == 0) {
            throw new AppError("Need at least 1 player", 400, false);
        }

        // Check if all players exist in the database
        const existingPlayers = await prisma.user.findMany({
            where: {
                id: {
                    in: players
                }
            }
        });


        if (existingPlayers.length !== players.length) throw new AppError(`Some Players do not exists`, 400, false);

        const alreadyExists = await prisma.team.findUnique({
            where: { name },
        });
        
        if (alreadyExists) {
            throw new AppError("Team with this name already exists", 409, false);
        }

        const newTeam = await prisma.team.create({
            include: { players: true, captain: true },
            data: {
                name: name,
                captainId: captainId,
                players: {
                    connect: players.map((userId: string) => ({ id: userId })),
                },
            },
        });
        return sendResponse("success", newTeam);
    } catch (error) {
        return errorHandler(error);
    }
}

/**
 * @method GET
 * @route /api/team
 * @description Retrieves all teams from the database.
 * 
 * @param {Request} req - The request object (no body or query parameters required).
 * 
 * @throws {AppError} 404 - If no teams are found in the database.
 * 
 * @returns {Promise<Response>} 200 - JSON array of all team objects.
 *    Example:
 *    [
 *      {
 *        id: "teamId1",
 *        name: "Team Name 1",
 *        captainId: "captainId1",
 *        players: [...]
 *      },
 *      {
 *        id: "teamId2",
 *        name: "Team Name 2",
 *        captainId: "captainId2",
 *        players: [...]
 *      }
 *    ]
 */
export async function GET() {
    try {
        const teams = await prisma.team.findMany({ include: { matchesAsTeam1: true, players: true, MatchRequestReceiver: true } });

        if (!teams || teams.length == 0) {
            throw new AppError("No Teams Available", 404, false);
        }

        return sendResponse("success", teams);
    } catch (error) {
        return errorHandler(error);
    }
}
