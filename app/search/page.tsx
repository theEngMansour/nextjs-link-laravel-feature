import Search from "@/app/search/Search";
import {Card, CardContent} from "@/components/ui/card";

async function Page({searchParams}) {
    const like = await fetch(`http://localhost:8000/api/posts?q=${searchParams.q || ''}`)
    const data = await like.json();
    return (
        <div>
            <Search route='/search'/>
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