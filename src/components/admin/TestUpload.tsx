"use client";

import { useState } from 'react';
import { UploadDropzone, UploadButton } from '@/utils/uploadthing';

export function TestUpload() {
  const [isUploading, setIsUploading] = useState(false);

  console.log("🧪 [TestUpload] Component rendered");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log("🧪 [TestUpload] File input change:", files[0]);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3>Test Upload Component</h3>
      <p>This is a minimal test to see if UploadThing works at all.</p>
      
      {/* Simple file input test */}
      <div className="mb-4 p-2 bg-gray-100 rounded">
        <p className="text-sm mb-2">Test 1: Simple File Input</p>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange}
          className="text-sm"
        />
      </div>
      
      {/* Test 2: UploadButton */}
      <div className="mb-4 p-2 bg-green-100 rounded">
        <p className="text-sm mb-2">Test 2: UploadButton (Alternative)</p>
        <UploadButton
          endpoint="ministryUploader"
          onUploadBegin={(file) => {
            console.log("🧪 [TestUpload] UploadButton begin:", file);
            setIsUploading(true);
          }}
          onClientUploadComplete={(res) => {
            console.log("🧪 [TestUpload] UploadButton complete:", res);
            setIsUploading(false);
          }}
          onUploadError={(error) => {
            console.log("🧪 [TestUpload] UploadButton error:", error);
            setIsUploading(false);
          }}
        />
      </div>
      
      <UploadDropzone
        endpoint="ministryUploader"
        onUploadBegin={(file) => {
          console.log("🧪 [TestUpload] Upload begin with file:", file);
          setIsUploading(true);
        }}
        onClientUploadComplete={(res) => {
          console.log("🧪 [TestUpload] Upload complete:", res);
          setIsUploading(false);
        }}
        onUploadError={(error) => {
          console.log("🧪 [TestUpload] Upload error:", error);
          setIsUploading(false);
        }}
        onUploadProgress={(progress) => {
          console.log("🧪 [TestUpload] Upload progress:", progress);
        }}
        onDrop={(acceptedFiles) => {
          console.log("🧪 [TestUpload] Files dropped:", acceptedFiles);
        }}
      />
      
      {isUploading && <p>Uploading...</p>}
    </div>
  );
}
