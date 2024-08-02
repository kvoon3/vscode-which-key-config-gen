export interface WhichKeyCommand {
  key: string
  name?: string
  type: 'command'
  command: string
}

export interface WhichKeyBinding {
  key: string
  name?: string
  type: 'bindings'
  bindings: WhichKeyItem[]
}

export type WhichKeyItem = WhichKeyBinding | WhichKeyCommand

export interface VimKeybinding {
  before: string[]
  commands: [string]
}
