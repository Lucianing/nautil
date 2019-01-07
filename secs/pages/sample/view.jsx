import { View, Link } from 'nautil'
import Box from '../../components/box'
import SomeView from './some-view'

export default ({ model, detector }) => (
  <div id={ model.id }>
    <p>{ model.text }</p>
    <p><Link to={ "route.child?id=" + model.id } on-click={ detector.click }>click me to refresh content</Link></p>
    <p><input on-keyup={ e => detector.input(e) } value={ model.some } /></p>
    <ul>
      { model.cats.map(item => <li>{ item.name }'s color is { item.color }</li>) }
    </ul>
    { model.isShow ? <p>this will show.</p> : <p>this will not show.</p> }
    <p><a href="javascript:" on-click={ () => detector.toggle(isShow) }>toggle</a></p>
    <Box id={ model.id } on-toggle={ e => detector.click(e) }></Box>

    <View match={route => route.uri.indexOf('show-some') > -1}>
      <SomeView prop={true} />
    </View>
  </div>
)
