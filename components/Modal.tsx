'use client'

import {useRouter} from 'next/navigation'
import React from "react";

export default function Modal({children}: { children: React.ReactNode }) {
    const router = useRouter()
    const handleClose = () => router.back()

    return (
        <div className="bg-cyan-900">
            <div className='relative z-10' onClick={handleClose}>
                <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
                    <div
                        className='flex bg-black/90 min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
                        <div
                            className='relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}