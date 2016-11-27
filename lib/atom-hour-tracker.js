'use babel'

import { CompositeDisposable } from 'atom'

export default {

  subscriptions: null,
  days: ['Su', 'Ma', 'Ti', 'Ke', 'To', 'Pe', 'La'],

  activate() {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-text-editor[data-grammar="source hours txt"]', {
      'atom-hour-tracker:start-a-day': () => this.insertDayStart()
    }))
  },

  deactivate() {
    this.subscriptions.dispose()
  },

  zeroPad(number) {
    return number < 10 ? '0' + number : number
  },

  insertDayStart() {
    const editor = atom.workspace.getActiveTextEditor()
    const now = new Date()
    const dateString = `${this.days[now.getDay()]} ${now.getDate()}.${now.getMonth() + 1}`
    const hoursString = `${this.zeroPad(now.getHours())}.${this.zeroPad(now.getMinutes())} - xx.xx`
    editor.insertText(`${dateString}\n${hoursString}`)
  }

}
