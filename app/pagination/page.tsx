import React from 'react';
import HomeFilter from "@/app/filters/HomeFilter";
import {Card, CardContent} from "@/components/ui/card";
import Pagination from './Pagination'

async function Page({searchParams}) {
    const like = await fetch(`http://localhost:8000/api/posts?filter=${searchParams.filter || ''}&page=${searchParams.page || ''}`, {cache: 'no-store'})

    const data = await like.json();

    return (
        <div>
            <HomeFilter/>

            <Pagination pageNumber={searchParams?.page ? +searchParams.page : 1}
                        isNext={data.last_page != data.current_page}/>
            {
                data.data.map(({id, title}: { id: React.Key; title: string }) => (
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