<h1 align="center">Which Key Config Gen<sup>VS Code</sup></h1>

<p align="center">
<a href="https://marketplace.visualstudio.com/items?itemName=kvoon.which-key-config-gen" target="__blank"><img alt="Visual Studio Marketplace Version" src="https://img.shields.io/visual-studio-marketplace/v/kvoon.which-key-config-gen?label=VS%20Code%20Marketplace&color=eee"></a>
<a href="https://kermanx.github.io/reactive-vscode/" target="__blank"><img src="https://img.shields.io/badge/made_with-reactive--vscode-%23eee?style=flat"  alt="Made with reactive-vscode" /></a>
</p>

<p align="center">
Generate vscode which-key config automatically
</p>

## Usage

1. enable `vscode-whichkey-config-gen`
2. add a `names` field to your vim keybinding (for generate which-key hint title)
3. replace the keymap `whichkey.show` with `whichKeyConfigGen.show`

And then simply remove your old which-key configs

```diff
{
- "whichkey.bindings": [
-   {
-     "key": "c",
-     "type": "bindings",
-     "name": "Go to Change...",
-     "bindings": [
-       {
-         "key": "n",
-         "name": "Next Changes",
-         "type": "command",
-         "command": "workbench.action.editor.nextChange"
-       },
-       {
-         "key": "p",
-         "name": "Previous Changes",
-         "type": "command",
-         "command": "workbench.action.editor.previousChange"
-       }
-     ]
-   }
- ],
  "vim.normalModeKeyBindings": [
    {
      // I prefer use leader twice to avoid overlap with Vim keymap, and you can still use one leader
      "before": ["leader", "leader"],
      "commands": ["whichKeyConfigGen.show"]
    },
    {
      "before": ["leader", "c", "n"],
+     "names": ["Go to Change...", "Next Change"],
      "commands": ["workbench.action.editor.nextChange"]
    },
    {
      "before": ["leader", "c", "p"],
+     "names": ["Go to Change...", "Previous Change"],
      "commands": ["workbench.action.editor.previousChange"]
    }
  ]
}
```

## Commands

<!-- commands -->

| Command                          | Title                                     |
| -------------------------------- | ----------------------------------------- |
| `whichKeyConfigGen.show`         | Which Key Config Generator: Show Menu     |
| `whichKeyConfigGen.toggleEnable` | Which Key Config Generator: Toggle Enable |

<!-- commands -->

## Configurations

<!-- configs -->

| Key                        | Description                       | Type      | Default |
| -------------------------- | --------------------------------- | --------- | ------- |
| `whichKeyConfigGen.enable` | Enable which-key config generator | `boolean` | `true`  |

<!-- configs -->

## License

[MIT](./LICENSE) License © 2024 [Kevin Kwong](https://github.com/kvoon3)
