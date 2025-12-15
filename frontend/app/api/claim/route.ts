import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { ethers } from "ethers";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "skibidi-secret-key-do-not-leak";
// WARNING: Never expose this in real production without strict security
const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY || process.env.PRIVATE_KEY;

export async function POST(req: Request) {
    try {
        // 1. Auth Check
        const token = (await cookies()).get("skibidi_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const decoded: any = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;

        // 2. Get User & Validate Balance
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const MIN_CLAIM = 10; // Minimum 10 points to claim
        if (user.points < MIN_CLAIM) {
            return NextResponse.json({ error: `Need at least ${MIN_CLAIM} points to claim` }, { status: 400 });
        }

        if (!ADMIN_PRIVATE_KEY) {
            return NextResponse.json({ error: "Server Misconfiguration (Missing Admin Key)" }, { status: 500 });
        }

        const claimAmount = user.points;
        const amountInWei = ethers.parseEther(claimAmount.toString());

        // 3. Generate Signature using Ethers.js
        // Logic must match Smart Contract: keccak256(abi.encodePacked(user, amount, nonce))

        // Connect to simple provider (backend doesn't need to connect to chain to sign, just wallet)
        const wallet = new ethers.Wallet(ADMIN_PRIVATE_KEY);

        // We need contract nonce to prevent replay. 
        // Ideally we fetch nonce from chain, but that requires RPC.
        // For simplicity V1, we let Frontend pass the nonce? Or we fetch it here.
        // Let's fetch it here for security.
        const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
        const claimContract = new ethers.Contract(
            process.env.NEXT_PUBLIC_AIRDROP_ADDRESS!,
            ["function nonces(address) view returns (uint256)"],
            provider
        );

        // Get user's current nonce from contract
        const contractNonce = await claimContract.nonces(user.walletAddress);

        // Hash message
        const messageHash = ethers.solidityPackedKeccak256(
            ["address", "uint256", "uint256"],
            [user.walletAddress, amountInWei, contractNonce]
        );

        // Sign
        const messageBytes = ethers.getBytes(messageHash);
        const signature = await wallet.signMessage(messageBytes);

        // 4. Deduct Points form DB
        await prisma.user.update({
            where: { id: userId },
            data: { points: 0 } // Reset points
        });

        // 5. Log Claim
        await prisma.claimLog.create({
            data: {
                userId: userId,
                amount: claimAmount,
                signature: signature,
                status: "Generated"
            }
        });

        return NextResponse.json({
            success: true,
            amount: claimAmount,
            signature: signature,
            amountInWei: amountInWei.toString()
        });

    } catch (error) {
        console.error("Claim Error:", error);
        return NextResponse.json({ error: "Claim Failed" }, { status: 500 });
    }
}
