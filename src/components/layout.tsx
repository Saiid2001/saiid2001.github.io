import * as React from "react"
import type { PageProps } from "gatsby"
import Header from "./header"


const Layout: React.FC<PageProps> = (props) => {
    return (
        <main >
            <Header />
            <div>
                {props.children}
            </div>
            <script src="./node_modules/preline/dist/preline.js"></script>
        </main>
    )
    }

export default Layout