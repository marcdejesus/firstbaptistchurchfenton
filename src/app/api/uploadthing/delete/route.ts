import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { UTApi } from "uploadthing/server"

const utapi = new UTApi()

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check authentication and permissions
    if (!session?.user || session.user.role === 'VIEWER') {
      return NextResponse.json(
        { error: "Unauthorized - You must be logged in with appropriate permissions" }, 
        { status: 401 }
      )
    }

    const body = await request.json()
    const { fileKey } = body

    if (!fileKey) {
      return NextResponse.json(
        { error: "File key is required" }, 
        { status: 400 }
      )
    }

    // Delete the file from UploadThing
    const result = await utapi.deleteFiles(fileKey)
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: "File deleted successfully",
        deletedBy: session.user.id 
      })
    } else {
      return NextResponse.json(
        { error: "Failed to delete file from storage" }, 
        { status: 500 }
      )
    }

  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    )
  }
}
