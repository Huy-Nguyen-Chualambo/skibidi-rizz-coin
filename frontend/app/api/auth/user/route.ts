import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
const JWT_SECRET = process.env.JWT_SECRET || "skibidi-secret-key-do-not-leak";

export async function GET(req: Request) {
    try {
        const token = (await cookies()).get("skibidi_token")?.value;

        if (!token) {
            return NextResponse.json({ authenticated: false });
        }

        // Verify Token
        const decoded: any = jwt.verify(token, JWT_SECRET);

        // Get User Data
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
                taskLogs: true, // Return tasks history too
            },
        });

        if (!user) {
            return NextResponse.json({ authenticated: false });
        }

        // Hide sensitive data?
        return NextResponse.json({
            authenticated: true,
            user: {
                id: user.id,
                address: user.walletAddress,
                points: user.points,
                createdAt: user.createdAt,
            }
        });

    } catch (error) {
        return NextResponse.json({ authenticated: false });
    }
}

export async function DELETE(req: Request) {
    (await cookies()).delete("skibidi_token");
    return NextResponse.json({ success: true });
}
