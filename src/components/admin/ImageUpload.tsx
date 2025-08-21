"use client"

import { UploadButton, UploadDropzone } from "@/utils/uploadthing"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Trash2, Upload, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ImageUploadProps {
  value?: string
  onChange: (url: string, key: string) => void
  onRemove: () => void
  endpoint?: 'imageUploader' | 'slideshowUploader' | 'ministryUploader'
  className?: string
  disabled?: boolean
}

export function ImageUpload({ 
  value, 
  onChange, 
  onRemove, 
  endpoint = 'imageUploader',
  className,
  disabled = false 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUploadComplete = (res: any) => {
    setIsUploading(false)
    setError(null)
    
    if (res?.[0]) {
      onChange(res[0].url, res[0].key)
    }
  }

  const handleUploadError = (error: Error) => {
    setIsUploading(false)
    setError(error.message || 'Upload failed. Please try again.')
    console.error("Upload error:", error)
  }

  const handleUploadBegin = () => {
    setIsUploading(true)
    setError(null)
  }

  const handleRemove = () => {
    setError(null)
    onRemove()
  }

  return (
    <div className={cn("space-y-4", className)}>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {value ? (
        <div className="relative w-full h-64 rounded-lg overflow-hidden border border-border">
          <Image
            src={value}
            alt="Uploaded image"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {!disabled && (
            <Button
              type="button"
              onClick={handleRemove}
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 z-10"
              disabled={isUploading}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
          {disabled ? (
            <div className="flex flex-col items-center space-y-2 text-muted-foreground">
              <Upload className="h-8 w-8" />
              <p>Upload disabled</p>
            </div>
          ) : (
            <>
              {isUploading ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                </div>
              ) : (
                <UploadButton
                  endpoint={endpoint}
                  onClientUploadComplete={handleUploadComplete}
                  onUploadError={handleUploadError}
                  onUploadBegin={handleUploadBegin}
                  appearance={{
                    button: "bg-primary hover:bg-primary/90 text-primary-foreground",
                    allowedContent: "text-muted-foreground text-sm",
                  }}
                />
              )}
            </>
          )}
        </div>
      )}

      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Supported formats: JPEG, PNG, WebP</p>
        <p>• Maximum file size: {endpoint === 'slideshowUploader' ? '8MB' : '4MB'}</p>
        <p>• Recommended: High quality images for best results</p>
      </div>
    </div>
  )
}

// Alternative dropzone version for larger upload areas
export function ImageUploadDropzone({ 
  value, 
  onChange, 
  onRemove, 
  endpoint = 'imageUploader',
  className,
  disabled = false 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (value) {
    return (
      <ImageUpload 
        value={value}
        onChange={onChange}
        onRemove={onRemove}
        endpoint={endpoint}
        className={className}
        disabled={disabled}
      />
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="relative">
        {disabled ? (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Upload disabled</p>
          </div>
        ) : (
          <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
              setIsUploading(false)
              setError(null)
              if (res?.[0]) {
                onChange(res[0].url, res[0].key)
              }
            }}
            onUploadError={(error) => {
              setIsUploading(false)
              setError(error.message || 'Upload failed. Please try again.')
            }}
            onUploadBegin={() => {
              setIsUploading(true)
              setError(null)
            }}
            appearance={{
              container: "border-dashed border-2 border-muted-foreground/25",
              uploadIcon: "text-muted-foreground",
              label: "text-foreground font-medium",
              allowedContent: "text-muted-foreground",
            }}
          />
        )}
        
        {isUploading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Drag and drop or click to upload</p>
        <p>• Supported formats: JPEG, PNG, WebP</p>
        <p>• Maximum file size: {endpoint === 'slideshowUploader' ? '8MB' : '4MB'}</p>
      </div>
    </div>
  )
}
