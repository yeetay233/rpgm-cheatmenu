// ============================================================
// Cheat Menu Build Script
// Simple concatenation of src/ modules into dist/ output files
// ============================================================

var fs = require('fs');
var path = require('path');

var srcDir = path.join(__dirname, 'src');

// Output directories (MV and MZ deployment paths)
var distDirs = [
    path.join(__dirname, 'cheat_menu', 'js', 'plugins'),
    path.join(__dirname, 'cheat_menu', 'www', 'js', 'plugins')
];

// Ensure dist directories exist
distDirs.forEach(function (d) {
    if (!fs.existsSync(d)) {
        fs.mkdirSync(d, { recursive: true });
    }
});

// Module load order (dependencies first)
var modules = [
    // Core
    'core/state.js',
    'core/constants.js',

    // Cheats
    'cheats/combat.js',
    'cheats/progression.js',
    'cheats/inventory.js',
    'cheats/movement.js',
    'cheats/system.js',
    'cheats/savestate.js',

    // UI Components
    'ui/components/overlay.js',
    'ui/components/modal.js',
    'ui/components/searchList.js',
    'ui/components/hud.js',
    'ui/components/hoverButton.js',
    'ui/components/scrollButtons.js',

    // UI Builders
    'ui/builders/rows.js',
    'ui/builders/settings.js',

    // Menu Pages
    'menu/pages/sharedHandlers.js',
    'menu/pages/combatVitals.js',
    'menu/pages/godMode.js',
    'menu/pages/progression.js',

    'menu/pages/speed.js',
    'menu/pages/items.js',
    'menu/pages/weapons.js',
    'menu/pages/armors.js',
    'menu/pages/variables.js',
    'menu/pages/switches.js',
    'menu/pages/saveRecall.js',
    'menu/pages/saves.js',
    'menu/pages/teleport.js',
    'menu/pages/clearStates.js',
    'menu/pages/general.js',

    // Menu System
    'menu/registry.js',
    'menu/renderer.js',

    // Input
    'input/keyboard.js',

    // Init (last - hooks into game engine)
    'core/init.js'
];

// Builder header
var header = '// ============================================================\n' +
    '// Cheat Menu Plugin - RPG Maker MV/MZ\n' +
    '// Built from src/ modules\n' +
    '// ============================================================\n\n';

console.log('Building Cheat_Menu.js...');

var output = header;

// Concatenate JS modules
for (var i = 0; i < modules.length; i++) {
    var filePath = path.join(srcDir, modules[i]);
    if (!fs.existsSync(filePath)) {
        console.error('WARNING: Module not found: ' + filePath);
        continue;
    }
    var content = fs.readFileSync(filePath, 'utf8');
    output += '// Source: ' + modules[i] + '\n';
    output += content;
    output += '\n\n';
}

// Write JS and CSS to each output directory
var cssSrcPath = path.join(srcDir, 'ui', 'styles', 'index.css');

distDirs.forEach(function (distDir) {
    var jsOutPath = path.join(distDir, 'Cheat_Menu.js');
    fs.writeFileSync(jsOutPath, output, 'utf8');
    console.log('Wrote ' + jsOutPath + ' (' + output.length + ' bytes)');

    var cssOutPath = path.join(distDir, 'Cheat_Menu.css');
    if (fs.existsSync(cssSrcPath)) {
        var cssContent = fs.readFileSync(cssSrcPath, 'utf8');
        fs.writeFileSync(cssOutPath, cssContent, 'utf8');
        console.log('Wrote ' + cssOutPath + ' (' + cssContent.length + ' bytes)');
    } else {
        console.error('WARNING: CSS source not found: ' + cssSrcPath);
    }
});

console.log('Build complete.');