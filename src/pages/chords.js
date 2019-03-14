import React from "react"
import Chord from "../components/rc-chord"
import Layout from "../components/layout"
import SEO from "../components/seo"
import CHORDS from "../components/rc-chord/chords.js"

const SecondPage = () => (
  <Layout>
    <SEO title="Page two" />
    <h2>Hi from the second page</h2>
    <p>There are just { CHORDS.length } chords in the world of guitar.</p>
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      { CHORDS.map(item => <Chord chordName={item.name}/> ) }
    </div>
  </Layout>
)

export default SecondPage
