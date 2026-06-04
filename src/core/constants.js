// ============================================================
// Cheat Menu - Constants
// ============================================================

// Amount options for numerical cheats
Cheat_Menu.amounts = [1, 10, 100, 1000, 10000, 100000, 1000000];
Cheat_Menu.move_amounts = [0.5, 1, 1.5, 2];

// Menu positions
Cheat_Menu.positions = ["Center", "Top Left", "Top Right", "Bottom Right", "Bottom Left"];

// Button positions for hover toggle
Cheat_Menu.btn_positions = ["Bottom Center", "Bottom Right", "Bottom Left", "Top Right", "Top Left"];

// Key codes
Cheat_Menu.keyCodes = {
    KEYCODE_0: { keyCode: 48, key_listener: 0 },
    KEYCODE_1: { keyCode: 49, key_listener: 1 },
    KEYCODE_2: { keyCode: 50, key_listener: 2 },
    KEYCODE_3: { keyCode: 51, key_listener: 3 },
    KEYCODE_4: { keyCode: 52, key_listener: 4 },
    KEYCODE_5: { keyCode: 53, key_listener: 5 },
    KEYCODE_6: { keyCode: 54, key_listener: 6 },
    KEYCODE_7: { keyCode: 55, key_listener: 7 },
    KEYCODE_8: { keyCode: 56, key_listener: 8 },
    KEYCODE_9: { keyCode: 57, key_listener: 9 },
    KEYCODE_MINUS: { keyCode: 189, key_listener: '-' },
    KEYCODE_EQUAL: { keyCode: 18, key_listener: '=' },
    KEYCODE_TILDE: { keyCode: 192, key_listener: '`' },
    KEYCODE_F8: { keyCode: 119, key_listener: 'f8' },
    KEYCODE_F9: { keyCode: 120, key_listener: 'f9' }
};

// Initial values for new game/load
Cheat_Menu.initial_values = {
    position: 0,
    cheat_selected: 0,
    cheat_selected_actor: 1,
    amount_index: 0,
    stat_selection: 0,
    item_selection: 1,
    weapon_selection: 1,
    armor_selection: 1,
    move_amount_index: 1,
    variable_selection: 1,
    switch_selection: 1,
    saved_positions: [{ m: -1, x: -1, y: -1 }, { m: -1, x: -1, y: -1 }, { m: -1, x: -1, y: -1 }],
    teleport_location: { m: 1, x: 0, y: 0 },
    speed: null,
    speed_unlocked: true,
    fontSize: 14,
    menu_scale: 60,
    btn_config: {
        enabled: true,
        opacity: 30,
        size: 40,
        posIndex: 1
    },
    hud_config: {
        enabled: false,
        position: 'Top',
        opacity: 40,
        fontSize: 12,
        active: ['party_full_hp', 'enemy_hp_0', 'toggle_noclip', 'open_inv', 'open_vars']
    }
};

// Default configs (merged with saved values)
Cheat_Menu.default_btn_config = {
    enabled: true,
    opacity: 30,
    size: 40,
    posIndex: 1
};

Cheat_Menu.default_hud_config = {
    enabled: false,
    position: 'Top',
    opacity: 40,
    fontSize: 12,
    active: ['party_full_hp', 'enemy_hp_0', 'toggle_noclip', 'open_inv', 'open_vars']
};

// Scroll button step
Cheat_Menu.scroll_button_step = 120;

// Drag threshold for touch/mouse drag scroll
Cheat_Menu.DRAG_THRESHOLD = 5;