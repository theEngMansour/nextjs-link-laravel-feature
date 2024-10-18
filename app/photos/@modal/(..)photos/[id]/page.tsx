import Modal from '@/components/Modal'
import photos, {Photo} from '@/app/photos/photo'
import PhotoCard from "@/components/PhotoCard";
import Loading from "@/app/photos/loading";
import {Suspense} from "react";

export default async function PhotoModal({params: {id}}: {
    params: { id: string }
}) {
    const photo: Photo = photos.find((p: { id: string }) => p.id === id)!
 
    return (
        <Modal>
            <Suspense fallback={<Loading/>}>
                <PhotoCard photo={photo}/>
            </Suspense>
        </Modal>
    )
}