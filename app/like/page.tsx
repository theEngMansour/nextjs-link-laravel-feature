import React from 'react';
import LikeButton from "@/app/like/LikeButton";

async function Page() {
    const like = await fetch('http://localhost:8000/api/like')
    const data = await like.json();
    return (
        <LikeButton  initialLikes={data.count} />
    );
}

export default Page;