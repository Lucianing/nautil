import React, { Fragment } from '../../node_modules/react/umd/react.production.min.js'

export class Observer extends React.Component {
  static checkProps = {
    subscribe: Function,
  }

  constructor(props) {
    super(props)

    this.state = { ...props }

    const dispatch = () => {
      this.forceUpdate()
    }
    const { subscribe } = props

    subscribe(dispatch)
  }
  render() {
    return <Fragment>
      {React.Children.map(this.props.children, child => React.cloneElement(child))}
    </Fragment>
  }
}