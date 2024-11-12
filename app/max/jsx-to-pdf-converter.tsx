'use client'

import { useState, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { jsPDF } from 'jspdf'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function Component() {
  const [jsxInput, setJsxInput] = useState<string>('<div><h1>Hello, World!</h1><p>This is a test.</p></div>')
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('')
  const contentRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    removeAfterPrint: true,
  })

  const convertToPDF = () => {
    handlePrint()
    const pdf = new jsPDF('p', 'mm', 'a4')
    if (contentRef.current) {
      pdf.html(contentRef.current, {
        callback: function (pdf) {
          const pdfData = pdf.output('blob')
          const pdfUrl = URL.createObjectURL(pdfData)
          setPdfUrl(pdfUrl)
          setStatus('PDF created successfully!')
        },
        x: 10,
        y: 10,
      })
    }
  }

  const uploadPDF = async () => {
    if (!pdfUrl) {
      setStatus('Please convert to PDF first')
      return
    }

    setStatus('Uploading PDF...')

    try {
      const response = await fetch(pdfUrl)
      const pdfBlob = await response.blob()

      const formData = new FormData()
      formData.append('file', pdfBlob, 'document.pdf')

      const uploadResponse = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData,
      })

      if (uploadResponse.ok) {
        setStatus('PDF uploaded successfully!')
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setStatus('Upload failed. Please try again.')
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>JSX to PDF Converter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="jsx-input">Enter JSX:</Label>
          <Textarea
            id="jsx-input"
            value={jsxInput}
            onChange={(e) => setJsxInput(e.target.value)}
            rows={10}
            className="font-mono"
          />
        </div>
        <div className="border p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Preview:</h3>
          <div ref={contentRef} dangerouslySetInnerHTML={{ __html: jsxInput }} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={convertToPDF}>Convert to PDF</Button>
        <Button onClick={uploadPDF} disabled={!pdfUrl}>Upload PDF</Button>
      </CardFooter>
      {status && <p className="text-center mt-2 text-sm text-muted-foreground">{status}</p>}
    </Card>
  )
}