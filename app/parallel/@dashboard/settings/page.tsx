import React from 'react';
import {delay} from "@/lib/delay";

async function Page() {
    await delay(5000)
    return (
        <div>settings</div>
    );
}

export default Page;