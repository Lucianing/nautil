import Component from '../core/component.js'
import Navigation from '../core/navigation.js'
import Observer from './observer.jsx'
import React from 'react'
import { enumerate, ifexist, Any } from '../types.js'
import { isNumber, cloneElement, mapChildren, filterChildren, isFunction, isObject, isInstanceOf } from '../utils.js'
import { Text, Section } from '../components'
import { pollute } from '../operators/operators.js'
import { pipe } from '../operators/combiners.js'

export class Route extends Component {
  static props = {
    navigation: Navigation,
    match: Any,
    exact: ifexist(Boolean),
    animation: ifexist(Number),
  }

  constructor(props) {
    super(props)
    this.state = {
      show: false,
      display: false,
    }
    this._isMounted = false
  }

  toggle() {
    const { navigation, match, exact, animation } = this.attrs
    const matched = navigation.is(match, exact)
    const { show, display } = this.state
    if (animation) {
      if (matched && !display) {
        clearTimeout(this._timer)
        this.setState({ display: true, show: false })
        this._timer = setTimeout(() => this.setState({ show: true }), 10)
      }
      else if (!matched && show) {
        clearTimeout(this._timer)
        this.setState({ show: false })
        this._timer = setTimeout(() => this.setState({ display: false }), animation)
      }
    }
    else {
      if (matched && !display) {
        this.setState({ display: true, show: true })
      }
      else if (!matched && show) {
        this.setState({ display: false, show: false })
      }
    }
  }
  onMounted() {
    this._isMounted = true
    this.toggle()
  }
  onUpdated() {
    this.toggle()
  }
  onUnmount() {
    this._isMounted = false
    clearTimeout(this._timer)
  }

  render() {
    const { navigation, component, props = {}, match, exact } = this.attrs
    const { show, display } = this.state
    const matched = navigation.is(match, exact)

    // in SSR, the first time render should not use sync-render
    if (this._isMounted) {
      if (!display) {
        return null
      }
    }
    else if (!matched) {
      return null
    }

    const children = filterChildren(this.children)
    if (component) {
      const RouteComponent = component
      return <RouteComponent show={show} {...props}>{children}</RouteComponent>
    }
    else if (isFunction(this.children)) {
      return this.children({ navigation, show })
    }
    else if (children.length) {
      return children
    }
    else {
      const { route } = navigation.state
      const { component: RouteComponent, props = {} } = route
      return RouteComponent ? <RouteComponent navigation={navigation} show={show} {...props} /> : null
    }
  }
}

export class Navigate extends Component {
  static props = {
    navigation: Navigation,
    to: enumerate([String, Number]),
    params: Object,
    replace: Boolean,
    open: Boolean,
  }
  static defaultProps = {
    params: {},
    replace: false,
    open: false,
  }

  _wrapLink(child, go) {
    return <Text onHint={go}>{child}</Text>
  }

  render() {
    const { to, params, replace, open, navigation, component, props = {} } = this.attrs
    const { children } = this

    const go = () => {
      if (isNumber(to) && to < 0) {
        navigation.back(to)
      }
      else if (open) {
        navigation.open(to, params)
      }
      else {
        navigation.go(to, params, replace)
      }
    }

    const nodes = filterChildren(children)
    if (component || nodes.length > 1) {
      const C = component || Section
      return <C {...props} onHint={go}>{nodes}</C>
    }
    else {
      return mapChildren(nodes, (child) => {
        if (child.type) {
          return cloneElement(child, { onHint: go })
        }
        else {
          return this._wrapLink(child, go, navigation, to, params, open)
        }
      })
    }
  }
}

/**
 * @example use children
 * <Navigator navigation={navigation} dispatch={this.update}>
 *   <Route match="home" component={Home} props={{ title: 'Home Page' }} />
 *   <Route match="page1" component={Page1} props={{ title: 'Page1' }} />
 * </Navigator>
 *
 * @example I use Route directly previously, in fact, Route can be use anywhere inside Navigator
 * <Navigator navigation={navigation} dispatch={this.update}>
 *   <Page1 title="Page1" />
 * </Navigator>
 *
 * @example use components inside navigation
 * <Navigator navigation={navigation} inside />
 */
class _Navigator extends Component {
  static props = {
    navigation: Navigation,
    dispatch: ifexist(Function),

    // whether to use components inside navigation instance,
    // if false, will use children Route, dispatch should be set
    inside: ifexist(Boolean),
  }

  render() {
    const { navigation, dispatch, inside } = this.attrs
    const { options } = navigation

    const createRoutes = () => {
      const { notFound, routes } = options
      const views = routes.map((route) => {
        const { component, props = {}, animation = 0, name } = route
        return component ? <Route key={name} component={component} match={name} navigation={navigation} animation={animation} {...props} /> : null
      })
      if (notFound) {
        if (isObject(notFound) && notFound.component) {
          const { component, props = {}, animation = 0 } = notFound
          const not = <Route key="!" match="!" component={component} navigation={navigation} animation={animation} {...props} />
          views.push(not)
        }
        else if (isInstanceOf(notFound, Component) || isFunction(notFound)) {
          const not = <Route key="!" match="!" component={notFound} navigation={navigation} />
          views.push(not)
        }
      }
      return views
    }

    const children = this.children
    const update = dispatch ? dispatch : this.update

    let layout = null
    if (inside) {
      const views = createRoutes()
      layout = views
    }
    else if (isFunction(children)) {
      layout = children(navigation)
    }
    else {
      layout = children
    }

    return (
      <Observer subscribe={dispatch => navigation.on('*', dispatch)} unsubscribe={dispatch => navigation.off('*', dispatch)} dispatch={update}>
        {layout}
      </Observer>
    )
  }
}

export const Navigator = pipe([
  pollute(Route, ({ navigation }) => ({ navigation })),
  pollute(Navigate, ({ navigation }) => ({ navigation })),
])(_Navigator)

export default Navigator
