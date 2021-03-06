import Component from '../core/component.js'
import { noop } from '../utils.js'

export class Checkbox extends Component {
  static props = {
    checked: Boolean,
  }
  static defaultProps = {
    checked: false,

    onCheck: noop,
    onUncheck: noop,
  }
}
export default Checkbox
