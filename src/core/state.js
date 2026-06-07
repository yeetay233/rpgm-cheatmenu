// ============================================================
// Cheat Menu - State Management
// ============================================================

// Initialize namespace
if (typeof Cheat_Menu === "undefined") {
    Cheat_Menu = {};
}

// Core state
Cheat_Menu.initialized = false;
Cheat_Menu.cheat_menu_open = false;
Cheat_Menu.overlay_openable = false;
Cheat_Menu.position = 0;
Cheat_Menu.menu_update_timer = null;

Cheat_Menu.cheat_selected = 0;
Cheat_Menu.cheat_selected_actor = 1;
Cheat_Menu.amount_index = 0;
Cheat_Menu.stat_selection = 0;
Cheat_Menu.item_selection = 1;
Cheat_Menu.weapon_selection = 1;
Cheat_Menu.armor_selection = 1;
Cheat_Menu.move_amount_index = 1;
Cheat_Menu.variable_selection = 1;
Cheat_Menu.switch_selection = 1;

Cheat_Menu.pinned_items = [];
Cheat_Menu.pinned_weapons = [];
Cheat_Menu.pinned_armors = [];
Cheat_Menu.pinned_variables = [];
Cheat_Menu.pinned_switches = [];

Cheat_Menu.saved_positions = [{ m: -1, x: -1, y: -1 }, { m: -1, x: -1, y: -1 }, { m: -1, x: -1, y: -1 }];
Cheat_Menu.teleport_location = { m: 1, x: 0, y: 0 };

Cheat_Menu.speed = null;
Cheat_Menu.speed_unlocked = true;
Cheat_Menu.speed_initialized = false;

// UI state
Cheat_Menu.fontSize = 14;
Cheat_Menu.menu_scale = 75;
Cheat_Menu.btn_config = { ...Cheat_Menu.default_btn_config };
Cheat_Menu.hud_config = { ...Cheat_Menu.default_hud_config };

// Menu registry
Cheat_Menu.menus = [];
Cheat_Menu.menu_names = [];
Cheat_Menu._menus_grouped = false;
Cheat_Menu.sub_tab_per_group = {};
Cheat_Menu.list_state = { search: "", scroll: 0 };

// Key listeners
Cheat_Menu.key_listeners = {};

// DOM elements (initialized in overlay.js)
Cheat_Menu.overlay_box = null;
Cheat_Menu.sidebar = null;
Cheat_Menu.content = null;
Cheat_Menu.overlay = null;
Cheat_Menu.style_css = null;
Cheat_Menu.quick_hud_el = null;
Cheat_Menu.hover_btn = null;

// Clone utility for save values
Cheat_Menu.clone_save_value = function (value) {
    if (value === undefined || value === null) return value;
    if (typeof value !== "object") return value;
    return JSON.parse(JSON.stringify(value));
};

// Reset to initial values (used on new game/load)
Cheat_Menu.reset_to_initial = function () {
    for (var name in Cheat_Menu.initial_values) {
        Cheat_Menu[name] = Cheat_Menu.clone_save_value(Cheat_Menu.initial_values[name]);
    }
    // Ensure objects are fresh copies
    Cheat_Menu.btn_config = { ...Cheat_Menu.default_btn_config, ...Cheat_Menu.btn_config };
    Cheat_Menu.hud_config = { ...Cheat_Menu.default_hud_config, ...Cheat_Menu.hud_config };
};

// Properties to never overwrite from save data (dynamically generated)
Cheat_Menu._save_blacklist = [
    'menus', 'menu_names', '_menus_grouped', '_pages_registered',
    'sub_tab_per_group', 'list_state', '_page_titles'
];

// Load saved values from localStorage
Cheat_Menu.load_saved_values = function () {
    try {
        var raw = localStorage.getItem('Cheat_Menu');
        if (raw) {
            var saved = JSON.parse(raw);
            for (var name in saved) {
                if (Cheat_Menu._save_blacklist.indexOf(name) !== -1) continue;
                Cheat_Menu[name] = Cheat_Menu.clone_save_value(saved[name]);
            }
        }
    } catch (e) {
        // localStorage unavailable or corrupt - use defaults
    }
    // Ensure configs have defaults merged
    Cheat_Menu.btn_config = { ...Cheat_Menu.default_btn_config, ...Cheat_Menu.btn_config };
    Cheat_Menu.hud_config = { ...Cheat_Menu.default_hud_config, ...Cheat_Menu.hud_config };
};

// Save current values to localStorage
Cheat_Menu.save_values = function () {
    try {
        var data = {};
        for (var name in Cheat_Menu.initial_values) {
            if (Cheat_Menu[name] !== undefined) {
                data[name] = Cheat_Menu.clone_save_value(Cheat_Menu[name]);
            }
        }
        localStorage.setItem('Cheat_Menu', JSON.stringify(data));
    } catch (e) {
        // localStorage full or unavailable
    }
};

// Get menu names (for sidebar)
Cheat_Menu.get_menu_names = function () {
    return Cheat_Menu.menu_names;
};