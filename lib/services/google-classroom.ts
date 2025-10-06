import { google } from "googleapis"
import { prisma } from "@/lib/prisma"

export async function getClassroomClient(accessToken: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
  )
  
  oauth2Client.setCredentials({ access_token: accessToken })
  
  return google.classroom({ version: "v1", auth: oauth2Client })
}

export async function syncClassroomCourses(
  userId: string,
  accessToken: string
): Promise<{ synced: number; errors: string[] }> {
  try {
    const classroom = await getClassroomClient(accessToken)
    const errors: string[] = []
    let synced = 0
    
    const coursesResponse = await classroom.courses.list({
      courseStates: ["ACTIVE"],
    })
    
    const courses = coursesResponse.data.courses || []
    
    for (const course of courses) {
      try {
        await prisma.class.upsert({
          where: {
            userId_googleClassroomId: {
              userId,
              googleClassroomId: course.id!,
            },
          },
          update: {
            name: course.name || "Untitled Course",
            description: course.descriptionHeading || null,
          },
          create: {
            userId,
            name: course.name || "Untitled Course",
            color: getRandomColor(),
            description: course.descriptionHeading || null,
            googleClassroomId: course.id!,
          },
        })
        synced++
      } catch (error) {
        errors.push(`Failed to sync course ${course.name}: ${error}`)
      }
    }
    
    return { synced, errors }
  } catch (error) {
    console.error("Classroom sync error:", error)
    throw new Error(`Failed to sync Google Classroom: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function syncClassroomCoursework(
  userId: string,
  accessToken: string
): Promise<{ synced: number; errors: string[] }> {
  try {
    const classroom = await getClassroomClient(accessToken)
    const errors: string[] = []
    let synced = 0
    
    const userClasses = await prisma.class.findMany({
      where: { 
        userId,
        googleClassroomId: { not: null },
      },
    })
    
    for (const classItem of userClasses) {
      try {
        const courseworkResponse = await classroom.courses.courseWork.list({
          courseId: classItem.googleClassroomId!,
        })
        
        const coursework = courseworkResponse.data.courseWork || []
        
        for (const work of coursework) {
          try {
            const dueDate = work.dueDate
              ? new Date(
                  work.dueDate.year!,
                  work.dueDate.month! - 1,
                  work.dueDate.day!
                )
              : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            
            await prisma.assignment.upsert({
              where: {
                classId_googleClassroomId: {
                  classId: classItem.id,
                  googleClassroomId: work.id!,
                },
              },
              update: {
                title: work.title || "Untitled Assignment",
                description: work.description || null,
                dueDate,
              },
              create: {
                classId: classItem.id,
                title: work.title || "Untitled Assignment",
                description: work.description || null,
                type: work.workType === "ASSIGNMENT" ? "assignment" : "quiz",
                dueDate,
                weight: work.maxPoints || 100,
                googleClassroomId: work.id!,
              },
            })
            synced++
          } catch (error) {
            errors.push(`Failed to sync coursework ${work.title}: ${error}`)
          }
        }
      } catch (error) {
        errors.push(`Failed to sync coursework for class ${classItem.name}: ${error}`)
      }
    }
    
    return { synced, errors }
  } catch (error) {
    console.error("Coursework sync error:", error)
    throw new Error(`Failed to sync coursework: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function syncClassroomMaterials(
  userId: string,
  accessToken: string
): Promise<{ synced: number; errors: string[] }> {
  try {
    const classroom = await getClassroomClient(accessToken)
    const errors: string[] = []
    let synced = 0
    
    const userClasses = await prisma.class.findMany({
      where: { 
        userId,
        googleClassroomId: { not: null },
      },
    })
    
    for (const classItem of userClasses) {
      try {
        const materialsResponse = await classroom.courses.courseWorkMaterials.list({
          courseId: classItem.googleClassroomId!,
        })
        
        const materials = materialsResponse.data.courseWorkMaterial || []
        
        for (const material of materials) {
          try {
            await prisma.material.upsert({
              where: {
                classId_googleClassroomId: {
                  classId: classItem.id,
                  googleClassroomId: material.id!,
                },
              },
              update: {
                title: material.title || "Untitled Material",
                content: material.description || "",
              },
              create: {
                classId: classItem.id,
                title: material.title || "Untitled Material",
                type: "link",
                source: material.alternateLink || "",
                content: material.description || "",
                googleClassroomId: material.id!,
              },
            })
            synced++
          } catch (error) {
            errors.push(`Failed to sync material ${material.title}: ${error}`)
          }
        }
      } catch (error) {
        errors.push(`Failed to sync materials for class ${classItem.name}: ${error}`)
      }
    }
    
    return { synced, errors }
  } catch (error) {
    console.error("Materials sync error:", error)
    throw new Error(`Failed to sync materials: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

function getRandomColor(): string {
  const colors = [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#84cc16",
    "#10b981",
    "#14b8a6",
    "#06b6d4",
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#ec4899",
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
