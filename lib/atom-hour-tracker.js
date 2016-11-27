'use babel'

import { CompositeDisposable } from 'atom'

export default {

  subscriptions: null,

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

  insertDayStart() {
    const editor = atom.workspace.getActiveTextEditor()
    editor.insertText('TODO: new day')
  }

}
