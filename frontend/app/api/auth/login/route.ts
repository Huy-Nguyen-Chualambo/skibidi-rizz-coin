import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ethers } from "ethers";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "skibidi-secret-key-do-not-leak";

export async function POST(req: Request) {
    try {
        const { address, signature } = await req.json();

        if (!address || !signature) {
            return NextResponse.json({ error: "Missing specs" }, { status: 400 });
        }

        // 1. Get User from DB
        const user = await prisma.user.findUnique({
            where: { walletAddress: address },
        });

        if (!user || !user.nonce) {
            return NextResponse.json({ error: "User not found or nonce missing" }, { status: 404 });
        }

        // 2. Verify Signature
        // Recover address from (Nonce + Signature)
        const recoveredAddress = ethers.verifyMessage(user.nonce, signature);

        if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }

        // 3. Login Success -> Create JWT
        const token = jwt.sign(
            { userId: user.id, address: user.walletAddress },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 4. Set Cookie
        (await cookies()).set("skibidi_token", token, {
            httpOnly: true, // JavaScript cannot read (XSS protection)
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        // 5. Clear nonce to prevent replay
        await prisma.user.update({
            where: { id: user.id },
            data: { nonce: null },
        });

        return NextResponse.json({ success: true, user });

    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ error: "Login Failed" }, { status: 500 });
    }
}
