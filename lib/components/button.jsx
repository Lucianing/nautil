import { Component } from '../core/component.js'
import { noop } from '../core/utils.js'

export class Button extends Component {
  static defaultProps = {
    onHint: noop,
    onHintStart: noop,
    onHintEnd: noop,
  }
}
export default Button
