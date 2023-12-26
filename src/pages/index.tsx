import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun } from '@fortawesome/free-solid-svg-icons'
import Header from "../components/header"
import Layout from "../components/layout"


const IndexPage: React.FC<PageProps> = (props) => {
  return (
    <Layout {...props}>

    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Saiid El Hajj Chehade</title>
