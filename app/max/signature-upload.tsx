'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import SignatureCanvas from 'react-signature-canvas'
import { jsPDF } from 'jspdf'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Component() {
  const [rotation, setRotation] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const sigPad = useRef<SignatureCanvas>(null)

  const handleRotate = () => {
    setRotation(prevRotation => (prevRotation + 90) % 360)
  }

  const handleClear = () => {
    sigPad.current?.clear()
  }

  const handleUpload = async () => {
    if (sigPad.current?.isEmpty()) {
      setUploadStatus('Please add a signature before uploading.')
      return
    }

    setUploading(true)
    setUploadStatus('Creating PDF...')

    try {
      // Create PDF
      const pdf = new jsPDF()
      
      // Add rotated image
      const imgData = '/placeholder.svg?height=300&width=300'
      pdf.addImage(imgData, 'SVG', 10, 10, 100, 100)
      pdf.setTextColor(255, 0, 0) // Red text color for rotation indicator
      pdf.text(`Rotation: ${rotation}°`, 10, 120)

      // Add signature
      const sigData = sigPad.current?.getTrimmedCanvas().toDataURL('image/png')
      pdf.addImage(sigData, 'PNG', 10, 130, 100, 50)

      // Convert PDF to blob
      const pdfBlob = pdf.output('blob')

      // Create FormData and append PDF
      const formData = new FormData()
      formData.append('file', pdfBlob, 'signed_document.pdf')

      setUploadStatus('Uploading to API...')

      // Upload to API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setUploadStatus('Upload successful!')
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Error:', error)
      setUploadStatus('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Signature Upload</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          className="relative w-full h-64 bg-white rounded-lg shadow-inner overflow-hidden cursor-pointer"
          onClick={handleRotate}
        >
          <Image
            src="/placeholder.svg?height=300&width=300"
            alt="Rotating image"
            layout="fill"
            objectFit="contain"
            className="transition-transform duration-500 ease-in-out"
            style={{ transform: `rotate(${rotation}deg)` }}
          />
        </div>
        <div className="border rounded-lg p-2">
          <SignatureCanvas
            ref={sigPad}
            canvasProps={{
              className: 'w-full h-40 border rounded',
            }}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleClear} variant="outline">Clear Signature</Button>
        <Button onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload as PDF'}
        </Button>
      </CardFooter>
      {uploadStatus && (
        <p className="text-center mt-2 text-sm text-muted-foreground">{uploadStatus}</p>
      )}
    </Card>
  )
}