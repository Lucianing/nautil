import Component from '../core/component.js'

export class Textarea extends Component {
  render() {
    const { line, placeholder, value, ...rest } = this.attrs
    const { $value } = this.props

    const onChange = (e) => {
      if ($value) {
        const value = e.target.value
        this.attrs.value = value
      }
      this.onChange$.next(e)
    }

    return <textarea
      {...rest}

      placeholder={placeholder}
      row={line}
      value={value}

      onChange={onChange}
      onFocus={e => this.onFocus$.next(e)}
      onBlur={e => this.onBlur$.next(e)}
      onSelect={e => this.onSelect$.next(e)}

      className={this.className}
      style={this.style}
    ></textarea>
  }
}
export default Textarea
