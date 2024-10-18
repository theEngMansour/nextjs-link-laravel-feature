import Image from 'next/image'
import {delay} from "@/lib/delay";

export default async function PhotoCard({photo}: {
    photo: {
        id: string
        name: string
        href: string
        username: string
        imageSrc: string
    }
}) {
    await delay(5000)
    return (
        <>
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
                <a href={`/photos/${photo.id}`}>show</a>
            </div>
        </>
    )
}