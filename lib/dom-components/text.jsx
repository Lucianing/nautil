import { Component } from '../core/component.js'

export class Text extends Component {
  render() {
    const isTouchable = ('ontouchmove' in document)
    return <span
      onClick={e => this.onHint$.next(e)}

      onMouseDown={e => !isTouchable &&this.onHintStart$.next(e)}
      onMouseMove={e => !isTouchable &&this.onHintMove$.next(e)}
      onMouseUp={e => !isTouchable &&this.onHintEnd$.next(e)}

      onTouchStart={e => isTouchable &&this.onHintStart$.next(e)}
      onTouchMove={e => isTouchable && this.onHintMove$.next(e)}
      onTouchEnd={e => isTouchable && this.onHintEnd$.next(e)}
      onTouchCancel={e => isTouchable && this.onHintCancel$.next(e)}

      className={this.className}
      style={this.style}

      {...this.attrs}
    >{this.children}</span>
  }
}
export default Text
