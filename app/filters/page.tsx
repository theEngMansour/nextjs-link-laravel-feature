import React from 'react';
import HomeFilter from "@/app/filters/HomeFilter";
import {Card, CardContent} from "@/components/ui/card";
import Filter from "@/app/filters/Filter";
import {HomePageFilters} from './filters';

async function Page({searchParams}) {
    const like = await fetch(`http://localhost:8000/api/posts?filter=${searchParams.filter || ''}`)
    const data = await like.json();
    return (
        <div>
            <HomeFilter/>
            <Filter
                filters={HomePageFilters}
                otherClasses="min-h-[56px] sm:min-w-[170px]"
                containerClasses=" max-md:flex"
            />
            {
                data.map(({id, title}: { id: React.Key; title: string }) => (
                    <Card key={id} className="row max-w-md">
                        <CardContent>
                            <p>{title}</p>
                        </CardContent>
                    </Card>
                ))
            }
        </div>
    );
}

export default Page;