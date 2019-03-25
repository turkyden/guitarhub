import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = ({ data }) => (
  <Layout>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    <div>
      { 
        data.allMarkdownRemark.edges.map(song => 
          <h3 key={song.node.id} style={{ display: `flex`, justifyContent: `space-between` }}>
            <Link to={song.node.frontmatter.path}>{song.node.frontmatter.title} </Link>
            <span>{song.node.frontmatter.date}</span>
          </h3>
        )
      }
    </div>
  </Layout>
)

export const query = graphql`
  query {
    allMarkdownRemark {
      edges{
        node{
          id
          frontmatter{
            path
            title
            date
          }
        }
      }
    }
  }
`

export default IndexPage
