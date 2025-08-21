import { createUploadthing, type FileRouter } from "uploadthing/next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const f = createUploadthing()

export const ourFileRouter = {
  // Image uploader for general use (blog posts, staff photos, etc.)
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const session = await getServerSession(authOptions)
      
      // Check if user is authenticated and has permission to upload
      if (!session?.user || session.user.role === 'VIEWER') {
        throw new Error("Unauthorized - You must be logged in with appropriate permissions to upload files")
      }
      
      return { 
        userId: session.user.id,
        userRole: session.user.role 
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId)
      console.log("File URL:", file.url)
      console.log("File key:", file.key)
      
      return { 
        uploadedBy: metadata.userId,
        fileUrl: file.url,
        fileKey: file.key 
      }
    }),

  // Slideshow image uploader with larger size limit
  slideshowUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const session = await getServerSession(authOptions)
      
      if (!session?.user || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
        throw new Error("Unauthorized - Admin or Editor role required for slideshow uploads")
      }
      
      return { 
        userId: session.user.id,
        userRole: session.user.role,
        uploadType: 'slideshow'
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Slideshow upload complete for userId:", metadata.userId)
      console.log("File URL:", file.url)
      
      return { 
        uploadedBy: metadata.userId,
        fileUrl: file.url,
        fileKey: file.key,
        uploadType: metadata.uploadType
      }
    }),

  // Ministry/Mission image uploader
  ministryUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const session = await getServerSession(authOptions)
      
      if (!session?.user || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
        throw new Error("Unauthorized - Admin or Editor role required")
      }
      
      return { 
        userId: session.user.id,
        userRole: session.user.role,
        uploadType: 'ministry'
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Ministry upload complete for userId:", metadata.userId)
      console.log("File URL:", file.url)
      
      return { 
        uploadedBy: metadata.userId,
        fileUrl: file.url,
        fileKey: file.key,
        uploadType: metadata.uploadType
      }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
