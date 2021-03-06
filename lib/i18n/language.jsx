import Component from '../core/component.js'
import I18n from './i18n.js'
import { Text } from '../components'
import { Observer } from '../core-components/index.js'
import { isFunction, mapChildren, cloneElement, filterChildren } from '../utils.js'
import { ifexist } from '../types.js'
import { pollute } from '../operators/operators.js'
import { pipe } from '../operators/combiners.js'


export class T extends Component {
  static props = {
    i18n: I18n,
  }

  render() {
    const { i18n, t, s, ...rest } = this.attrs
    const children = this.children
    const namespace = s ? s + ':' : ''

    let text
    if (isFunction(t)) {
      text = t(i18n)
    }
    else if (i18n.has(namespace + t)) {
      text = i18n.t(namespace + t)
    }
    else if (isFunction(children)) {
      text = children(i18n)
    }
    else if (i18n.has(namespace + children)) {
      text = i18n.t(namespace + children)
    }
    else {
      text = children
    }

    return (
      <Text stylesheet={[this.style, this.className]} {...rest}>{text}</Text>
    )
  }
}

export class Locale extends Component {
  static props = {
    i18n: I18n,
    to: String,
  }

  render() {
    const { i18n, to, component, ...rest } = this.attrs
    const children = this.children

    const change = () => {
      i18n.setLang(to)
    }

    const nodes = filterChildren(children)
    if (component || nodes.length > 1) {
      const C = component || Section
      return <C {...rest} onHint={change}>{nodes}</C>
    }
    else {
      return mapChildren(children, (child) => {
        if (child.type) {
          return cloneElement(child, { onHint: change })
        }
        else {
          return <Text {...rest} onHint={change}>{child}</Text>
        }
      })
    }
  }
}

class _Language extends Component {
  static props = {
    i18n: I18n,
    dispatch: ifexist(Function),
  }

  render() {
    const { i18n, dispatch } = this.attrs
    const update = dispatch ? dispatch : this.update
    const children = this.children

    return (
      <Observer
        subscribe={dispatch => i18n.on('initialized', dispatch).on('loaded', dispatch).on('languageChanged', dispatch)}
        unsubscribe={dispatch => i18n.off('initialized', dispatch).off('loaded', dispatch).off('languageChanged', dispatch)}
        dispatch={update}
      >
        {isFunction(children) ? children(i18n) : children}
      </Observer>
    )
  }
}

export const Language = pipe([
  pollute(T, ({ i18n }) => ({ i18n })),
  pollute(Locale, ({ i18n }) => ({ i18n })),
])(_Language)

export default Language
