"use client";
import React from 'react';
import {QRCodeSVG} from "qrcode.react";

function Page() {
    const [position, setPosition] = React.useState({x: 0, y: 0});
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragStart, setDragStart] = React.useState({x: 0, y: 0});

    const [positionQR, setPositionQR] = React.useState({x: 0, y: 0});
    const [isDraggingQR, setIsDraggingQR] = React.useState(false);
    const [dragStartQR, setDragStartQR] = React.useState({x: 0, y: 0});

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseQRDown = (e: React.MouseEvent) => {
        setIsDraggingQR(true);
        setDragStartQR({
            x: e.clientX - positionQR.x,
            y: e.clientY - positionQR.y,
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
        });
    };

    const handleMouseMoveQR = (e: React.MouseEvent) => {
        if (!isDraggingQR) return;
        setPositionQR({
            x: e.clientX - dragStartQR.x,
            y: e.clientY - dragStartQR.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseUpQR = () => {
        setIsDraggingQR(false);
    };

    React.useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        } else {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }

        if (isDraggingQR) {
            document.addEventListener("mousemove", handleMouseMoveQR);
            document.addEventListener("mouseup", handleMouseUpQR);
        } else {
            document.removeEventListener("mousemove", handleMouseMoveQR);
            document.removeEventListener("mouseup", handleMouseUpQR);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousemove", handleMouseMoveQR);
            document.removeEventListener("mouseup", handleMouseUpQR);
        };
    }, [isDragging, isDraggingQR]);

    const qrRef = React.useRef<SVGSVGElement>(null);

    return (
        <div className="flex justify-center items-center">
            <div className="page-border bg-white w-[210mm] border border-black p-4">
                <div style={{
                    transform: `translate(${positionQR.x}px, ${positionQR.y}px)`,
                    transition: isDraggingQR ? 'none' : 'transform 0.3s ease-in-out',
                }}
                     onMouseDown={handleMouseQRDown}
                     onMouseUp={handleMouseUpQR}
                     onMouseMove={handleMouseMoveQR}
                >
                    <QRCodeSVG
                        value="https://example.com"
                        size={100}
                        ref={qrRef}
                    />
                </div>

                <div style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    transition: isDragging ? 'none' : 'transform 0.3s ease-in-out',
                }}
                     onMouseDown={handleMouseDown}
                     onMouseUp={handleMouseUp}
                     onMouseMove={handleMouseMove}
                >
                    <p className='cursor-move'>
                        <img src='/logo.jpg' width={120} height={120}/>
                    </p>
                </div>

                <h1 className="text-2xl font-bold border-b pb-2">Document Title</h1>
                <p className="mt-2">This is a sample document that will be printed in A4 format with a border around the
                    page.</p>

                <div className="mt-4 border p-4 rounded-lg">
                    <h2 className="text-xl font-semibold border-b pb-2">Section 1</h2>
                    <p>Content for section 1 goes here. This section is visually separated with a border.</p>
                </div>

                <div className="mt-4 border p-4 rounded-lg">
                    <h2 className="text-xl font-semibold border-b pb-2">Section 2</h2>
                    <p>Content for section 2 goes here. This section also has a border for clarity.</p>
                </div>
            </div>
        </div>
    );
}

export default Page;
