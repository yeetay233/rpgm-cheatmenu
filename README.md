<div align="center">

# Cheat Menu — RPG Maker MV/MZ

![Version](https://img.shields.io/badge/version-1.0.0-44cc55?style=flat-square)
![RPG Maker MV](https://img.shields.io/badge/RPG_Maker-MV-44cc55?style=flat-square)
![RPG Maker MZ](https://img.shields.io/badge/RPG_Maker-MZ-44cc55?style=flat-square)

**A feature-rich, in-game cheat menu plugin for RPG Maker MV and MZ.**

</div>

---

## Features

- **Full menu overlay** with sidebar navigation, searchable lists, and resizable window
- **Quick Action HUD** — floating one-click buttons for common cheats (heal, revive, full restore, etc.)
- **Hover toggle button** — configurable floating button to show/hide the menu
- **God Mode** — per-actor invincibility, infinite MP/TP
- **HP/MP/TP manipulation** — set or recover party and enemy vitals
- **Progression** — give EXP, edit stats, add gold
- **Inventory** — add items, weapons, and armor by searchable list
- **Movement** — speed multiplier and no-clip (walk through walls)
- **Teleport** — teleport to any map by searching a filterable list
- **Switches & Variables** — browse, search, and modify game switches/variables
- **Save & Recall** — save/load named snapshot states
- **Clear States** — remove all status ailments from selected actors
- **Configurable layout** — menu position, font size, scale, and sidebar grouping
- **Scroll buttons** — sticky scroll arrows for sidebar, lists, and content areas
- **Responsive** — works on desktop and mobile (JoiPlay)
- **Persistent settings** — cheat state saves with your game

---

## Installation

1. **Copy** the entire contents of the `cheat_menu/` folder into your game's root folder (where `Game.exe` is located).

2. **If you're on RPG Maker MV**, run `MVPluginPatcher.exe` inside your game folder — it will automatically register the plugin.
> Note: Just in case, for RPG Maker MV, backup your plugins.js file located in `www/js/`.

3. **Launch the game** and press **`1`** on your keyboard, or click the **star icon** (★) in the bottom-right corner of the screen to open the cheat menu.

> **Tip:** MZ projects auto-register plugins placed in `js/plugins/`. The `MVPluginPatcher.exe` is only needed for MV games.

---

## Usage

| Key | Action |
|-----|--------|
| `1` | Toggle cheat menu |
| `Mouse (star icon)` | Toggle cheat menu via floating button |

### Configuration

Open the **Interface** tab in the menu to adjust:

- **Menu Position** — Top-Left, Top-Right, Bottom-Left, Bottom-Right, Center
- **Font Size** — 8px–24px
- **Menu Scale** — 40%–100%
- **Hover Toggle Button** — enable/disable and position

### Quick HUD

Enable the Quick Action HUD from the **HUD Settings** page. Choose which buttons appear and where the HUD is positioned (Top, Bottom, Left, Right). The HUD is visible even when the menu is closed.

---

## Building from Source

```bash
git clone https://github.com/yeetay233/rpgm-cheatmenu
cd Cheat_Menu
node build.js
```

The build script combines all `src/` modules into both `cheat_menu/js/plugins/` (MZ) and `cheat_menu/www/js/plugins/` (MV).

### Project Structure

```
Cheat_Menu/
├── cheat_menu/          # Distribution folder — copy this into your game
│   ├── js/              #   MZ deployment path
│   │   └── plugins/
│   ├── www/             #   MV deployment path
│   │   └── js/plugins/
│   ├── MVPluginPatcher.exe
│   └── plugins_patch.txt
├── src/                 # Source modules
│   ├── cheats/
│   ├── core/
│   ├── input/
│   ├── menu/
│   │   └── pages/
│   ├── storage/
│   └── ui/
│       ├── builders/
│       ├── components/
│       └── styles/
├── build.js             # Build script
├── package.json
└── README.md
```

---

## Credits

- [emerladcoder / RPG Maker MV Cheat Menu Plugin](https://github.com/emerladcoder/rpg-maker-mv-cheat-menu-plugin) — original cheat menu for RPG Maker MV
- [NamelessMagician / RPG Maker MV-MZ Cheat Menu Plugin](https://github.com/NamelessMagician/RPG-Maker-MV-MZ-Cheat-Menu-Plugin) — continued development and MZ compatibility
- **yeetay233** — QoL improvements and UI overhauls

---

## Uninstall

1. Delete `js/plugins/Cheat_Menu.js` and `js/plugins/Cheat_Menu.css` from your game folder (and from `www/js/plugins/` if present).
2. Remove the `"Cheat_Menu"` entry from `www/js/plugins.js` (or restore your backup).

---

<div align="center">
  <sub>Built for the RPG Maker community with ❤︎</sub>
</div>
