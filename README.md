# vscode-which-key-config-gen

<a href="https://marketplace.visualstudio.com/items?itemName=kvoon.which-key-config-gen" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/v/antfu.ext-name.svg?color=eee&amp;label=VS%20Code%20Marketplace&logo=visual-studio-code" alt="Visual Studio Marketplace Version" /></a>

Generate vscode which-key config automatically according to your Vim keymap (your `leader` key)

## Why

1. I'm too lazy to migration my vim-style keybinding to which-key-style bindings
2. I still want to use `leader` key in VSCodeVim, and the which-key menu always popup when i type `leader` key, which is quite annoying. I hope which-key only shows up when i just forget some keybinding.

## Usage

1. enable `vscode-whichkey-config-gen`
2. add a `names` field to your `vim.normalModeKeyBindingsNonRecursive` (generate which-key hint title)
3. replace the keymap `whichkey.show` with `whichKeyConfigGen.show`

```json
{
  "vim.normalModeKeyBindingsNonRecursive": [
    {
      // I prefer use leader twice to avoid overlap with Vim keymap, and you can still use one leader
      "before": ["leader", "leader"],
      "commands": ["whichKeyConfigGen.show"]
    },
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
