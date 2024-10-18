import React from "react";
import Link from "next/link";

export default function Layout({children, dashboard, team}: {
    children: React.ReactNode,
    dashboard: React.ReactNode,
    team: React.ReactNode
}) {
    return (
        <div className='px-12'>
            <Header/>
            <div>
                {children}
            </div>
            <div className='grid grid-cols-2 gap-4 mt-4'>
                {dashboard}
                {team}
            </div>
        </div>
    );
}

function Header() {
    return (
        <div className='space-x-2 mt-4'>
            <Link href='/parallel' className='bg-blue-500 text-white hover:bg-blue-700 p-2 rounded-lg'>
                Home
            </Link>
            <Link href='/parallel/settings' className='bg-blue-500 text-white hover:bg-blue-700 p-2 rounded-lg'>
                Settings
            </Link>
            <Link href='/parallel/about' className='bg-blue-500 text-white hover:bg-blue-700 p-2 rounded-lg'>
                About
            </Link>
        </div>
    )
}