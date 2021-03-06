import Component from '../core/component.js'
import { Any, list, ifexist } from '../types.js'
import { noop } from '../utils.js'

export class Select extends Component {
  static props = {
    value: Any,
    options: list([{
      text: String,
      value: Any,
      disabled: ifexist(Boolean),
    }]),
    placeholder: ifexist(String),
  }
  static defaultProps = {
    onChange: noop,
  }
}
export default Select
