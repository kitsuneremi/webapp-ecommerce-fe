import prisma from "../../../../lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const data = await prisma.bill.findMany({
        where: {
            customer_id: {
                equals: null
            }
        }
    })

    return new Response(JSON.stringify(data.map(bill => {
        return { ...bill, id: Number.parseInt(bill.id.toString()) }
    })))
}