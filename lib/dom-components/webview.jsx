import Component from '../core/component.js'

export class Webview extends Component {
  render() {
    const { source, width, height, ...rest } = this.attrs
    const style = { ...this.style, width, height }
    const src = isString(source) ? source : source.uri
    return <iframe {...rest} src={src} style={style} className={this.className}></iframe>
  }
}
export default Webview
