'use client';
import { useOptimistic, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { likePost } from "@/lib/action";

export default function LikeButton({ initialLikes }: { initialLikes: number }) {
    const [active, setActive] = useState(false);
    const [optimisticLikes, addOptimisticLike] = useOptimistic(
        { likes: initialLikes, active: false },
        (state, optimisticValue: number) => ({ likes: state.likes + optimisticValue,  active: optimisticValue > 0 })
    );

    const handleLike = async () => {
        try {
            addOptimisticLike(1);
           const res =  await likePost(optimisticLikes);
            setActive(res.active)
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <form action={handleLike}>
            <Button
                type="submit"
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
            >
                {
                    optimisticLikes.active || active ?  <Heart className="w-4 h-4 text-red-800" />:   <Heart className="w-4 h-4" />
                }
                Like ({optimisticLikes.likes})
            </Button>
        </form>
    );
}
