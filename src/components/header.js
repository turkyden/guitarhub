import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import Headroom from "react-headroom"

const Header = ({ siteTitle }) => (
  <Headroom>
    <header
      style={{
        background: `rgba(47,47,47,0.98)`,
        marginBottom: `1.45rem`,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: `0 auto`,
          maxWidth: 960,
          padding: `1.45rem 1.0875rem`,
        }}
      >
        <h1 style={{ margin: 0 }}>
          <Link
            to="/"
            style={{
              color: `white`,
              textDecoration: `none`,
            }}
          >
            {siteTitle}
          </Link>
        </h1>
        <div>
          <div style={{ display: `flex`, justifyContent: `space-around`, lineHeight: `2.1`, width: 300, }}>
            <Link to="/chords/" style={{ color: `#fff` }}>Chords</Link>
            <Link to="/songs/" style={{ color: `#fff` }}>Songs</Link>
          </div>
        </div>
      </div>
    </header>
  </Headroom>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
