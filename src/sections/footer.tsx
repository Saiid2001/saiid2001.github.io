import React from 'react';


// SITEMAP HERE
const sitemap = {
    "saiid.ch": {
        path: "/",
        children: {

        }
}
}

type FooterProps = {
    currPath: string;
}

const Footer: React.FC<FooterProps> = ({ currPath }) => {
    return (
        <footer className="flex items-center w-full bg-secondary text-primary fixed bottom-0 left-0 right-0 py-1 px-10 z-50">
            <div>
                saiid.ch
            </div>
        </footer>
    );
}

export default Footer;