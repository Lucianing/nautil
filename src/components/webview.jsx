import Component from '../core/component'
import { enumerate } from '../core/types'
import { noop } from '../core/utils'

export class Webview extends Component {
  static checkProps = {
    source: enumerate(String, Object),
    width: Number,
    height: Number,

    onLoad: Function,
    onReload: Function,
    onResize: Function,
    onScroll: Function,
    onMessage: Function,
  }
  static defaultProps = {
    width: Infinity,
    height: Infinity,

    onLoad: noop,
    onReload: noop,
    onResize: noop,
    onScroll: noop,
    onMessage: noop,
  }
}
export default Webview
