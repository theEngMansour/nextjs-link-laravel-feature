import Link from 'next/link'
import photos, {Photo} from '@/app/photos/photo'
import Image from "next/image";
import {Suspense} from "react";
import Loading from "@/app/photos/loading";
import {delay} from "@/lib/delay"

export default async function PhotoPage({params: {id}}: {
    params: { id: string }
}) {
    const photo: Photo = photos.find(p => p.id === id)!
    await delay(5000)
    return (
        <section className='py-24'>
            <div className='container'>
                <div>
                    <Link
                        href='/photos'
                        className='font-semibold italic text-sky-600 underline'
                    >
                        Back to photos
                    </Link>
                </div>
                <div className='mt-10 w-1/3'>
                    <Suspense fallback={<Loading/>}>
                        <Image
                            alt=''
                            src={photo.imageSrc}
                            height={600}
                            width={600}
                            className='col-span-1 aspect-square w-full object-cover'
                        />
                        <div className=' bg-white p-2 px-4'>
                            <h3 className='font-serif text-xl font-medium'>{photo.name}</h3>
                            <p className='text-sm text-gray-500'>Taken by {photo.username}</p>
                        </div>
                    </Suspense>
                </div>
            </div>
        </section>
    )
}