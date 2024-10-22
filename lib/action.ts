'use server'

import {revalidatePath} from "next/cache";

export async function likePost(prevLikes: { active: boolean; likes: number }) {
    const response = await fetch('http://localhost:8000/api/like', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'like_count': prevLikes.likes + 1
        }),
    });
    const data = await response.json();
    revalidatePath('/like')
    return {likes: data.count + 1, active: true}
}


export async function globalSearch(query: { query: string | null; type: string | null }) {
    console.log(query);
    const like = await fetch(`http://127.0.0.1:8000/api/global?global=${query.query}&type=${query.type}`)
    return await like.json();
}