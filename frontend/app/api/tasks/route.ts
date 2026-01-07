import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "skibidi-secret-key-do-not-leak";

export async function GET(req: Request) {
    try {
        // 1. Check Auth (Optional for viewing, but good for tracking status)
        const token = (await cookies()).get("skibidi_token")?.value;
        let userId = null;

        if (token) {
            try {
                const decoded: any = jwt.verify(token, JWT_SECRET);
                if (decoded && decoded.userId) {
                    userId = decoded.userId;
                }
            } catch (e) {
                console.error("JWT Verify Error in Tasks API:", e);
            }
        }

        // 2. Lazy Seed (Tạo nhiệm vụ mẫu nếu chưa có)
        const count = await prisma.task.count();
        if (count === 0) {
            await prisma.task.createMany({
                data: [
                    {
                        title: "Bypass Shortlink",
                        description: "Complete a quick captcha to support the project and earn rewards.",
                        reward: 5,
                        link: "https://shrtslug.biz/8t48D",
                        platform: "SHORTLINK",
                    },
                    {
                        title: "Join Telegram Community",
                        description: "Join our official Telegram for early updates and support.",
                        reward: 10,
                        link: "https://t.me/skibidirizz",
                        platform: "TELEGRAM",
                    },
                    {
                        title: "Follow us on X (Twitter)",
                        description: "Follow our official handle to stay updated with token news.",
                        reward: 10,
                        link: "https://twitter.com/skibidirizz",
                        platform: "TWITTER",
                    },
                ],
            });
        } else {
            // AUTO-UPDATE: Đảm bảo link luôn đúng ngay cả khi DB đã có data cũ
            const tasks = await prisma.task.findMany({ where: { platform: "SHORTLINK" } });
            for (const t of tasks) {
                if (t.link !== "https://shrtslug.biz/8t48D") {
                    await prisma.task.update({
                        where: { id: t.id },
                        data: { link: "https://shrtslug.biz/8t48D" }
                    });
                }
            }
        }

        // 3. Get Tasks
        const tasks = await prisma.task.findMany({
            where: { isActive: true },
            orderBy: { reward: 'asc' }, // Nhiệm vụ dễ lên trước
            include: userId ? {
                logs: {
                    where: { userId: userId }
                }
            } : undefined
        });

        // 4. Format data for Frontend
        const formattedTasks = tasks.map((t: any) => ({
            id: t.id,
            title: t.title,
            description: t.description,
            reward: t.reward,
            link: t.link,
            platform: t.platform,
            completed: (userId && t.logs) ? t.logs.length > 0 : false // Check if user did it
        }));

        return NextResponse.json({ tasks: formattedTasks });

    } catch (error: any) {
        console.error("Get Tasks Error:", error);
        return NextResponse.json({
            error: "Failed to fetch tasks",
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
