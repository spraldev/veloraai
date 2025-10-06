import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { google } from "googleapis"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { accounts: true },
    })
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    const googleAccount = user.accounts.find(a => a.provider === "google")
    
    if (!googleAccount?.access_token) {
      return NextResponse.json(
        { error: "Google account not connected" },
        { status: 400 }
      )
    }
    
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({
      access_token: googleAccount.access_token,
      refresh_token: googleAccount.refresh_token,
    })
    
    const classroom = google.classroom({ version: "v1", auth: oauth2Client })
    
    const coursesResponse = await classroom.courses.list({
      courseStates: ["ACTIVE"],
      pageSize: 100,
    })
    
    const courses = coursesResponse.data.courses || []
    
    let classesCreated = 0
    let assignmentsCreated = 0
    
    for (const course of courses) {
      if (!course.id || !course.name) continue
      
      const existingClass = await prisma.class.findFirst({
        where: {
          userId: user.id,
          googleClassroomId: course.id,
        },
      })
      
      if (existingClass) continue
      
      const newClass = await prisma.class.create({
        data: {
          userId: user.id,
          name: course.name,
          teacher: course.room || "",
          color: "#EB1F3A",
          googleClassroomId: course.id,
        },
      })
      
      classesCreated++
      
      const courseworkResponse = await classroom.courses.courseWork.list({
        courseId: course.id,
        pageSize: 50,
      })
      
      const coursework = courseworkResponse.data.courseWork || []
      
      for (const work of coursework) {
        if (!work.id || !work.title) continue
        
        const existingAssignment = await prisma.assignment.findFirst({
          where: {
            classId: newClass.id,
            googleClassroomId: work.id,
          },
        })
        
        if (existingAssignment) continue
        
        await prisma.assignment.create({
          data: {
            userId: user.id,
            classId: newClass.id,
            title: work.title,
            description: work.description || "",
            dueDate: work.dueDate
              ? new Date(
                  work.dueDate.year!,
                  work.dueDate.month! - 1,
                  work.dueDate.day!
                )
              : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            type: work.workType === "ASSIGNMENT" ? "assignment" : "other",
            weight: work.maxPoints || 10,
            completed: false,
            googleClassroomId: work.id,
          },
        })
        
        assignmentsCreated++
      }
    }
    
    return NextResponse.json({
      success: true,
      classesCreated,
      assignmentsCreated,
    })
  } catch (error) {
    console.error("Classroom sync error:", error)
    return NextResponse.json(
      { error: "Failed to sync with Google Classroom" },
      { status: 500 }
    )
  }
}
