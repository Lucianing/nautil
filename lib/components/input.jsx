import Component from '../core/component.js'
import { enumerate, ifexist } from '../types.js'
import { noop } from '../utils.js'

export class Input extends Component {
  static props = {
    type: enumerate([ 'text', 'number', 'email', 'tel', 'url' ]),
    placeholder: ifexist(String),
    value: enumerate([String, Number]),
  }
  static defaultProps = {
    type: 'text',

    onChange: noop,
    onFocus: noop,
    onBlur: noop,
    onSelect: noop,
  }
}
export default Input
