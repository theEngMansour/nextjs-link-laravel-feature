import React from 'react';

function Layout({children, modal}: { children: React.ReactNode, modal: React.ReactNode }) {
    return (
        <div className='p-2'>
            {children}
            {modal}
        </div>
    );
}

export default Layout;