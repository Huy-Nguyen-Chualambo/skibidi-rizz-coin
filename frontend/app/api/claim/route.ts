import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { ethers } from "ethers";
const JWT_SECRET = process.env.JWT_SECRET || "skibidi-secret-key-do-not-leak";
// WARNING: Never expose this in real production without strict security
let ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY || process.env.PRIVATE_KEY;
if (ADMIN_PRIVATE_KEY && !ADMIN_PRIVATE_KEY.startsWith('0x')) {
    ADMIN_PRIVATE_KEY = '0x' + ADMIN_PRIVATE_KEY;
}

export async function POST(req: Request) {
    try {
        // 1. Auth Check
        const token = (await cookies()).get("skibidi_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const decoded: any = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;
        console.log("Claim Request - Decoded UserID:", userId);

        // 2. Get User & Validate Balance
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            console.error("User not found in DB for ID:", userId);
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        console.log(`Checking points for user ${user.walletAddress} (ID: ${user.id}): Current ${user.points}, Required: 10`);

        const MIN_CLAIM = 10;
        if (user.points < MIN_CLAIM) {
            // Check if there's a recently generated claim that wasn't completed
            const lastGeneratedClaim = await prisma.claimLog.findFirst({
                where: { userId: userId, status: "Generated" },
                orderBy: { createdAt: 'desc' }
            });

            if (lastGeneratedClaim) {
                console.log(`User ${user.walletAddress} has 0 points but found a 'Generated' claim log. Returning existing signature.`);
                return NextResponse.json({
                    success: true,
                    amount: lastGeneratedClaim.amount,
                    signature: lastGeneratedClaim.signature,
                    amountInWei: ethers.parseEther(lastGeneratedClaim.amount.toString()).toString(),
                    isRetry: true
                });
            }

            console.warn(`User ${user.walletAddress} has only ${user.points} points, claim denied.`);
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

        // Fallback for missing env vars (Matching your latest deploy)
        const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";
        const airdropAddress = process.env.NEXT_PUBLIC_AIRDROP_ADDRESS || "0xA408351f26edf62024222A6c140e62Cd66e35cc7";

        console.log("Using Airdrop Address:", airdropAddress);

        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const claimContract = new ethers.Contract(
            airdropAddress,
            ["function nonces(address) view returns (uint256)"],
            provider
        );

        // Get user's current nonce from contract
        let contractNonce;
        try {
            console.log("Connecting to RPC:", rpcUrl);
            console.log("Contract Address:", airdropAddress);
            console.log("User Wallet:", user.walletAddress);

            if (!process.env.NEXT_PUBLIC_AIRDROP_ADDRESS) {
                console.warn("⚠️ NEXT_PUBLIC_AIRDROP_ADDRESS missing in process.env, using fallback");
            }
            if (!process.env.NEXT_PUBLIC_RPC_URL) {
                console.warn("⚠️ NEXT_PUBLIC_RPC_URL missing in process.env, using fallback");
            }

            // Check if provider is responsive
            const network = await provider.getNetwork();
            console.log("Connected to Network:", network.name, network.chainId.toString());

            contractNonce = await claimContract.nonces(user.walletAddress);
            console.log("Contract Nonce fetched:", contractNonce.toString());
        } catch (contractError: any) {
            console.error("Contract Call Error (nonces):", contractError);
            return NextResponse.json({
                error: "Failed to connect to Airdrop contract. Verify NEXT_PUBLIC_AIRDROP_ADDRESS and RPC URL.",
                details: {
                    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL,
                    airdropAddress: process.env.NEXT_PUBLIC_AIRDROP_ADDRESS,
                    userAddress: user.walletAddress,
                    errorMessage: contractError.message,
                    errorCode: contractError.code
                }
            }, { status: 500 });
        }

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

    } catch (error: any) {
        console.error("Claim Error:", error);
        return NextResponse.json({
            error: "Claim Failed",
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
