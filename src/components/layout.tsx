import * as React from "react"
import type { PageProps } from "gatsby"
import Header from "./header"


type LayoutProps =  {
    children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = (props) => {

    // get default system theme
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

    // get theme from local storage
    const localTheme = localStorage.getItem("theme")

    const [theme, setTheme] = React.useState(localTheme || systemTheme || "light")

    React.useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme)
    }, [theme])

    return (
        <main>
            <Header theme={theme} onToggleTheme={setTheme}/>
            <div>
                {props.children}
            </div>
            <script src="./node_modules/preline/dist/preline.js"></script>
        </main>
    )
    }

export default Layout