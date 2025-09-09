import { createUploadthing, type FileRouter } from "uploadthing/next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Debug environment variables
console.log("🔧 [UploadThing Core] Environment check:", {
  hasUploadThingToken: !!process.env.UPLOADTHING_TOKEN,
  tokenLength: process.env.UPLOADTHING_TOKEN?.length || 0,
  nodeEnv: process.env.NODE_ENV
});

const f = createUploadthing()

export const ourFileRouter = {
  // Image uploader for general use (blog posts, staff photos, etc.)
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      console.log("🔐 [UPLOADTHING] Middleware called for imageUploader");
      
      try {
        const session = await getServerSession(authOptions);
        console.log("🔐 [UPLOADTHING] Session:", { 
          hasUser: !!session?.user, 
          userId: session?.user?.id, 
          userRole: session?.user?.role 
        });
        
        // Check if user is authenticated and has permission to upload
        if (!session?.user || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
          console.log("❌ [UPLOADTHING] Authorization failed:", { 
            hasUser: !!session?.user, 
            userRole: session?.user?.role 
          });
          throw new Error("Unauthorized - You must be logged in with appropriate permissions to upload files")
        }
        
        console.log("✅ [UPLOADTHING] Authorization successful for user:", session.user.id);
        return { 
          userId: session.user.id,
          userRole: session.user.role 
        }
      } catch (error) {
        console.error("❌ [UPLOADTHING] Middleware error:", error);
        throw error;
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("🎉 [UPLOADTHING] imageUploader upload complete");
      console.log("📁 [UPLOADTHING] File details:", {
        url: file.url,
        key: file.key,
        name: file.name,
        size: file.size
      });
      console.log("👤 [UPLOADTHING] User metadata:", metadata);
      
      return { 
        uploadedBy: metadata.userId,
        fileUrl: file.url,
        fileKey: file.key 
      }
    }),

  // Slideshow image uploader with larger size limit
  slideshowUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      console.log("🔐 [UPLOADTHING] Middleware called for slideshowUploader");
      
      try {
        const session = await getServerSession(authOptions);
        console.log("🔐 [UPLOADTHING] Slideshow session:", { 
          hasUser: !!session?.user, 
          userId: session?.user?.id, 
          userRole: session?.user?.role 
        });
        
        if (!session?.user || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
          console.log("❌ [UPLOADTHING] Slideshow authorization failed:", { 
            hasUser: !!session?.user, 
            userRole: session?.user?.role 
          });
          throw new Error("Unauthorized - Admin or Editor role required for slideshow uploads")
        }
        
        console.log("✅ [UPLOADTHING] Slideshow authorization successful for user:", session.user.id);
        return { 
          userId: session.user.id,
          userRole: session.user.role,
          uploadType: 'slideshow'
        }
      } catch (error) {
        console.error("❌ [UPLOADTHING] Slideshow middleware error:", error);
        throw error;
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("🎉 [UPLOADTHING] slideshowUploader upload complete");
      console.log("📁 [UPLOADTHING] Slideshow file details:", {
        url: file.url,
        key: file.key,
        name: file.name,
        size: file.size
      });
      console.log("👤 [UPLOADTHING] Slideshow user metadata:", metadata);
      
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
      console.log("🔐 [UPLOADTHING] Middleware called for ministryUploader");
      
      try {
        const session = await getServerSession(authOptions);
        console.log("🔐 [UPLOADTHING] Ministry session:", { 
          hasUser: !!session?.user, 
          userId: session?.user?.id, 
          userRole: session?.user?.role 
        });
        
        if (!session?.user || !['ADMIN', 'EDITOR'].includes(session.user.role)) {
          console.log("❌ [UPLOADTHING] Ministry authorization failed:", { 
            hasUser: !!session?.user, 
            userRole: session?.user?.role 
          });
          throw new Error("Unauthorized - Admin or Editor role required")
        }
        
        console.log("✅ [UPLOADTHING] Ministry authorization successful for user:", session.user.id);
        return { 
          userId: session.user.id,
          userRole: session.user.role,
          uploadType: 'ministry'
        }
      } catch (error) {
        console.error("❌ [UPLOADTHING] Ministry middleware error:", error);
        throw error;
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("🎉 [UPLOADTHING] ministryUploader upload complete");
      console.log("📁 [UPLOADTHING] Ministry file details:", {
        url: file.url,
        key: file.key,
        name: file.name,
        size: file.size
      });
      console.log("👤 [UPLOADTHING] Ministry user metadata:", metadata);
      
      return { 
        uploadedBy: metadata.userId,
        fileUrl: file.url,
        fileKey: file.key,
        uploadType: metadata.uploadType
      }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
