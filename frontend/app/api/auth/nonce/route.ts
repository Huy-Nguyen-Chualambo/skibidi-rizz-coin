import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
    try {
        const { address } = await req.json();

        if (!address) {
            return NextResponse.json({ error: "Address required" }, { status: 400 });
        }

        // Generate random nonce
        const nonce = `Sign this message to login SkibidiVerse: ${uuidv4()}`;

        // Find or Create User
        // Note: We update the nonce every time they request login
        const user = await prisma.user.upsert({
            where: { walletAddress: address },
            create: {
                walletAddress: address,
                nonce: nonce,
            },
            update: {
                nonce: nonce,
            },
        });

        return NextResponse.json({ nonce: user.nonce });
    } catch (error) {
        console.error("Nonce Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
