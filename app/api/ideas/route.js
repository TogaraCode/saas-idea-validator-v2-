import { getIdeas } from "../../../lib/store"

export async function GET() {
  return Response.json(getIdeas())
}

