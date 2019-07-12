/**
 * form
 */

import { Component, Model } from 'nautil'
import { Section, Input, Button  } from 'nautil/components'

class FormModel extends Model {
  schema() {
    return {
      name: {
        type: String,
        default: '',
      },
      age: {
        type: Number,
        default: 0,
        validators: [
          {
            validate: v => v <= 12,
            message: 'age should not bigger than 12!',
          },
        ],
        setter: v => +v,
      },
    }
  }
}

export class Page5 extends Component {
  static injectProviders = {
    $depo: true,
    $navigation: true,
    $toast: true, // fake
  }

  async onInit() {
    this.form = new FormModel()
    this.form.watch('*', this.update)

    // edit, request data from backend api
    const { id } = this.$navigation.state.params
    if (id) {
      this.$toast.loading('loading data...')
      const data = await this.$depo.request('person', { id })
      this.form.restore(data)
      this.$toast.hide()
    }
  }

  submit = this.submit.bind(this)
  async submit() {
    const error = this.form.validate()
    if (error) {
      this.$toast.warn('fix errors first!')
      return
    }

    const data = this.form.formdata()
    this.$toast.loading('saving data...')
    await this.$depo.save('person', { id }, data)
    this.$toast.hide()
  }

  render() {
    return <Section>
      <Section>
        <Section><Input placeholder="Name" value={this.form.get('name')} onChange={e => this.form.set('name', e.target.value)} /></Section>
        <Section>{this.form.message('name')}</Section>
      </Section>
      <Section>
        <Section><Input type="number" placeholder="Age" value={this.form.get('age')} onChange={e => this.form.set('age', e.target.value)} /></Section>
        <Section>{this.form.message('age')}</Section>
      </Section>
      <Section>
        <Button onClick={this.submit}>Submit</Button>
      </Section>
    </Section>
  }
}