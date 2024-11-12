'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Component() {
  const [rotation, setRotation] = useState(0)

  const handleClick = () => {
    setRotation(prevRotation => (prevRotation + 90) % 360)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <button   onClick={handleClick}>rote image</button>
      <div 
        className="bg-white p-4 rounded-lg shadow-lg cursor-pointer transition-transform duration-500 ease-in-out"
        style={{ transform: `rotate(${rotation}deg)` }}
        onClick={handleClick}
      >
        <Image
          src="/placeholder.svg?height=300&width=300"
          alt="Rotating image"
          width={300}
          height={300}
          className="rounded-md"
        />
      </div>
    </div>
  )
}