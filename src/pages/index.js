import React from "react"
import { Link } from "gatsby"
import Chord from "../components/rc-chord"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    <h1>This is my first page!</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    {/* 常用 Chord 图表，鼠标经过显示手势图 */}
    <div style={{ display: 'flex' }}>
      <Chord chordName="C"/>
      <Chord chordName="F"/>
    </div>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
    <Link to="/page-2/">Go to page 2</Link>
  </Layout>
)

export default IndexPage
