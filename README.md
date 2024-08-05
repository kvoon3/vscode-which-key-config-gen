# vscode-which-key-config-gen

<a href="https://marketplace.visualstudio.com/items?itemName=kvoon.which-key-config-gen" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/v/antfu.ext-name.svg?color=eee&amp;label=VS%20Code%20Marketplace&logo=visual-studio-code" alt="Visual Studio Marketplace Version" /></a>

Generate vscode which-key config automatically according to your Vim keymap (your `leader` key)

## Why

1. I'm lazy to migration my vim-style keybinding to which-key-style bindings
2. which-key menu always popup when i typed my `leader` key,that was quite annoying. Specifically I still want to use `leader` like I was using Vim, I hope which-key shows up when i just forget some keybinding.

## Usage

1. Enable `vscode-whichkey-config=gen`
2. add a `names` field into your `vim.normalModeKeyBindingsNonRecursive` (generate which-key hint title)

For example:

```json
{
  "vim.normalModeKeyBindingsNonRecursive": [
    {
      "before": ["leader", "c", "n"],
      "names": ["Changes...", "Next Changes..."],
      "commands": ["workbench.action.editor.nextChange"]
    },
    {
      "before": ["leader", "c", "p"],
      "names": ["Changes...", "Previous Changes..."],
      "commands": ["workbench.action.editor.previousChange"]
    }
  ]
}
```

## Commands

| ID                               | Description             |
| -------------------------------- | ----------------------- |
| `whichKeyConfigGen.toggleEnable` | Toggle Enable Extension |
| `whichKeyConfigGen.show`         | Show menu               |
| `whichKeyConfigGen.updateConfig` | Update Generated Config |

## Configuration

| Key                          | Description                                      |
| ---------------------------- | ------------------------------------------------ |
| `whichKeyConfigGen.enable`   | Enable Extension                                 |
| `whichKeyConfigGen.bindings` | Generated keybindings (Don't modify it manually) |

## License

[MIT](./LICENSE) License © 2024 [Kevin Kwong](https://github.com/kvoon3)
