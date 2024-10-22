import React, {useEffect, useState} from 'react';
import {useSearchParams} from "next/navigation";
import Link from "next/link";
import {ReloadIcon} from "@radix-ui/react-icons"
import GlobalFilters from './GlobalFilters'
import {globalSearch} from "@/lib/action";

function GlobalResult() {
    const searchParams = useSearchParams();

    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState([
        {
            type: null,
            data: []
        }
    ]);

    const global = searchParams.get('global');
    const type = searchParams.get("type");

    useEffect(() => {
        const fetchResult = async () => {
            setResult([]);
            setIsLoading(true);

            try {
                const res = await globalSearch({query: global, type})
                setResult(res);
            } catch (error) {
                console.error(error);
                throw error;
            } finally {
                setIsLoading(false);
            }
        }

        if (global) {
            fetchResult().then();
        }
    }, [global, type])

    const renderLink = (type: string, id: string) => {
        switch (type) {
            case 'question':
                return `/question/${id}`;
            case 'answer':
                return `/question/${id}`;
            case 'user':
                return `/profile/${id}`;
            case 'tag':
                return `/tags/${id}`;
            default:
                return '/'
        }
    }


    return (
        <div className="absolute top-full z-10 mt-3 w-full rounded-xl bg-gray-200 py-5 shadow-sm dark:bg-dark-400">
            <GlobalFilters/>
            <div className="my-5 h-[1px] bg-light-700/50 dark:bg-dark-500/50"/>

            <div className="space-y-5">
                <p className="text-dark400_light900 paragraph-semibold px-5">
                    Top Match
                </p>

                {isLoading ? (
                    <div className="flex-center flex-col px-5">
                        <ReloadIcon className="my-2 h-10 w-10 animate-spin text-primary-500"/>
                        <p className="text-dark200_light800 body-regular">Browsing the entire database</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <div>
                            {
                                JSON.stringify(result)
                            }
                        </div>
                        {/* {result.length > 0 ? (
                            result?.data?.map((item: any, index: number) => (
                                <Link
                                    href={renderLink(item.type, item.id)}
                                    key={item.type + item.id + index}
                                    className="flex w-full cursor-pointer items-start gap-3 px-5 py-2.5 hover:bg-light-700/50 dark:bg-dark-500/50"
                                >
                                    <div className='flex flex-col'>
                                        <p className="body-medium text-dark200_light800 line-clamp-1">{item.title}</p>
                                        <p className="text-light400_light500 small-medium mt-1 font-bold capitalize">{item.type}</p>
                                    </div>
                                </Link>
                            ))*/}
                        ) : (
                        <div className="flex-center flex-col px-5">
                            <p className="text-dark200_light800 body-regular px-5 py-2.5">Oops, no results found</p>
                        </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default GlobalResult;