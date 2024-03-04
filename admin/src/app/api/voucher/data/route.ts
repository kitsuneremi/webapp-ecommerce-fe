import prisma from "../../../../lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {

    const id = req.nextUrl.searchParams.get("id");

    if (id && Number.parseInt(id)) {
        const voucher = await prisma.voucher.findFirst({
            where: {
                id: id
            }
        })

        if (voucher) {
            const res = { ...voucher, id: Number.parseInt(voucher.id.toString()) }

            return new Response(JSON.stringify(res));
        }

    }
}
