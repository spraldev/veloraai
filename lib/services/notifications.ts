import webpush from "web-push"
import { prisma } from "@/lib/prisma"

if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL || "mailto:example@example.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  )
}

export async function sendNotification(
  userId: string,
  title: string,
  body: string,
  data?: any
) {
  try {
    const subscriptions = await prisma.notificationSubscription.findMany({
      where: { userId },
    })
    
    const payload = JSON.stringify({
      title,
      body,
      data,
    })
    
    await Promise.all(
      subscriptions.map(async sub => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: sub.keys as any,
            },
            payload
          )
        } catch (error) {
          console.error("Failed to send notification to subscription:", error)
          
          if ((error as any).statusCode === 410) {
            await prisma.notificationSubscription.delete({
              where: { id: sub.id },
            })
          }
        }
      })
    )
  } catch (error) {
    console.error("Notification sending error:", error)
  }
}

export async function sendDailyBriefNotification(userId: string) {
  await sendNotification(
    userId,
    "Your Study Brief is Ready",
    "Check out your personalized study plan for today"
  )
}

export async function sendQuizReminderNotification(
  userId: string,
  className: string
) {
  await sendNotification(
    userId,
    "Quiz Tomorrow",
    `You have a ${className} quiz coming up tomorrow`
  )
}
