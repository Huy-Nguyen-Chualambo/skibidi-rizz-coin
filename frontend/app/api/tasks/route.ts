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
                userId = decoded.userId;
            } catch (e) { }
        }

        // 2. Lazy Seed (Tạo nhiệm vụ mẫu nếu chưa có)
        const count = await prisma.task.count();
        if (count === 0) {
            await prisma.task.createMany({
                data: [
                    {
                        title: "Vượt ải Shortlink",
                        description: "Click link, xác thực captcha để ủng hộ dự án.",
                        reward: 5, // 5 Points
                        link: "https://shrtslug.biz/8t48D",
                        platform: "SHORTLINK",
                    },
                    {
                        title: "Join Telegram Skibidi",
                        description: "Tham gia cộng đồng chém gió.",
                        reward: 10,
                        link: "https://t.me/skibidirizz",
                        platform: "TELEGRAM",
                    },
                    {
                        title: "Follow Twitter (X)",
                        description: "Follow để cập nhật tin tức Airdrop.",
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
            include: {
                logs: userId ? {
                    where: { userId: userId }
                } : false
            }
        });

        // 4. Format data for Frontend
        const formattedTasks = tasks.map(t => ({
            id: t.id,
            title: t.title,
            description: t.description,
            reward: t.reward,
            link: t.link,
            platform: t.platform,
            completed: userId ? t.logs.length > 0 : false // Check if user did it
        }));

        return NextResponse.json({ tasks: formattedTasks });

    } catch (error) {
        console.error("Get Tasks Error:", error);
        return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }
}
