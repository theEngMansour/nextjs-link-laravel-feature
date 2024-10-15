"use client"
import {usePathname, useRouter, useSearchParams} from 'next/navigation'

import {Input} from "@/components/ui/input";
import {useEffect, useState} from "react";
import {formUrlQuery, removeKeysFromQuery} from "@/lib/search.action";

function Search({route}: { route: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [search, setSearch] = useState(query || '');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search) {
                const newUrl = formUrlQuery({
                    params: searchParams.toString(),
                    key: 'q',
                    value: search
                })
                router.push(newUrl, {scroll: false});
            } else {
                if (pathname === route) {
                    const newUrl = removeKeysFromQuery({
                        params: searchParams.toString(),
                        keysToRemove: ['q']
                    })
                    router.push(newUrl, {scroll: false});
                }

            }
        }, 300);

        return () => clearTimeout(delayDebounceFn)
    }, [search, route, pathname, router, searchParams, query])


    return (
        <div>
            <Input name='search' placeholder='Search' value={search} onChange={(e) => setSearch(e.target.value)}/>
        </div>
    );
}

export default Search;