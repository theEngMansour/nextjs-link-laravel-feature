"use client"
import React, {useRef, useState} from 'react'
import {Document, Page, pdfjs} from 'react-pdf'
import html2canvas from 'html2canvas';

import Draggable from 'react-draggable'
import {QRCodeSVG} from 'qrcode.react'
import {PDFDocument} from 'pdf-lib'
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"

// Ensure PDF.js worker is available
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

export default function PDFQRPlacer() {
    const [file, setFile] = useState<File | null>(null)
    const [numPages, setNumPages] = useState<number>(0)
    const [qrPosition, setQRPosition] = useState({x: 0, y: 0})
    const [logoPosition, setLogoPosition] = useState({x: 0, y: 0})
    const [currentPage, setCurrentPage] = useState(1)
    const qrRef = useRef<SVGSVGElement>(null)
    const logoRef = useRef<HTMLImageElement>(null)
    const pdfRef = useRef<HTMLDivElement>(null)


    const save = async () => {
        if (!pdfRef.current) return;


        const canvas = await html2canvas(pdfRef.current);
        const imgData = canvas.toDataURL('image/png');

        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();


        const pngImage = await pdfDoc.embedPng(imgData);
        const {width, height} = page.getSize();

        const imgWidth = width;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        page.drawImage(pngImage, {
            x: 0,
            y: height - imgHeight,
            width: imgWidth,
            height: imgHeight,
        });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], {type: 'application/pdf'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'document.pdf';
        link.click();
    };


    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files && files[0]) {
            setFile(files[0])
        }
    }

    const onDocumentLoadSuccess = ({numPages}: { numPages: number }) => {
        setNumPages(numPages)
    }

    const handleDragQR = (e: any, data: { x: number; y: number }) => {
        setQRPosition({x: data.x, y: data.y})
    }

    const handleDragLogo = (e: any, data: { x: number; y: number }) => {
        setLogoPosition({x: data.x, y: data.y})
    }

    const savePDF = async () => {
        if (!file || !qrRef.current || !pdfRef.current || !logoRef.current) return;

        const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
        const pages = pdfDoc.getPages();
        const firstPage = pages[currentPage - 1];

        const {width, height} = firstPage.getSize();

        // Embed QR Code
        const qrSVGString = new XMLSerializer().serializeToString(qrRef.current);
        const qrPngImage = await pdfDoc.embedPng(await svgToPng(qrSVGString));

        // Embed Logo
        const logoPngImage = await pdfDoc.embedPng(await imageToPng(logoRef.current));

        const pdfContainer = pdfRef.current.getBoundingClientRect();
        const qrContainer = qrRef.current.getBoundingClientRect();
        const logoContainer = logoRef.current.getBoundingClientRect();

        const scaleFactorX = width / pdfContainer.width;
        const scaleFactorY = height / pdfContainer.height;

        // Correct QR Code Position
        const qrX = qrPosition.x * scaleFactorX;
        const qrY = height - (qrPosition.y * scaleFactorY + qrContainer.height * scaleFactorY);

        // Correct Logo Position
        const logoX = logoPosition.x * scaleFactorX;
        const logoY = height - (logoPosition.y * scaleFactorY + logoContainer.height * scaleFactorY);

        firstPage.drawImage(qrPngImage, {
            x: qrX,
            y: qrY,
            width: 100 * scaleFactorX,  // Adjust size scaling
            height: 100 * scaleFactorY, // Adjust size scaling
        });

        firstPage.drawImage(logoPngImage, {
            x: logoX,
            y: logoY,
            width: 100 * scaleFactorX,  // Adjust size scaling
            height: 100 * scaleFactorY, // Adjust size scaling
        });

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], {type: 'application/pdf'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'modified_document.pdf';
        link.click();
    };

    const svgToPng = (svgString: string): Promise<Uint8Array> => {
        return new Promise((resolve) => {
            const img = new Image()
            img.onload = () => {
                const canvas = document.createElement('canvas')
                canvas.width = img.width
                canvas.height = img.height
                const ctx = canvas.getContext('2d')
                ctx!.drawImage(img, 0, 0)
                canvas.toBlob((blob) => {
                    const reader = new FileReader()
                    reader.onloadend = () => {
                        const arrayBuffer = reader.result as ArrayBuffer
                        resolve(new Uint8Array(arrayBuffer))
                    }
                    reader.readAsArrayBuffer(blob!)
                })
            }
            img.src = 'data:image/svg+xml;base64,' + btoa(svgString)
        })
    }

    const imageToPng = (imageElement: HTMLImageElement): Promise<Uint8Array> => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas')
            canvas.width = imageElement.width
            canvas.height = imageElement.height
            const ctx = canvas.getContext('2d')
            ctx!.drawImage(imageElement, 0, 0)
            canvas.toBlob((blob) => {
                const reader = new FileReader()
                reader.onloadend = () => {
                    const arrayBuffer = reader.result as ArrayBuffer
                    resolve(new Uint8Array(arrayBuffer))
                }
                reader.readAsArrayBuffer(blob!)
            })
        })
    }

    return (
        <Card className="w-full max-w-4xl mx-auto bg-red-900">
            <CardHeader>
                <CardTitle>PDF QR Code & Logo Placer</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <Input
                        type="file"
                        accept=".pdf"
                        onChange={onFileChange}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                    />
                </div>
                {file && (
                    <div className="relative" ref={pdfRef}>
                        <Document
                            file={file}
                            onLoadSuccess={onDocumentLoadSuccess}
                            className="flex flex-col items-center"
                        >
                            <Page pageNumber={currentPage} width={600}/>
                        </Document>

                        <Draggable onDrag={handleDragLogo} bounds="parent">
                            <div className="absolute top-0 left-0 cursor-move">
                                <img
                                    src="/systeml.svg" // Replace with actual logo path
                                    alt="Logo"
                                    width={100}
                                    ref={logoRef}
                                />
                            </div>
                        </Draggable>
                        <Draggable onDrag={handleDragQR} bounds="parent">
                            <div className="absolute top-0 right-0 left-0 cursor-move">
                                <QRCodeSVG
                                    value="https://example.com"
                                    size={100}
                                    ref={qrRef}
                                />
                            </div>
                        </Draggable>
                    </div>
                )}
                {numPages > 0 && (
                    <div className="mt-4 flex justify-between items-center">
                        <Button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <span>
                              Page {currentPage} of {numPages}
                            </span>
                        <Button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, numPages))}
                            disabled={currentPage === numPages}
                        >
                            Next
                        </Button>
                    </div>
                )}
                <div className="mt-4">
                    <Button onClick={savePDF} disabled={!file}>
                        Save Modified PDF
                    </Button> <Button onClick={save} disabled={!file}>
                    Save PDF
                </Button>
                </div>
            </CardContent>
        </Card>
    )
}
