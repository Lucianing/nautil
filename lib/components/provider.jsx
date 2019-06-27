import React, { Fragment } from '../../node_modules/react/umd/react.production.min.js'
import { each, inObject } from '../core/utils.js'

function inject(children, injection) {
  return React.Children.map(children, (child) => {
    const Constructor = child.type

    if (!Constructor) {
      return React.cloneElement(child)
    }

    const { injectProps } = Constructor

    const attrs = {}
    if (injectProps) {
      each(injectProps, (value, key) => {
        if (!value) {
          return
        }
        if (inObject(key, injection)) {
          attrs[key] = injection[key]
        }
      })
    }

    const { children, ...props } = child.props
    const subChildren = inject(children, injection)
    return React.cloneElement(child, { ...attrs, ...props }, subChildren)
  })
}

export class Provider extends React.Component {
  render() {
    const { children, ...props } = this.props
    return <Fragment>
      {inject(children, props)}
    </Fragment>
  }
}