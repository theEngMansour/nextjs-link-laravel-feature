"use client"
import React from 'react';

function Page() {
    const [position, setPosition] = React.useState({x: 0, y: 0})
    const [isDragging, setIsDragging] = React.useState(false)
    const [dragStart, setDragStart] = React.useState({x: 0, y: 0})

    // الغرض: يتم استدعاؤها عند الضغط على زر الفأرة.
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true)
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        })
    }
    // الغرض: يتم استدعاؤها عند تحريك الفأرة بعد الضغط.
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
        })
    }
    // الغرض: يتم استدعاؤها عند إفلات زر الفأرة.
    const handleMouseUp = () => {
        setIsDragging(false)
    }

    React.useEffect(() => {
        console.log(isDragging)
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove as any)
            document.addEventListener("mouseup", handleMouseUp)
        } else {
            document.removeEventListener("mousemove", handleMouseMove as any)
            document.removeEventListener("mouseup", handleMouseUp)
        }
        return () => {
            document.removeEventListener("mousemove", handleMouseMove as any)
            document.removeEventListener("mouseup", handleMouseUp)
        }
    }, [isDragging])

    return (

        <div className="flex justify-center items-center ">
            <div className="page-border bg-white w-[210mm] border border-black p-4">
                <div style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    transition: isDragging ? 'none' : 'transform 0.3s ease-in-out',
                }}
                     onMouseDown={(e) => e.preventDefault()}>
                    <p onMouseDown={handleMouseDown} className='cursor-move'>
                        <img src='/logo.jpg' width={120} height={120}/>
                    </p>
                    <div>

                    </div>

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

/*        <div className="border-2 border-black h-52">
            <div style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                transition: isDragging ? 'none' : 'transform 0.3s ease-in-out',
            }}
                 onMouseDown={(e) => e.preventDefault()}>
                <p onMouseDown={handleMouseDown} className='cursor-move'>
                    <img src='/logo.jpg' width={120} height={120}/>
                </p>
                <div>

                </div>

            </div>
        </div>*/

export default Page;