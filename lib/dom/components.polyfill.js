import { Navigate } from '../core-components/index.js'
import { attachPrototype } from '../utils.js'

attachPrototype(Navigate, {
  _wrapLink(child, go, navigation, to, params, open) {
    const { options } = navigation
    const { base = '/' } = options
    const state = navigation.makeState(to, params)

    let href = ''
    if (!state) {
      href = '#!'
    }
    else {
      const { url } = state
      href = base === '/' ? url : base + url
    }
    return <a href={href} onClick={e => (go(), e.preventDefault(), false)} target={open ? '_blank' : undefined}>{child}</a>
  },
})
