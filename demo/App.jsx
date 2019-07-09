import { Component } from 'nautil'
import { Navigator, Provider, ObservableProvider, Section } from 'nautil/components'

import styles from './App.css'

import navigation from './navigation.js'
import depo from './depo.js'
import store from './store.js'

class App extends Component {
  render() {
    return (
      <Section stylesheet={styles.app}>
        <Section stylesheet={styles.container}>
          <ObservableProvider name="$store" value={store} subscribe={dispatch => store.watch('*', dispatch)} dispatch={this.update}>
            <Provider name="$depo" value={depo}>
              <Navigator navigation={navigation}></Navigator>
            </Provider>
          </ObservableProvider>
        </Section>
      </Section>
    )
  }
}

export default App