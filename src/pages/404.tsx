import * as React from "react"
import { Link, HeadFC, PageProps } from "gatsby"
import Layout from "../sections/layout"
import { NavigationLink } from "../components/navigation"

const pageStyles = {
  color: "#232129",
  padding: "96px",
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
}
const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 320,
}

const paragraphStyles = {
  marginBottom: 48,
}
const codeStyles = {
  color: "#8A6534",
  padding: 4,
  backgroundColor: "#FFF4DB",
  fontSize: "1.25rem",
  borderRadius: 4,
}

const NotFoundPage: React.FC<PageProps> = (props) => {
  return (
    <Layout {...props}>
    <main className="flex flex-col items-center justify-center w-full h-full mt-32 px-8">
      <h1 className="text-center text-3xl font-mono text-secondary font-bold mb-8">Page not found</h1>
      <p style={paragraphStyles}>
        Sorry 😔, we couldn’t find what you were looking for.
        <br />


        {process.env.NODE_ENV === "development" ? (
          <>
            <br />
            Try creating a page in <code style={codeStyles}>src/pages/</code>.
            <br />
          </>
        ) : null}
        <br />
        <NavigationLink to="/">Go home</NavigationLink>
      </p>
    </main>
    </Layout>
  )
}

export default NotFoundPage

export const Head: HeadFC = () => <title>Not found</title>
