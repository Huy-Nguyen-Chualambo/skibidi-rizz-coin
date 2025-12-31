import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "skibidi-secret-key-do-not-leak";

export async function POST(req: Request) {
    try {
        // 1. Auth Check
        const token = (await cookies()).get("skibidi_token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const decoded: any = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;

        // 2. Get Task Info
        const { taskId } = await req.json();
        if (!taskId) return NextResponse.json({ error: "Missing Task ID" }, { status: 400 });

        const task = await prisma.task.findUnique({ where: { id: taskId } });
        if (!task || !task.isActive) return NextResponse.json({ error: "Task not found" }, { status: 404 });

        // 3. Check if already done
        const existingLog = await prisma.taskLog.findUnique({
            where: {
                userId_taskId: {
                    userId: userId,
                    taskId: taskId
                }
            }
        });

        if (existingLog) {
            return NextResponse.json({ error: "Task already completed" }, { status: 400 });
        }

        // 4. Reward User (Transaction)
        // Run in transaction to ensure points match logs
        await prisma.$transaction([
            // Create Log
            prisma.taskLog.create({
                data: {
                    userId: userId,
                    taskId: taskId,
                    status: "COMPLETED"
                }
            }),
            // Add Points
            prisma.user.update({
                where: { id: userId },
                data: {
                    points: { increment: task.reward }
                }
            })
        ]);

        return NextResponse.json({ success: true, reward: task.reward });

    } catch (error) {
        console.error("Verify Task Error:", error);
        return NextResponse.json({ error: "Verify Failed" }, { status: 500 });
    }
}
