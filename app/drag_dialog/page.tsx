"use client"

import * as React from "react"
import {X} from "lucide-react"

import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function Component() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [position, setPosition] = React.useState({x: 0, y: 0})
    const [isDragging, setIsDragging] = React.useState(false)
    const [dragStart, setDragStart] = React.useState({x: 0, y: 0})

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true)
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        })
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
        })
    }

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
    const qrRef = React.useRef<SVGSVGElement>(null)

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Open Draggable Dialog</Button>
            </DialogTrigger>
            <DialogContent
                className="sm:max-w-[425px]"
                style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    transition: isDragging ? 'none' : 'transform 0.3s ease-in-out',
                }}
                onMouseDown={(e) => e.preventDefault()}
            >
                <DialogHeader
                    className="cursor-move"
                    onMouseDown={handleMouseDown}
                >
                    <DialogTitle>Draggable Dialog</DialogTitle>
                    <DialogDescription>
                        You can drag this dialog by its header.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <p>This is the content of the draggable dialog.</p>
                    <p>You can add any components or text here.</p>
                </div>
                <Button
                    className="absolute right-4 top-4"
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                >
                    <X className="h-4 w-4"/>
                    <span className="sr-only">Close</span>
                </Button>
            </DialogContent>
        </Dialog>
    )
}