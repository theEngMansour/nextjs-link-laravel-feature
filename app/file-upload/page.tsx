'use client'

import { useState, useCallback } from 'react'
import { Upload, X, CheckCircle2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
// import { toast } from "@/components/ui/use-toast"

// Simulated API function
const uploadFileToAPI = async (file: File, onProgress: (progress: number) => void): Promise<string> => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', 'https://api.example.com/upload')

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const progress = (event.loaded / event.total) * 100
                onProgress(progress)
            }
        }

        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.responseText)
            } else {
                reject(new Error('Upload failed'))
            }
        }

        xhr.onerror = () => {
            reject(new Error('Network error'))
        }

        const formData = new FormData()
        formData.append('file', file)
        xhr.send(formData)
    })
}

export default function Component() {
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadComplete, setUploadComplete] = useState(false)

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            setUploadProgress(0)
            setUploadComplete(false)
        }
    }, [])

    const handleUpload = useCallback(async () => {
        if (!file) return

        setUploading(true)
        try {
            const response = await uploadFileToAPI(file, (progress) => {
                setUploadProgress(progress)
            })
            setUploadComplete(true)
            // toast({
            //     title: "Upload Successful",
            //     description: `File uploaded successfully. Server response: ${response}`,
            // })
        } catch (error) {
            console.error('Upload failed:', error)
            // toast({
            //     title: "Upload Failed",
            //     description: "There was an error uploading your file. Please try again.",
            //     variant: "destructive",
            // })
        } finally {
            setUploading(false)
        }
    }, [file])

    const removeFile = useCallback(() => {
        setFile(null)
        setUploadProgress(0)
        setUploadComplete(false)
    }, [])

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors">
                <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Click to upload a file</p>
                    <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                </label>
            </div>

            {file && (
                <div className="mt-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 truncate max-w-[200px]">{file.name}</span>
                        {!uploading && !uploadComplete && (
                            <button
                                onClick={removeFile}
                                className="text-red-500 hover:text-red-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                        {uploadComplete && (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                        )}
                    </div>
                    {(uploading || uploadComplete) && (
                        <Progress value={uploadProgress} className="w-full mt-2" />
                    )}
                </div>
            )}

            <Button
                onClick={handleUpload}
                disabled={!file || uploading || uploadComplete}
                className="mt-4 w-full"
            >
                {uploading ? `Uploading... ${Math.round(uploadProgress)}%` : 'Upload File'}
            </Button>
        </div>
    )
}