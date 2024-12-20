"use client"
import React, {useEffect, useRef, useState} from 'react';
import {Input} from "@/components/ui/input";
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import GlobalResult from './GlobalResult';
import {formUrlQuery, removeKeysFromQuery} from "@/lib/search.action";

function GlobalSearch() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const searchContainerRef = useRef(null)
    const query = searchParams.get('q');
    const [search, setSearch] = useState(query || '');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleOutsideClick = (event: any) => {
            if (searchContainerRef.current &&
                // @ts-ignore
                !searchContainerRef.current.contains(event.target)
            ) {
                setIsOpen(false);
                setSearch('')
            }
        }

        setIsOpen(false);

        document.addEventListener("click", handleOutsideClick);

        return () => {
            document.removeEventListener("click", handleOutsideClick)
        }
    }, [pathname])

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search) {
                const newUrl = formUrlQuery({
                    params: searchParams.toString(),
                    key: 'global',
                    value: search
                })

                router.push(newUrl, {scroll: false});
            } else {
                if (query) {
                    const newUrl = removeKeysFromQuery({
                        params: searchParams.toString(),
                        keysToRemove: ['global', 'type']
                    })

                    router.push(newUrl, {scroll: false});
                }

            }
        }, 300);

        return () => clearTimeout(delayDebounceFn)
    }, [search, router, pathname, searchParams, query])


    return (
        <div className="relative w-full max-w-[600px] max-lg:hidden m-4" ref={searchContainerRef}>
            <div
                className="bg-gray-300 relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4">
                <Input
                    type="text"
                    placeholder="Search globally"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);

                        if (!isOpen) setIsOpen(true);
                        if (e.target.value === '' && isOpen) setIsOpen(false);
                    }}
                    className="paragraph-regular outline-0 no-focus placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none"
                />
            </div>
            {isOpen && <GlobalResult/>}
        </div>
    )
        ;
}

export default GlobalSearch;