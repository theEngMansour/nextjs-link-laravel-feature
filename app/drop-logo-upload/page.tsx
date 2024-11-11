"use client";
import React from "react";
import {QRCodeSVG} from "qrcode.react";

function Page() {
    const [position, setPosition] = React.useState({x: 0, y: 0});
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragStart, setDragStart] = React.useState({x: 0, y: 0});

    const [positionQR, setPositionQR] = React.useState({x: 0, y: 0});
    const [isDraggingQR, setIsDraggingQR] = React.useState(false);
    const [dragStartQR, setDragStartQR] = React.useState({x: 0, y: 0});

    const pageBorderRef = React.useRef<HTMLDivElement>(null);

    const handleStart = (e: React.MouseEvent | React.TouchEvent, type: 'qr' | 'image') => {
        if ("touches" in e) {
            const touch = e.touches[0];
            if (type === 'qr') {
                setIsDraggingQR(true);
                setDragStartQR({
                    x: touch.clientX - positionQR.x,
                    y: touch.clientY - positionQR.y,
                });
            } else {
                setIsDragging(true);
                setDragStart({
                    x: touch.clientX - position.x,
                    y: touch.clientY - position.y,
                });
            }
        } else {
            if (type === 'qr') {
                setIsDraggingQR(true);
                setDragStartQR({
                    x: e.clientX - positionQR.x,
                    y: e.clientY - positionQR.y,
                });
            } else {
                setIsDragging(true);
                setDragStart({
                    x: e.clientX - position.x,
                    y: e.clientY - position.y,
                });
            }
        }
    };

    const handleMove = (e: MouseEvent | TouchEvent, type: 'qr' | 'image') => {
        if (!pageBorderRef.current) return;

        const rect = pageBorderRef.current.getBoundingClientRect();
        let clientX = 0, clientY = 0;

        if ("touches" in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        if (type === 'qr' && isDraggingQR) {
            const newX = clientX - dragStartQR.x;
            const newY = clientY - dragStartQR.y;
            if (newX >= 0 && newY >= 0 && newX + 100 <= rect.width && newY + 100 <= rect.height) {
                setPositionQR({x: newX, y: newY});
            }
        } else if (type === 'image' && isDragging) {
            const newX = clientX - dragStart.x;
            const newY = clientY - dragStart.y;
            if (newX >= 0 && newY >= 0 && newX + 120 <= rect.width && newY + 120 <= rect.height) {
                setPosition({x: newX, y: newY});
            }
        }
    };

    const handleEnd = (type: 'qr' | 'image') => {
        if (type === 'qr') setIsDraggingQR(false);
        else setIsDragging(false);
    };

    React.useEffect(() => {
        const moveQR = (e: MouseEvent | TouchEvent) => handleMove(e, 'qr');
        const moveImage = (e: MouseEvent | TouchEvent) => handleMove(e, 'image');

        if (isDraggingQR) {
            document.addEventListener("mousemove", moveQR);
            document.addEventListener("touchmove", moveQR);
            document.addEventListener("mouseup", () => handleEnd('qr'));
            document.addEventListener("touchend", () => handleEnd('qr'));
        } else {
            document.removeEventListener("mousemove", moveQR);
            document.removeEventListener("touchmove", moveQR);
        }

        if (isDragging) {
            document.addEventListener("mousemove", moveImage);
            document.addEventListener("touchmove", moveImage);
            document.addEventListener("mouseup", () => handleEnd('image'));
            document.addEventListener("touchend", () => handleEnd('image'));
        } else {
            document.removeEventListener("mousemove", moveImage);
            document.removeEventListener("touchmove", moveImage);
        }

        return () => {
            document.removeEventListener("mousemove", moveQR);
            document.removeEventListener("touchmove", moveQR);
            document.removeEventListener("mousemove", moveImage);
            document.removeEventListener("touchmove", moveImage);
        };
    }, [isDragging, isDraggingQR]);

    return (
        <div className="flex justify-center items-center">
            <div ref={pageBorderRef} className="page-border bg-white w-[210mm] border border-black p-4 relative">
                <div
                    style={{
                        transform: `translate(${positionQR.x}px, ${positionQR.y}px)`,
                        transition: isDraggingQR ? "none" : "transform 0.3s ease-in-out",
                        position: "absolute",
                    }}
                    onMouseDown={(e) => handleStart(e, 'qr')}
                    onTouchStart={(e) => handleStart(e, 'qr')}
                >
                    <QRCodeSVG value="https://example.com" size={100}/>
                </div>

                <div
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px)`,
                        transition: isDragging ? "none" : "transform 0.3s ease-in-out",
                        position: "absolute",
                    }}
                    onMouseDown={(e) => handleStart(e, 'image')}
                    onTouchStart={(e) => handleStart(e, 'image')}
                >
                    <img src="/logo.jpg" width={120} height={120}/>
                </div>

                <h1 className="text-2xl font-bold border-b pb-2">Document Title</h1>
                <p className="mt-2">
                    This is a sample document that will be printed in A4 format with a border
                    around the page.
                </p>

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
