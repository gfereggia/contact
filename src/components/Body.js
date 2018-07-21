import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Container, Row } from 'reactstrap'
class Body extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }
  render() {
    return (
      <Container>
        <Row>{this.props.children}</Row>
      </Container>
    )
  }
}

Body.defaultProps = {}

Body.propTypes = {
  children: PropTypes.any
}

export default Body
