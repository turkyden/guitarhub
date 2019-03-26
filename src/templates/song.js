import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import PlayBar from "../components/playBar.js"

export default function SongTemplate({ data }) {
  const { markdownRemark } = data;
  const { html } = markdownRemark;
  return (
    <Layout>
      <SEO title="guitar chords" />
      <PlayBar>
        <div className="blog-post-container">
          <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </PlayBar>
    </Layout>
  )
}

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
      }
    }
  }
`