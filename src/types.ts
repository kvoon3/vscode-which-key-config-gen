export interface WhichKeyCommand {
  key: string
  name?: string
  type: 'command'
  command: string
}
export interface WhichKeyCommands {
  key: string
  name?: string
  type: 'commands'
  commands: string[]
}

export interface WhichKeyBinding {
  key: string
  name?: string
  type: 'bindings'
  bindings: WhichKeyItem[]
}

export type WhichKeyItem = WhichKeyBinding | WhichKeyCommand | WhichKeyCommands

export interface VimKeybinding {
  before: string[]
  commands: [string]
  // custom attr
  names?: string[]
}
