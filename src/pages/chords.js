import React from "react"
import { graphql } from 'gatsby'
import Chord from "../components/rc-chord"
import Layout from "../components/layout"
import SEO from "../components/seo"

const SecondPage = ({data}) => (
  <Layout>
    <SEO title="guitar chords" />
    <h2>Hi from the second page</h2>
    <p>There are just chords in the world of guitar.</p>
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      { data.allChordsJson.edges.map(chord => <Chord chordName={chord.node.name}/> ) }
    </div>
  </Layout>
)

export const query = graphql`
  query {
    allChordsJson {
      edges {
        node {
          name
        }
      }
    }
  }
`

export default SecondPage
