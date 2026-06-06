// ============================================================
// Cheat Menu Plugin - RPG Maker MV/MZ
// Built from src/ modules
// ============================================================

// Source: core/state.js
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

// Load saved values from $gameSystem
Cheat_Menu.load_saved_values = function () {
    if ($gameSystem && $gameSystem.Cheat_Menu) {
        for (var name in $gameSystem.Cheat_Menu) {
            Cheat_Menu[name] = Cheat_Menu.clone_save_value($gameSystem.Cheat_Menu[name]);
        }
    }
    // Ensure configs have defaults merged
    Cheat_Menu.btn_config = { ...Cheat_Menu.default_btn_config, ...Cheat_Menu.btn_config };
    Cheat_Menu.hud_config = { ...Cheat_Menu.default_hud_config, ...Cheat_Menu.hud_config };
};

// Save current values to $gameSystem
Cheat_Menu.save_values = function () {
    if (!$gameSystem) return;
    $gameSystem.Cheat_Menu = {};
    for (var name in Cheat_Menu.initial_values) {
        if (Cheat_Menu[name] !== undefined) {
            $gameSystem.Cheat_Menu[name] = Cheat_Menu.clone_save_value(Cheat_Menu[name]);
        }
    }
};

// Get menu names (for sidebar)
Cheat_Menu.get_menu_names = function () {
    return Cheat_Menu.menu_names;
};

// Source: core/constants.js
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
    menu_scale: 75,
    manual_menu_size: null,
    sub_tab_per_group: {},
    list_state: { search: "", scroll: 0 },
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
        layout: 'horizontal',
        freePos: null,
        collapsed: false,
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
    layout: 'horizontal',
    freePos: null,
    collapsed: false,
    active: ['party_full_hp', 'enemy_hp_0', 'toggle_noclip', 'open_inv', 'open_vars']
};

// Scroll button step
Cheat_Menu.scroll_button_step = 120;

// Drag threshold for touch/mouse drag scroll
Cheat_Menu.DRAG_THRESHOLD = 3;

// Source: cheats/combat.js
// ============================================================
// Cheat Menu - Combat Cheats (God Mode, HP/MP/TP, Enemy)
// ============================================================

Cheat_Menu.god_mode = function (actor) {
    if (actor instanceof Game_Actor && !(actor.god_mode)) {
        actor.god_mode = true;

        actor.gainHP_bkup = actor.gainHp;
        actor.gainHp = function (value) {
            value = this.mhp;
            this.gainHP_bkup(value);
        };

        actor.setHp_bkup = actor.setHp;
        actor.setHp = function (hp) {
            hp = this.mhp;
            this.setHp_bkup(hp);
        };

        actor.gainMp_bkup = actor.gainMp;
        actor.gainMp = function (value) {
            value = this.mmp;
            this.gainMp_bkup(value);
        };

        actor.setMp_bkup = actor.setMp;
        actor.setMp = function (mp) {
            mp = this.mmp;
            this.setMp_bkup(mp);
        };

        actor.gainTp_bkup = actor.gainTp;
        actor.gainTp = function (value) {
            value = this.maxTp();
            this.gainTp_bkup(value);
        };

        actor.setTp_bkup = actor.setTp;
        actor.setTp = function (tp) {
            tp = this.maxTp();
            this.setTp_bkup(tp);
        };

        actor.paySkillCost_bkup = actor.paySkillCost;
        actor.paySkillCost = function (skill) {
            // do nothing
        };

        actor.god_mode_interval = setInterval(function () {
            actor.gainHp(actor.mhp);
            actor.gainMp(actor.mmp);
            actor.gainTp(actor.maxTp());
        }, 100);
    }
};

Cheat_Menu.god_mode_off = function (actor) {
    if (actor instanceof Game_Actor && actor.god_mode) {
        actor.god_mode = false;

        actor.gainHp = actor.gainHP_bkup;
        actor.setHp = actor.setHp_bkup;
        actor.gainMp = actor.gainMp_bkup;
        actor.setMp = actor.setMp_bkup;
        actor.gainTp = actor.gainTp_bkup;
        actor.setTp = actor.setTp_bkup;
        actor.paySkillCost = actor.paySkillCost_bkup;

        clearInterval(actor.god_mode_interval);
    }
};

Cheat_Menu.god_mode_toggle = function () {
    var actor = $gameActors._data[Cheat_Menu.cheat_selected_actor];
    if (actor) {
        if (!actor.god_mode) {
            Cheat_Menu.god_mode(actor);
            SoundManager.playSystemSound(1);
        } else {
            Cheat_Menu.god_mode_off(actor);
            SoundManager.playSystemSound(2);
        }
        Cheat_Menu.update_menu();
    }
};

Cheat_Menu.set_party_hp = function (hp, alive) {
    var members = $gameParty.allMembers();
    for (var i = 0; i < members.length; i++) {
        if ((alive && members[i]._hp != 0) || !alive) {
            members[i].setHp(hp);
        }
    }
};

Cheat_Menu.set_party_mp = function (mp, alive) {
    var members = $gameParty.allMembers();
    for (var i = 0; i < members.length; i++) {
        if ((alive && members[i]._hp != 0) || !alive) {
            members[i].setMp(mp);
        }
    }
};

Cheat_Menu.set_party_tp = function (tp, alive) {
    var members = $gameParty.allMembers();
    for (var i = 0; i < members.length; i++) {
        if ((alive && members[i]._hp != 0) || !alive) {
            members[i].setTp(tp);
        }
    }
};

Cheat_Menu.recover_party_hp = function (alive) {
    var members = $gameParty.allMembers();
    for (var i = 0; i < members.length; i++) {
        if ((alive && members[i]._hp != 0) || !alive) {
            members[i].setHp(members[i].mhp);
        }
    }
};

Cheat_Menu.recover_party_mp = function (alive) {
    var members = $gameParty.allMembers();
    for (var i = 0; i < members.length; i++) {
        if ((alive && members[i]._hp != 0) || !alive) {
            members[i].setMp(members[i].mmp);
        }
    }
};

Cheat_Menu.recover_party_tp = function (alive) {
    var members = $gameParty.allMembers();
    for (var i = 0; i < members.length; i++) {
        if ((alive && members[i]._hp != 0) || !alive) {
            members[i].setTp(members[i].maxTp());
        }
    }
};

Cheat_Menu.set_enemy_hp = function (hp, alive) {
    var members = $gameTroop.members();
    for (var i = 0; i < members.length; i++) {
        if (members[i]) {
            if ((alive && members[i]._hp != 0) || !alive) {
                members[i].setHp(hp);
            }
        }
    }
};

Cheat_Menu.clear_actor_states = function (actor) {
    if (actor instanceof Game_Actor) {
        if (actor._states != undefined && actor._states.length > 0) {
            actor.clearStates();
        }
    }
};

Cheat_Menu.clear_party_states = function () {
    var members = $gameParty.allMembers();
    for (var i = 0; i < members.length; i++) {
        Cheat_Menu.clear_actor_states(members[i]);
    }
};

// Source: cheats/progression.js
// ============================================================
// Cheat Menu - Progression Cheats (EXP, Stats, Gold)
// ============================================================

Cheat_Menu.give_exp = function (actor, amount) {
    if (actor instanceof Game_Actor) {
        actor.gainExp(amount);
    }
};

Cheat_Menu.give_stat = function (actor, stat_index, amount) {
    if (actor instanceof Game_Actor) {
        if (actor._paramPlus[stat_index] != undefined) {
            actor.addParam(stat_index, amount);
        }
    }
};

Cheat_Menu.give_gold = function (amount) {
    $gameParty.gainGold(amount);
};

// Source: cheats/inventory.js
// ============================================================
// Cheat Menu - Inventory Cheats (Items, Weapons, Armor)
// ============================================================

Cheat_Menu.give_item = function (item_id, amount) {
    if ($dataItems[item_id] != undefined) {
        $gameParty.gainItem($dataItems[item_id], amount);
    }
};

Cheat_Menu.give_weapon = function (weapon_id, amount) {
    if ($dataWeapons[weapon_id] != undefined) {
        $gameParty.gainItem($dataWeapons[weapon_id], amount);
    }
};

Cheat_Menu.give_armor = function (armor_id, amount) {
    if ($dataArmors[armor_id] != undefined) {
        $gameParty.gainItem($dataArmors[armor_id], amount);
    }
};

// Source: cheats/movement.js
// ============================================================
// Cheat Menu - Movement Cheats (Speed, No-Clip, Teleport)
// ============================================================

Cheat_Menu.initialize_speed_lock = function () {
    if (!Cheat_Menu.speed_initialized) {
        Cheat_Menu.speed = $gamePlayer._moveSpeed;
        Object.defineProperty($gamePlayer, "_moveSpeed", {
            get: function () { return Cheat_Menu.speed; },
            set: function (newVal) { if (Cheat_Menu.speed_unlocked) { Cheat_Menu.speed = newVal; } }
        });
        Cheat_Menu.speed_initialized = true;
    }
};

Cheat_Menu.change_player_speed = function (amount) {
    Cheat_Menu.initialize_speed_lock();
    Cheat_Menu.speed += amount;
};

Cheat_Menu.toggle_lock_player_speed = function () {
    Cheat_Menu.initialize_speed_lock();
    Cheat_Menu.speed_unlocked = !Cheat_Menu.speed_unlocked;
};

Cheat_Menu.teleport = function (map_id, x_pos, y_pos) {
    $gamePlayer.reserveTransfer(map_id, x_pos, y_pos, $gamePlayer.direction(), 0);
    $gamePlayer.setPosition(x_pos, y_pos);
};

// Source: cheats/system.js
// ============================================================
// Cheat Menu - System Cheats (Variables, Switches, Save/Recall)
// ============================================================

Cheat_Menu.set_variable = function (variable_id, value) {
    if ($dataSystem.variables[variable_id] != undefined) {
        var new_value = $gameVariables.value(variable_id) + value;
        $gameVariables.setValue(variable_id, new_value);
    }
};

Cheat_Menu.toggle_switch = function (switch_id) {
    if ($dataSystem.switches[switch_id] != undefined) {
        $gameSwitches.setValue(switch_id, !$gameSwitches.value(switch_id));
    }
};

// Source: ui/components/overlay.js
// ============================================================
// Cheat Menu - Overlay UI Component
// ============================================================

Cheat_Menu.overlay_box = document.createElement('div');
Cheat_Menu.overlay_box.id = "cheat_menu";

Cheat_Menu.sidebar = document.createElement('div');
Cheat_Menu.sidebar.id = "cheat_menu_sidebar";

Cheat_Menu.content = document.createElement('div');
Cheat_Menu.content.id = "cheat_menu_content";

Cheat_Menu.overlay_box.appendChild(Cheat_Menu.sidebar);
Cheat_Menu.overlay_box.appendChild(Cheat_Menu.content);

// Backwards compatibility
Cheat_Menu.overlay = Cheat_Menu.content;

// Inject CSS
Cheat_Menu.style_css = document.createElement("link");
Cheat_Menu.style_css.type = "text/css";
Cheat_Menu.style_css.rel = "stylesheet";
Cheat_Menu.style_css.href = "js/plugins/Cheat_Menu.css";
document.head.appendChild(Cheat_Menu.style_css);

// Prevent clicks/wheel from passing through to game canvas
var stopProp = function (event) { event.stopPropagation(); };
Cheat_Menu.overlay_box.addEventListener("mousedown", stopProp);
Cheat_Menu.overlay_box.addEventListener("wheel", stopProp, { passive: true });
Cheat_Menu.overlay_box.addEventListener("touchstart", stopProp, { passive: true });
Cheat_Menu.overlay_box.addEventListener("touchmove", stopProp, { passive: true });

// Position menu based on current position setting
Cheat_Menu.position_menu = function () {
    Cheat_Menu.overlay_box.style.marginLeft = "0px";
    Cheat_Menu.overlay_box.style.marginTop = "0px";

    switch (Cheat_Menu.position) {
        case 0: // Center
            Cheat_Menu.overlay_box.style.left = "50%";
            Cheat_Menu.overlay_box.style.top = "50%";
            Cheat_Menu.overlay_box.style.right = "";
            Cheat_Menu.overlay_box.style.bottom = "";
            Cheat_Menu.overlay_box.style.transform = "translate(-50%, -50%)";
            break;
        case 1: // Top Left
            Cheat_Menu.overlay_box.style.left = "5px";
            Cheat_Menu.overlay_box.style.top = "5px";
            Cheat_Menu.overlay_box.style.right = "";
            Cheat_Menu.overlay_box.style.bottom = "";
            Cheat_Menu.overlay_box.style.transform = "none";
            break;
        case 2: // Top Right
            Cheat_Menu.overlay_box.style.left = "";
            Cheat_Menu.overlay_box.style.top = "5px";
            Cheat_Menu.overlay_box.style.right = "5px";
            Cheat_Menu.overlay_box.style.bottom = "";
            Cheat_Menu.overlay_box.style.transform = "none";
            break;
        case 3: // Bottom Right
            Cheat_Menu.overlay_box.style.left = "";
            Cheat_Menu.overlay_box.style.top = "";
            Cheat_Menu.overlay_box.style.right = "5px";
            Cheat_Menu.overlay_box.style.bottom = "5px";
            Cheat_Menu.overlay_box.style.transform = "none";
            break;
        case 4: // Bottom Left
            Cheat_Menu.overlay_box.style.left = "5px";
            Cheat_Menu.overlay_box.style.top = "";
            Cheat_Menu.overlay_box.style.right = "";
            Cheat_Menu.overlay_box.style.bottom = "5px";
            Cheat_Menu.overlay_box.style.transform = "none";
            break;
    }
};

Cheat_Menu.update_menu_size = function () {
    if (Cheat_Menu.manual_menu_size) {
        Cheat_Menu.overlay_box.style.width = Cheat_Menu.manual_menu_size.w + "px";
        Cheat_Menu.overlay_box.style.height = Cheat_Menu.manual_menu_size.h + "px";
    } else {
        Cheat_Menu.overlay_box.style.width = Cheat_Menu.menu_scale + "vw";
        Cheat_Menu.overlay_box.style.height = Cheat_Menu.menu_scale + "vh";
    }
};

Cheat_Menu.close_menu = function () {
    if (Cheat_Menu.overlay_box) {
        Cheat_Menu.overlay_box.style.display = "none";
        Cheat_Menu.overlay_box.remove();
    }
    Cheat_Menu.cheat_menu_open = false;
    Cheat_Menu.render_quick_hud();
    SoundManager.playSystemSound(2);
};

// Resize handle drag logic
Cheat_Menu._initResizeHandle = function () {
    var handle = document.getElementById('cheat_menu_resize_handle');
    if (!handle) return;
    if (handle._resizeBound) return;
    handle._resizeBound = true;

    var startX = 0, startY = 0, startW = 0, startH = 0;
    var isResizing = false;

    function onStart(e) {
        e.preventDefault();
        e.stopPropagation();
        isResizing = true;
        var rect = Cheat_Menu.overlay_box.getBoundingClientRect();
        startW = rect.width;
        startH = rect.height;
        startX = e.touches ? e.touches[0].clientX : e.clientX;
        startY = e.touches ? e.touches[0].clientY : e.clientY;
    }

    function onMove(e) {
        if (!isResizing) return;
        var dx = (e.touches ? e.touches[0].clientX : e.clientX) - startX;
        var dy = (e.touches ? e.touches[0].clientY : e.clientY) - startY;
        var newW = Math.max(200, startW + dx);
        var newH = Math.max(150, startH + dy);
        Cheat_Menu.overlay_box.style.width = newW + "px";
        Cheat_Menu.overlay_box.style.height = newH + "px";
        e.preventDefault();
        e.stopPropagation();
    }

    function onEnd() {
        if (!isResizing) return;
        isResizing = false;
        var rect = Cheat_Menu.overlay_box.getBoundingClientRect();
        Cheat_Menu.manual_menu_size = { w: rect.width, h: rect.height };
        if (typeof $gameSystem !== 'undefined' && $gameSystem) {
            Cheat_Menu.save_values();
        }
    }

    handle.addEventListener('mousedown', onStart);
    handle.addEventListener('touchstart', onStart, { passive: false });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);
};

Cheat_Menu.open_menu = function () {
    document.body.appendChild(Cheat_Menu.overlay_box);
    Cheat_Menu.overlay_box.style.display = "flex";
    if (!Cheat_Menu.fontSize) Cheat_Menu.fontSize = 14;
    Cheat_Menu.overlay_box.style.fontSize = Cheat_Menu.fontSize + "px";
    Cheat_Menu.cheat_menu_open = true;
    SoundManager.playSystemSound(1);
    Cheat_Menu.update_menu();

    // Inject close button
    var cm = document.getElementById('cheat_menu');
    if (cm && !document.getElementById('cheat_menu_close')) {
        var closeBtn = document.createElement('button');
        closeBtn.id = "cheat_menu_close";
        closeBtn.innerHTML = "✖";
        var closeFn = function (e) {
            e.preventDefault();
            e.stopPropagation();
            Cheat_Menu.close_menu();
        };
        closeBtn.addEventListener('mousedown', closeFn);
        closeBtn.addEventListener('touchstart', closeFn, { passive: false });
        cm.appendChild(closeBtn);
    }

    // Inject resize handle
    if (cm && !document.getElementById('cheat_menu_resize_handle')) {
        var resizeHandle = document.createElement('div');
        resizeHandle.id = "cheat_menu_resize_handle";
        cm.appendChild(resizeHandle);
        Cheat_Menu._initResizeHandle();
    }
};


// Source: ui/components/modal.js
// ============================================================
// Cheat Menu - Modal Component
// ============================================================

Cheat_Menu.open_value_modal = function (titleText, currentValue, onSave) {
    var bg = document.createElement('div');
    bg.className = "cheat_modal_bg";

    var modal = document.createElement('div');
    modal.className = "cheat_modal";

    var title = document.createElement('div');
    title.className = "cheat_modal_title";
    title.innerHTML = titleText;

    var input = document.createElement('input');
    input.className = "cheat_search_input";
    input.type = "number";
    input.value = currentValue;
    input.addEventListener('keydown', function (e) {
        e.stopPropagation();
        if (e.keyCode === 13) {
            onSave(Number(input.value));
            bg.remove();
        } else if (e.keyCode === 27) {
            bg.remove();
        }
    });

    var btnRow = document.createElement('div');
    btnRow.className = "cheat_modal_buttons";

    var btnCancel = document.createElement('button');
    btnCancel.className = "cheat_btn";
    btnCancel.innerHTML = "Cancel";
    Cheat_Menu.addEvent(btnCancel, function () { bg.remove(); });

    var btnSave = document.createElement('button');
    btnSave.className = "cheat_btn";
    btnSave.innerHTML = "Save";
    Cheat_Menu.addEvent(btnSave, function () { onSave(Number(input.value)); bg.remove(); });

    btnRow.appendChild(btnCancel);
    btnRow.appendChild(btnSave);

    modal.appendChild(title);
    modal.appendChild(input);
    modal.appendChild(btnRow);
    bg.appendChild(modal);

    bg.addEventListener('mousedown', function (e) {
        if (e.target === bg) bg.remove();
        e.stopPropagation();
    });

    Cheat_Menu.overlay_box.appendChild(bg);
    input.focus();
    input.select();
};

Cheat_Menu.open_text_modal = function (titleText, currentValue, onSave) {
    var bg = document.createElement('div');
    bg.className = "cheat_modal_bg";

    var modal = document.createElement('div');
    modal.className = "cheat_modal";

    var title = document.createElement('div');
    title.className = "cheat_modal_title";
    title.innerHTML = titleText;

    var input = document.createElement('input');
    input.className = "cheat_search_input";
    input.type = "text";
    input.value = currentValue;
    input.addEventListener('keydown', function (e) {
        e.stopPropagation();
        if (e.keyCode === 13) {
            onSave(input.value);
            bg.remove();
        } else if (e.keyCode === 27) {
            bg.remove();
        }
    });

    var btnRow = document.createElement('div');
    btnRow.className = "cheat_modal_buttons";

    var btnCancel = document.createElement('button');
    btnCancel.className = "cheat_btn";
    btnCancel.innerHTML = "Cancel";
    Cheat_Menu.addEvent(btnCancel, function () { bg.remove(); });

    var btnSave = document.createElement('button');
    btnSave.className = "cheat_btn";
    btnSave.innerHTML = "Save";
    Cheat_Menu.addEvent(btnSave, function () { onSave(input.value); bg.remove(); });

    btnRow.appendChild(btnCancel);
    btnRow.appendChild(btnSave);

    modal.appendChild(title);
    modal.appendChild(input);
    modal.appendChild(btnRow);
    bg.appendChild(modal);

    bg.addEventListener('mousedown', function (e) {
        if (e.target === bg) bg.remove();
        e.stopPropagation();
    });

    Cheat_Menu.overlay_box.appendChild(bg);
    input.focus();
    input.select();
};

Cheat_Menu.open_confirm_modal = function (message, onConfirm) {
    var bg = document.createElement('div');
    bg.className = "cheat_modal_bg";

    var modal = document.createElement('div');
    modal.className = "cheat_modal";

    var msg = document.createElement('div');
    msg.className = "cheat_modal_title";
    msg.style.fontSize = "1em";
    msg.style.fontWeight = "normal";
    msg.style.color = "#ccc";
    msg.innerHTML = message;

    var btnRow = document.createElement('div');
    btnRow.className = "cheat_modal_buttons";

    var btnCancel = document.createElement('button');
    btnCancel.className = "cheat_btn";
    btnCancel.innerHTML = "Cancel";
    Cheat_Menu.addEvent(btnCancel, function () { bg.remove(); });

    var btnConfirm = document.createElement('button');
    btnConfirm.className = "cheat_btn";
    btnConfirm.innerHTML = "Confirm";
    btnConfirm.style.borderColor = "#44cc55";
    btnConfirm.style.color = "#44cc55";
    Cheat_Menu.addEvent(btnConfirm, function () { onConfirm(); bg.remove(); });

    btnRow.appendChild(btnCancel);
    btnRow.appendChild(btnConfirm);

    modal.appendChild(msg);
    modal.appendChild(btnRow);
    bg.appendChild(modal);

    bg.addEventListener('mousedown', function (e) {
        if (e.target === bg) bg.remove();
    });

    Cheat_Menu.overlay_box.appendChild(bg);
};


// Source: ui/components/searchList.js
// ============================================================
// Cheat Menu - Searchable List Component
// ============================================================

Cheat_Menu.append_searchable_list = function (dataArray, selectedIdx, onSelectCallback, getNameFunc, isGrid, getValueFunc, verticalLayout, extraClass) {
    var container = document.createElement('div');
    container.className = "cheat_search_container";

    var searchInput = document.createElement('input');
    searchInput.className = "cheat_search_input";
    searchInput.type = "text";
    searchInput.placeholder = "Search...";
    searchInput.value = Cheat_Menu.list_state.search;

    var listDiv = document.createElement('ul');
    var listClass = "cheat_list";
    if (isGrid) listClass += " grid";
    if (verticalLayout) listClass += " vertical";
    if (extraClass) listClass += " " + extraClass;
    listDiv.className = listClass;
    listDiv.tabIndex = -1;

    var focusedIndex = 0;

    var renderList = function (filterText) {
        listDiv.innerHTML = "";
        filterText = filterText.toLowerCase();

        var visibleItems = [];
        for (var i = 1; i < dataArray.length; i++) {
            if (!dataArray[i]) continue;

            var name = getNameFunc ? getNameFunc(dataArray[i], i) : (dataArray[i].name || dataArray[i]);
            if (typeof name !== "string") name = String(name);

            if (name && name.toLowerCase().indexOf(filterText) !== -1) {
                visibleItems.push({ idx: i, name: name });
            }
        }

        if (visibleItems.length === 0) {
            var emptyLi = document.createElement('li');
            emptyLi.className = "cheat_list_item";
            emptyLi.style.justifyContent = "center";
            emptyLi.style.color = "#666";
            emptyLi.style.cursor = "default";
            emptyLi.innerHTML = "No results";
            listDiv.appendChild(emptyLi);
            return;
        }

        searchInput.placeholder = "Search (" + visibleItems.length + " results)...";

        for (var v = 0; v < visibleItems.length; v++) {
            var item = visibleItems[v];
            var li = document.createElement('li');
            li.className = "cheat_list_item";
            if (item.idx === selectedIdx) {
                li.className += " selected";
                focusedIndex = v;
            }
            li.dataset.listIndex = v;

            var labelSpan = document.createElement('span');
            labelSpan.className = "cheat_list_item_label";
            labelSpan.innerHTML = item.idx + ": " + item.name;
            li.appendChild(labelSpan);

            if (getValueFunc) {
                var valDiv = document.createElement('div');
                valDiv.className = "cheat_list_item_val";
                valDiv.innerHTML = getValueFunc(item.idx);
                li.appendChild(valDiv);
            }

            (function (idx) {
                Cheat_Menu.addEvent(li, function (e) {
                    e.preventDefault();
                    onSelectCallback(idx);
                });
            })(item.idx);
            listDiv.appendChild(li);
        }
    };

    searchInput.addEventListener('input', function (e) {
        Cheat_Menu.list_state.search = e.target.value;
        Cheat_Menu.list_state.scroll = 0;
        renderList(e.target.value);
    });

    searchInput.addEventListener('keydown', function (e) {
        e.stopPropagation();
        if (e.keyCode === 40) {
            e.preventDefault();
            var items = listDiv.querySelectorAll('.cheat_list_item');
            if (items.length === 0) return;
            focusedIndex = Math.min(focusedIndex + 1, items.length - 1);
            items[focusedIndex].scrollIntoView({ block: 'nearest' });
        } else if (e.keyCode === 38) {
            e.preventDefault();
            var items = listDiv.querySelectorAll('.cheat_list_item');
            if (items.length === 0) return;
            focusedIndex = Math.max(focusedIndex - 1, 0);
            items[focusedIndex].scrollIntoView({ block: 'nearest' });
        } else if (e.keyCode === 13) {
            e.preventDefault();
            var items = listDiv.querySelectorAll('.cheat_list_item');
            if (items.length > focusedIndex) {
                items[focusedIndex].click();
            }
        }
    });

    listDiv.onscroll = function () {
        Cheat_Menu.list_state.scroll = listDiv.scrollTop;
    };

    renderList(Cheat_Menu.list_state.search);

    container.appendChild(searchInput);
    container.appendChild(listDiv);
    Cheat_Menu.content.appendChild(container);

    requestAnimationFrame(function () {
        listDiv.scrollTop = Cheat_Menu.list_state.scroll;
    });
};


// Source: ui/components/hud.js
// ============================================================
// Cheat Menu - Quick Action HUD Component
// ============================================================

Cheat_Menu.hud_actions = {
    'open_inv': {
        title: 'Inventory',
        fn: function () { Cheat_Menu.open_tab_by_name('Inventory'); }
    },
    'open_vars': {
        title: 'Vars & Switches',
        fn: function () { Cheat_Menu.open_tab_by_name('Variables & Switches'); }
    },
    'open_combat': {
        title: 'Combat & Vitals',
        fn: function () { Cheat_Menu.open_tab_by_name('Combat & Vitals'); }
    },
    'toggle_noclip': {
        title: 'No Clip',
        fn: function () {
            $gamePlayer._through = !$gamePlayer._through;
            SoundManager.playSystemSound($gamePlayer._through ? 1 : 2);
        }
    },
    'toggle_godmode': {
        title: 'God Mode',
        fn: function () {
            var actor = $gameActors._data[Cheat_Menu.cheat_selected_actor];
            if (actor) {
                if (actor.god_mode) {
                    Cheat_Menu.god_mode_off(actor);
                    SoundManager.playSystemSound(2);
                } else {
                    Cheat_Menu.god_mode(actor);
                    SoundManager.playSystemSound(1);
                }
            }
        }
    },
    'party_full_hp': {
        title: 'Party Full HP',
        fn: function () { Cheat_Menu.recover_party_hp(true); SoundManager.playSystemSound(1); }
    },
    'party_full_mp': {
        title: 'Party Full MP',
        fn: function () { Cheat_Menu.recover_party_mp(true); SoundManager.playSystemSound(1); }
    },
    'party_full_tp': {
        title: 'Party Full TP',
        fn: function () { Cheat_Menu.recover_party_tp(true); SoundManager.playSystemSound(1); }
    },
    'party_hp_0': {
        title: 'Party HP 0',
        fn: function () { Cheat_Menu.set_party_hp(0, true); SoundManager.playSystemSound(1); }
    },
    'party_hp_1': {
        title: 'Party HP 1',
        fn: function () { Cheat_Menu.set_party_hp(1, true); SoundManager.playSystemSound(1); }
    },
    'enemy_hp_0': {
        title: 'Enemy HP 0 (Alive)',
        fn: function () { Cheat_Menu.set_enemy_hp(0, true); SoundManager.playSystemSound(1); }
    },
    'enemy_hp_1': {
        title: 'Enemy HP 1 (Alive)',
        fn: function () { Cheat_Menu.set_enemy_hp(1, true); SoundManager.playSystemSound(1); }
    },
    'enemy_hp_0_all': {
        title: 'Enemy HP 0 (All)',
        fn: function () { Cheat_Menu.set_enemy_hp(0, false); SoundManager.playSystemSound(1); }
    },
    'enemy_hp_1_all': {
        title: 'Enemy HP 1 (All)',
        fn: function () { Cheat_Menu.set_enemy_hp(1, false); SoundManager.playSystemSound(1); }
    },
    'clear_party_states': {
        title: 'Clear States',
        fn: function () { Cheat_Menu.clear_party_states(); SoundManager.playSystemSound(1); }
    },
    'close_menu': {
        title: 'Close Menu',
        fn: function () { Cheat_Menu.close_menu(); }
    }
};

Cheat_Menu.abbreviate_title = function (str) {
    return str.replace(/(\w)\w*/g, '$1').replace(/\s+/g, '');
};

Cheat_Menu.render_quick_hud = function () {
    if (!Cheat_Menu.quick_hud_el) {
        Cheat_Menu.quick_hud_el = document.createElement('div');
        Cheat_Menu.quick_hud_el.id = 'cheat_quick_hud';
        document.body.appendChild(Cheat_Menu.quick_hud_el);

        Cheat_Menu.quick_hud_el.addEventListener('touchstart', function (e) {
            e.stopPropagation();
        }, { passive: false });

        Cheat_Menu.quick_hud_el.addEventListener('touchend', function (e) {
            e.stopPropagation();
        }, { passive: false });

        Cheat_Menu.quick_hud_el.addEventListener('mousedown', function (e) {
            e.stopPropagation();
        }, false);
    }

    Cheat_Menu.quick_hud_el.innerHTML = "";
    Cheat_Menu.quick_hud_el.className = "";
    Cheat_Menu.quick_hud_el.style.position = "";
    Cheat_Menu.quick_hud_el.style.left = "";
    Cheat_Menu.quick_hud_el.style.right = "";
    Cheat_Menu.quick_hud_el.style.top = "";
    Cheat_Menu.quick_hud_el.style.bottom = "";
    Cheat_Menu.quick_hud_el.style.width = "";
    Cheat_Menu.quick_hud_el.style.maxWidth = "";

    var isEditingHUD = Cheat_Menu.cheat_menu_open &&
        Cheat_Menu.get_menu_names()[Cheat_Menu.cheat_selected] === "Quick Actions HUD";

    if (!Cheat_Menu.hud_config.enabled || (Cheat_Menu.cheat_menu_open && !isEditingHUD)) {
        Cheat_Menu.quick_hud_el.style.display = 'none';
        return;
    }

    Cheat_Menu.quick_hud_el.style.display = 'flex';
    var isVertical = Cheat_Menu.hud_config.layout === 'vertical';
    var isCollapsed = Cheat_Menu.hud_config.collapsed || false;

    if (Cheat_Menu.hud_config.freePos) {
        Cheat_Menu.quick_hud_el.style.position = 'fixed';
        Cheat_Menu.quick_hud_el.style.left = Cheat_Menu.hud_config.freePos.x + 'px';
        Cheat_Menu.quick_hud_el.style.top = Cheat_Menu.hud_config.freePos.y + 'px';
        Cheat_Menu.quick_hud_el.style.width = 'auto';
        Cheat_Menu.quick_hud_el.style.maxWidth = isVertical ? '60px' : '90vw';
        Cheat_Menu.quick_hud_el.style.flexDirection = isVertical ? 'column' : 'row';
    } else {
        var pos = Cheat_Menu.hud_config.position.toLowerCase();
        Cheat_Menu.quick_hud_el.style.transform = '';
        if (pos === 'top') {
            Cheat_Menu.quick_hud_el.style.left = '0';
            Cheat_Menu.quick_hud_el.style.right = '';
            Cheat_Menu.quick_hud_el.style.top = '0';
            Cheat_Menu.quick_hud_el.style.bottom = '';
            Cheat_Menu.quick_hud_el.style.width = '100vw';
        } else if (pos === 'bottom') {
            Cheat_Menu.quick_hud_el.style.left = '0';
            Cheat_Menu.quick_hud_el.style.right = '';
            Cheat_Menu.quick_hud_el.style.top = '';
            Cheat_Menu.quick_hud_el.style.bottom = '0';
            Cheat_Menu.quick_hud_el.style.width = '100vw';
        } else if (pos === 'left') {
            Cheat_Menu.quick_hud_el.style.left = '0';
            Cheat_Menu.quick_hud_el.style.right = '';
            Cheat_Menu.quick_hud_el.style.top = '50%';
            Cheat_Menu.quick_hud_el.style.bottom = '';
            Cheat_Menu.quick_hud_el.style.transform = 'translateY(-50%)';
            Cheat_Menu.quick_hud_el.style.width = 'auto';
        } else if (pos === 'right') {
            Cheat_Menu.quick_hud_el.style.left = '';
            Cheat_Menu.quick_hud_el.style.right = '0';
            Cheat_Menu.quick_hud_el.style.top = '50%';
            Cheat_Menu.quick_hud_el.style.bottom = '';
            Cheat_Menu.quick_hud_el.style.transform = 'translateY(-50%)';
            Cheat_Menu.quick_hud_el.style.width = 'auto';
        }
    }
    Cheat_Menu.quick_hud_el.style.maxWidth = isVertical ? '60px' : '90vw';
    Cheat_Menu.quick_hud_el.style.flexDirection = isVertical ? 'column' : 'row';

    // Position-based border accent
    var p = Cheat_Menu.hud_config.position.toLowerCase();
    Cheat_Menu.quick_hud_el.style.border = 'none';
    Cheat_Menu.quick_hud_el.style.borderRadius = '0';
    if (p === 'top') {
        Cheat_Menu.quick_hud_el.style.borderBottom = '1px solid rgba(68,204,85,0.2)';
    } else if (p === 'bottom') {
        Cheat_Menu.quick_hud_el.style.borderTop = '1px solid rgba(68,204,85,0.2)';
    } else if (p === 'left') {
        Cheat_Menu.quick_hud_el.style.borderRight = '1px solid rgba(68,204,85,0.2)';
    } else if (p === 'right') {
        Cheat_Menu.quick_hud_el.style.borderLeft = '1px solid rgba(68,204,85,0.2)';
    }

    // Collapse/Expand button (hidden when menu open)
    if (!Cheat_Menu.cheat_menu_open) {
        var collapseBtn = document.createElement('button');
        collapseBtn.className = 'cheat_hud_btn cheat_hud_ctrl';
        collapseBtn.type = 'button';
        collapseBtn.style.fontSize = Cheat_Menu.hud_config.fontSize + "px";
        collapseBtn.style.opacity = Cheat_Menu.hud_config.opacity / 100;
        collapseBtn.innerHTML = isCollapsed ? "<span>+</span>" : "<span>-</span>";
        var toggleCollapse = function (e) {
            e.stopPropagation();
            e.preventDefault();
            Cheat_Menu.hud_config.collapsed = !Cheat_Menu.hud_config.collapsed;
            Cheat_Menu.save_values();
            Cheat_Menu.render_quick_hud();
        };
        collapseBtn.addEventListener('mousedown', toggleCollapse);
        collapseBtn.addEventListener('touchstart', toggleCollapse, { passive: false });
        Cheat_Menu.quick_hud_el.appendChild(collapseBtn);
    }

    if (!isCollapsed) {
        for (var i = 0; i < Cheat_Menu.hud_config.active.length; i++) {
            let key = Cheat_Menu.hud_config.active[i];
            let action = Cheat_Menu.hud_actions[key];
            if (!action) continue;

            let btn = document.createElement('button');
            btn.className = 'cheat_hud_btn';
            btn.type = 'button';
            btn.style.fontSize = Cheat_Menu.hud_config.fontSize + "px";
            btn.style.opacity = Cheat_Menu.hud_config.opacity / 100;

            var displayText = action.title;
            if (isVertical) {
                displayText = Cheat_Menu.abbreviate_title(action.title);
            }
            btn.innerHTML = "<span>" + displayText + "</span>";

            let runAction = function (e) {
                e.stopPropagation();
                e.preventDefault();
                action.fn();
            };

            let stopOnly = function (e) {
                e.stopPropagation();
                e.preventDefault();
            };

            btn.addEventListener('mousedown', runAction, false);
            btn.addEventListener('touchstart', runAction, { passive: false });
            btn.addEventListener('touchend', stopOnly, { passive: false });
            btn.addEventListener('click', stopOnly, false);

            Cheat_Menu.quick_hud_el.appendChild(btn);
        }
    }

    // Drag handle (always last)
    var dragBtn = document.createElement('button');
    dragBtn.className = 'cheat_hud_btn cheat_hud_ctrl cheat_hud_drag';
    dragBtn.type = 'button';
    dragBtn.style.fontSize = Cheat_Menu.hud_config.fontSize + "px";
    dragBtn.style.opacity = Cheat_Menu.hud_config.opacity / 100;
    dragBtn.innerHTML = "<span>⠿</span>";
    Cheat_Menu.quick_hud_el.appendChild(dragBtn);

    // Drag logic
    function onDragStart(e) {
        e.preventDefault();
        e.stopPropagation();
        var el = Cheat_Menu.quick_hud_el;
        // Migrate to fixed/auto layout immediately so offsets are accurate
        var isV = Cheat_Menu.hud_config.layout === 'vertical';
        el.style.position = 'fixed';
        el.style.width = 'auto';
        el.style.maxWidth = isV ? '60px' : '90vw';
        el.style.flexDirection = isV ? 'column' : 'row';
        el.className = '';
        var rect = el.getBoundingClientRect();
        var cx = e.touches ? e.touches[0].clientX : e.clientX;
        var cy = e.touches ? e.touches[0].clientY : e.clientY;
        dragBtn._offsetX = cx - rect.left;
        dragBtn._offsetY = cy - rect.top;
        dragBtn._isDragging = true;
        dragBtn._dragMoved = false;
    }

    function onDragMove(e) {
        if (!dragBtn._isDragging) return;
        dragBtn._dragMoved = true;
        var cx = e.touches ? e.touches[0].clientX : e.clientX;
        var cy = e.touches ? e.touches[0].clientY : e.clientY;
        var el = Cheat_Menu.quick_hud_el;

        var isV = Cheat_Menu.hud_config.layout === 'vertical';
        el.style.position = 'fixed';
        el.style.width = 'auto';
        el.style.maxWidth = isV ? '60px' : '90vw';
        el.style.flexDirection = isV ? 'column' : 'row';
        el.className = '';

        var elW = el.offsetWidth;
        var elH = el.offsetHeight;
        var maxX = Math.max(0, window.innerWidth - elW);
        var maxY = Math.max(0, window.innerHeight - elH);
        var newX = Math.min(maxX, Math.max(0, cx - dragBtn._offsetX));
        var newY = Math.min(maxY, Math.max(0, cy - dragBtn._offsetY));

        el.style.left = newX + 'px';
        el.style.top = newY + 'px';
        e.preventDefault();
        e.stopPropagation();
    }

    function onDragEnd() {
        if (!dragBtn._isDragging) return;
        dragBtn._isDragging = false;
        if (dragBtn._dragMoved) {
            var rect = Cheat_Menu.quick_hud_el.getBoundingClientRect();
            Cheat_Menu.hud_config.freePos = { x: Math.round(rect.left), y: Math.round(rect.top) };
            Cheat_Menu.save_values();
        }
    }

    dragBtn.addEventListener('mousedown', onDragStart);
    dragBtn.addEventListener('touchstart', onDragStart, { passive: false });
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('touchmove', onDragMove, { passive: false });
    window.addEventListener('mouseup', onDragEnd);
    window.addEventListener('touchend', onDragEnd);
};

Cheat_Menu.open_tab_by_name = function (name) {
    var names = Cheat_Menu.get_menu_names();
    var idx = names.indexOf(name);
    if (idx !== -1) {
        Cheat_Menu.cheat_selected = idx;
        if (!Cheat_Menu.sub_tab_per_group) Cheat_Menu.sub_tab_per_group = {};
        Cheat_Menu.sub_tab_per_group[name] = 0;
        if (!Cheat_Menu.cheat_menu_open) {
            Cheat_Menu.open_menu();
        } else {
            Cheat_Menu.overlay_box.style.display = "flex";
            Cheat_Menu.cheat_menu_open = true;
            SoundManager.playSystemSound(1);
            Cheat_Menu.update_menu();
        }
    }
};


// Source: ui/components/hoverButton.js
// ============================================================
// Cheat Menu - Hover Toggle Button Component
// ============================================================

Cheat_Menu.render_hover_button = function () {
    if (!Cheat_Menu.hover_btn) {
        Cheat_Menu.hover_btn = document.createElement('div');
        Cheat_Menu.hover_btn.id = "cheat_hover_btn";
        Cheat_Menu.hover_btn.innerHTML = "★";

        Cheat_Menu.addEvent(Cheat_Menu.hover_btn, function (e) {
            if (Cheat_Menu.cheat_menu_open) {
                Cheat_Menu.close_menu();
            } else {
                Cheat_Menu.open_menu();
                Cheat_Menu.render_quick_hud();
            }
        });

        Cheat_Menu.hover_btn.addEventListener('touchstart', function (e) {
            e.stopPropagation();
        }, { passive: true });

        document.body.appendChild(Cheat_Menu.hover_btn);
    }

    if (!Cheat_Menu.btn_config.enabled) {
        Cheat_Menu.hover_btn.style.display = "none";
        return;
    }

    Cheat_Menu.hover_btn.style.display = "flex";
    Cheat_Menu.hover_btn.style.opacity = Cheat_Menu.btn_config.opacity / 100;
    Cheat_Menu.hover_btn.style.width = Cheat_Menu.btn_config.size + "px";
    Cheat_Menu.hover_btn.style.height = Cheat_Menu.btn_config.size + "px";
    Cheat_Menu.hover_btn.style.fontSize = (Cheat_Menu.btn_config.size * 0.5) + "px";
    Cheat_Menu.hover_btn.style.touchAction = "none";

    Cheat_Menu.hover_btn.style.left = "";
    Cheat_Menu.hover_btn.style.right = "";
    Cheat_Menu.hover_btn.style.top = "";
    Cheat_Menu.hover_btn.style.bottom = "";
    Cheat_Menu.hover_btn.style.transform = "";

    switch (Cheat_Menu.btn_config.posIndex) {
        case 0:
            Cheat_Menu.hover_btn.style.bottom = "15px";
            Cheat_Menu.hover_btn.style.left = "50%";
            Cheat_Menu.hover_btn.style.transform = "translateX(-50%)";
            break;
        case 1:
            Cheat_Menu.hover_btn.style.bottom = "15px";
            Cheat_Menu.hover_btn.style.right = "15px";
            break;
        case 2:
            Cheat_Menu.hover_btn.style.bottom = "15px";
            Cheat_Menu.hover_btn.style.left = "15px";
            break;
        case 3:
            Cheat_Menu.hover_btn.style.top = "15px";
            Cheat_Menu.hover_btn.style.right = "15px";
            break;
        case 4:
            Cheat_Menu.hover_btn.style.top = "15px";
            Cheat_Menu.hover_btn.style.left = "15px";
            break;
    }
};


// Source: ui/components/scrollButtons.js
// ============================================================
// Cheat Menu - Scroll Up/Down Buttons
//
// Sidebar / lists : scroll-column on the right side
// Content         : sticky in-flow ▲/▼ (takes 24px at edges)
// Only appear when there's content to scroll to.
// ============================================================

function _scbStep() { return Cheat_Menu.scroll_button_step || 120; }

function _scbToggle(upBtn, downBtn, target) {
    var sh = target.scrollHeight;
    var ch = target.clientHeight;
    var atTop = target.scrollTop <= 8;
    var atBottom = (target.scrollTop + ch >= sh - 8);
    upBtn.style.opacity = atTop ? '0' : '1';
    upBtn.style.pointerEvents = atTop ? 'none' : '';
    downBtn.style.opacity = atBottom ? '0' : '1';
    downBtn.style.pointerEvents = atBottom ? 'none' : '';
}

function _scbMakeColBtn(dir, target) {
    var b = document.createElement('button');
    b.className = 'cheat_scroll_col_btn scb_' + dir;
    b.setAttribute('aria-label', dir === 'up' ? 'Scroll up' : 'Scroll down');
    b.innerHTML = dir === 'up' ? '▲' : '▼';
    function handler(e) {
        e.stopPropagation();
        e.preventDefault();
        var step = _scbStep();
        if (dir === 'up') {
            target.scrollTop = Math.max(0, target.scrollTop - step);
        } else {
            target.scrollTop = Math.min(Math.max(0, target.scrollHeight - target.clientHeight), target.scrollTop + step);
        }
    }
    b.addEventListener('mousedown', handler);
    b.addEventListener('touchstart', handler, { passive: false });
    return b;
}

// Column registry — for resize refresh
var _scbCols = [];

function _scbRefresh() {
    for (var i = _scbCols.length - 1; i >= 0; i--) {
        var c = _scbCols[i];
        if (c.col !== undefined && (!c.col || !c.col.parentNode)) {
            _scbCols.splice(i, 1);
            continue;
        }
        _scbToggle(c.up, c.down, c.target);
    }
}

var _scbResizeTimer;
window.addEventListener('resize', function () {
    clearTimeout(_scbResizeTimer);
    _scbResizeTimer = setTimeout(_scbRefresh, 100);
});

// ============================================================
// Sidebar — column scroll on the right
// ============================================================

Cheat_Menu.add_sidebar_scroll_buttons = function (container) {
    if (!container) return;
    if (container._sbScrollAdded) {
        if (container.querySelector('.cheat_scroll_column')) return;
        container._sbScrollAdded = false;
    }
    container._sbScrollAdded = true;

    var contentDiv = document.createElement('div');
    contentDiv.className = 'cheat_sb_content';
    while (container.firstChild) {
        contentDiv.appendChild(container.firstChild);
    }

    var col = document.createElement('div');
    col.className = 'cheat_scroll_column';

    var upBtn = _scbMakeColBtn('up', contentDiv);
    var downBtn = _scbMakeColBtn('down', contentDiv);
    col.appendChild(upBtn);
    col.appendChild(downBtn);

    container.classList.add('cheat_sb_row');
    container.appendChild(contentDiv);
    container.appendChild(col);

    _scbCols.push({ col: col, up: upBtn, down: downBtn, target: contentDiv });

    function toggle() { _scbToggle(upBtn, downBtn, contentDiv); }
    contentDiv.addEventListener('scroll', toggle, { passive: true });
    requestAnimationFrame(toggle);
};

// ============================================================
// Lists — column scroll on the right
// ============================================================

Cheat_Menu.add_list_scroll_buttons = function (list) {
    if (!list) return;
    if (list._listScbAdded) {
        if (list.parentNode && list.parentNode.classList.contains('cheat_list_wrapper')) return;
        list._listScbAdded = false;
    }
    list._listScbAdded = true;

    var wrapper = document.createElement('div');
    wrapper.className = 'cheat_list_wrapper';

    var col = document.createElement('div');
    col.className = 'cheat_scroll_column';

    var upBtn = _scbMakeColBtn('up', list);
    var downBtn = _scbMakeColBtn('down', list);
    col.appendChild(upBtn);
    col.appendChild(downBtn);

    list.parentNode.insertBefore(wrapper, list);
    wrapper.appendChild(list);
    wrapper.appendChild(col);

    _scbCols.push({ col: col, up: upBtn, down: downBtn, target: list });

    function toggle() { _scbToggle(upBtn, downBtn, list); }
    list.addEventListener('scroll', toggle, { passive: true });
    requestAnimationFrame(toggle);
};

// ============================================================
// Content — sticky in-flow buttons
// ============================================================

Cheat_Menu.add_scroll_buttons = function (container) {
    if (!container) return;
    if (container._scbAdded) {
        if (container.firstChild && container.firstChild.classList.contains('cheat_scroll_btn')) return;
        container._scbAdded = false;
    }
    container._scbAdded = true;

    var upBtn = document.createElement('button');
    upBtn.className = 'cheat_scroll_btn scb_up';
    upBtn.setAttribute('aria-label', 'Scroll up');
    upBtn.innerHTML = '▲';

    var downBtn = document.createElement('button');
    downBtn.className = 'cheat_scroll_btn scb_down';
    downBtn.setAttribute('aria-label', 'Scroll down');
    downBtn.innerHTML = '▼';

    upBtn.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        e.preventDefault();
        container.scrollTop = Math.max(0, container.scrollTop - _scbStep());
    });
    upBtn.addEventListener('touchstart', function (e) {
        e.stopPropagation();
        e.preventDefault();
        container.scrollTop = Math.max(0, container.scrollTop - _scbStep());
    }, { passive: false });
    downBtn.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var maxScroll = Math.max(0, container.scrollHeight - container.clientHeight);
        container.scrollTop = Math.min(maxScroll, container.scrollTop + _scbStep());
    });
    downBtn.addEventListener('touchstart', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var maxScroll = Math.max(0, container.scrollHeight - container.clientHeight);
        container.scrollTop = Math.min(maxScroll, container.scrollTop + _scbStep());
    }, { passive: false });

    container.insertBefore(upBtn, container.firstChild);
    container.appendChild(downBtn);

    function toggle() { _scbToggle(upBtn, downBtn, container); }
    container.addEventListener('scroll', toggle, { passive: true });
    requestAnimationFrame(toggle);

    _scbCols.push({ col: undefined, up: upBtn, down: downBtn, target: container });
};

// Public refresh — re-evaluate all scroll button visibility
Cheat_Menu.refresh_scroll_buttons = _scbRefresh;


// Source: ui/builders/rows.js
// ============================================================
// Cheat Menu - UI Row Builders
// ============================================================

Cheat_Menu.addEvent = function (el, handler) {
    var sx = 0, sy = 0;
    el.addEventListener('mousedown', function (e) {
        sx = e.clientX;
        sy = e.clientY;
        e.preventDefault();
    });
    el.addEventListener('mouseup', function (e) {
        var dx = e.clientX - sx;
        var dy = e.clientY - sy;
        if (Math.abs(dx) < Cheat_Menu.DRAG_THRESHOLD && Math.abs(dy) < Cheat_Menu.DRAG_THRESHOLD) {
            handler(e);
        }
    });
    el.addEventListener('touchstart', function (e) {
        sx = e.changedTouches[0].clientX;
        sy = e.changedTouches[0].clientY;
    }, { passive: true });
    el.addEventListener('touchend', function (e) {
        var dx = e.changedTouches[0].clientX - sx;
        var dy = e.changedTouches[0].clientY - sy;
        if (Math.abs(dx) < Cheat_Menu.DRAG_THRESHOLD && Math.abs(dy) < Cheat_Menu.DRAG_THRESHOLD) {
            e.preventDefault();
            handler(e);
        }
    }, { passive: false });
};

Cheat_Menu.append_title = function (title) {
    var title_div = document.createElement('div');
    title_div.className = "cheat_menu_title";
    title_div.innerHTML = title;
    Cheat_Menu.content.appendChild(title_div);
};

// Page title registration (used by group_menus_by_umbrella to detect page names)
Cheat_Menu.append_cheat_title = function (name) {
    Cheat_Menu.append_title(name);
};

Cheat_Menu.append_description = function (text) {
    var desc_div = document.createElement('div');
    desc_div.className = "cheat_label";
    desc_div.style.textAlign = "center";
    desc_div.style.marginBottom = "10px";
    desc_div.innerHTML = text;
    Cheat_Menu.content.appendChild(desc_div);
};

Cheat_Menu.append_cheat = function (cheat_text, status_text, key, click_handler) {
    var row = document.createElement('div');
    row.className = "cheat_row";

    var label = document.createElement('div');
    label.className = "cheat_label";
    label.innerHTML = cheat_text;

    var btn = document.createElement('button');
    btn.className = "cheat_btn";
    btn.innerHTML = status_text;
    Cheat_Menu.addEvent(btn, click_handler);

    row.appendChild(label);
    row.appendChild(btn);

    Cheat_Menu.content.appendChild(row);
};

Cheat_Menu.append_scroll_selector = function (text, key1, key2, scroll_handler, apply_handler) {
    var row = document.createElement('div');
    row.className = "cheat_row";

    var btnLeft = document.createElement('button');
    btnLeft.className = "cheat_btn";
    btnLeft.innerHTML = "←";
    Cheat_Menu.addEvent(btnLeft, scroll_handler.bind(null, "left"));

    var centerText = document.createElement('div');
    centerText.className = "cheat_value";
    centerText.innerHTML = text;
    centerText.style.flex = "1";
    centerText.style.margin = "0 10px";

    var btnRight = document.createElement('button');
    btnRight.className = "cheat_btn";
    btnRight.innerHTML = "→";
    Cheat_Menu.addEvent(btnRight, scroll_handler.bind(null, "right"));

    row.appendChild(btnLeft);
    row.appendChild(centerText);
    row.appendChild(btnRight);

    if (apply_handler) {
        var btnApply = document.createElement('button');
        btnApply.className = "cheat_btn";
        btnApply.innerHTML = "Apply";
        btnApply.style.marginLeft = "10px";
        Cheat_Menu.addEvent(btnApply, apply_handler);
        row.appendChild(btnApply);
    }

    Cheat_Menu.content.appendChild(row);
};

Cheat_Menu.append_add_remove = function (text, amount, onApply) {
    var row = document.createElement('div');
    row.className = "cheat_row";

    var label = document.createElement('div');
    label.className = "cheat_label";
    label.innerHTML = text;

    var controls = document.createElement('div');
    controls.className = "cheat_controls";

    var btnRemove = document.createElement('button');
    btnRemove.className = "cheat_btn";
    btnRemove.innerHTML = "- " + amount;
    Cheat_Menu.addEvent(btnRemove, function () { onApply("left"); });

    var btnAdd = document.createElement('button');
    btnAdd.className = "cheat_btn";
    btnAdd.innerHTML = "+ " + amount;
    Cheat_Menu.addEvent(btnAdd, function () { onApply("right"); });

    controls.appendChild(btnRemove);
    controls.appendChild(btnAdd);

    row.appendChild(label);
    row.appendChild(controls);

    Cheat_Menu.content.appendChild(row);
};


// Source: ui/builders/settings.js
// ============================================================
// Cheat Menu - Settings & Bottom Bar Builders
// ============================================================

Cheat_Menu.append_bottom_bar_controls = function (labelText, onZero, onApply) {
    var row = document.createElement('div');
    row.className = "cheat_bottom_bar";

    var label = document.createElement('div');
    label.className = "cheat_label";
    label.style.flex = "0 0 auto";
    label.style.fontSize = "0.85em";
    label.innerHTML = labelText;

    var amtSelector = document.createElement('div');
    amtSelector.className = "cheat_controls";

    var btnL = document.createElement('button');
    btnL.className = "cheat_btn";
    btnL.innerHTML = "◄";
    Cheat_Menu.addEvent(btnL, function (e) {
        e.preventDefault();
        Cheat_Menu.scroll_amount("left");
    });

    var val = document.createElement('div');
    val.className = "cheat_value";
    val.style.minWidth = "30px";
    val.innerHTML = Cheat_Menu.amounts[Cheat_Menu.amount_index];

    var btnR = document.createElement('button');
    btnR.className = "cheat_btn";
    btnR.innerHTML = "►";
    Cheat_Menu.addEvent(btnR, function (e) {
        e.preventDefault();
        Cheat_Menu.scroll_amount("right");
    });

    var btnCustom = document.createElement('button');
    btnCustom.className = "cheat_btn";
    btnCustom.innerHTML = "…";
    btnCustom.title = "Custom amount";
    Cheat_Menu.addEvent(btnCustom, function (e) {
        e.preventDefault();
        var customVal = Cheat_Menu.amounts[Cheat_Menu.amount_index];
        Cheat_Menu.open_value_modal("Custom Amount", customVal, function (newVal) {
            if (!isNaN(newVal) && newVal >= 0) {
                for (var i = 0; i < Cheat_Menu.amounts.length; i++) {
                    if (Cheat_Menu.amounts[i] >= newVal) {
                        Cheat_Menu.amount_index = i;
                        break;
                    }
                    Cheat_Menu.amount_index = Cheat_Menu.amounts.length - 1;
                }
                Cheat_Menu.update_menu();
            }
        });
    });

    amtSelector.appendChild(btnL);
    amtSelector.appendChild(val);
    amtSelector.appendChild(btnR);
    amtSelector.appendChild(btnCustom);

    var actions = document.createElement('div');
    actions.className = "cheat_controls";

    var btnZero = document.createElement('button');
    btnZero.className = "cheat_btn";
    btnZero.innerHTML = "0";
    btnZero.style.minWidth = "30px";
    Cheat_Menu.addEvent(btnZero, function (e) {
        e.preventDefault();
        onZero();
    });

    var btnMinus = document.createElement('button');
    btnMinus.className = "cheat_btn";
    btnMinus.innerHTML = "-" + Cheat_Menu.amounts[Cheat_Menu.amount_index];
    btnMinus.style.minWidth = "40px";
    Cheat_Menu.addEvent(btnMinus, function (e) {
        e.preventDefault();
        onApply("left");
    });

    var btnPlus = document.createElement('button');
    btnPlus.className = "cheat_btn";
    btnPlus.innerHTML = "+" + Cheat_Menu.amounts[Cheat_Menu.amount_index];
    btnPlus.style.minWidth = "40px";
    Cheat_Menu.addEvent(btnPlus, function (e) {
        e.preventDefault();
        onApply("right");
    });

    actions.appendChild(btnZero);
    actions.appendChild(btnMinus);
    actions.appendChild(btnPlus);

    row.appendChild(label);
    amtSelector.style.marginRight = "10px";
    row.appendChild(amtSelector);
    row.appendChild(actions);
    Cheat_Menu.content.appendChild(row);
};

Cheat_Menu.append_setting_row = function (label, valueText, onLeft, onRight) {
    var row = document.createElement('div');
    row.className = "cheat_setting_row";

    var labelDiv = document.createElement('div');
    labelDiv.className = "cheat_label";
    labelDiv.innerHTML = label;

    var controls = document.createElement('div');
    controls.className = "cheat_controls";

    var btnLeft = document.createElement('button');
    btnLeft.className = "cheat_btn";
    btnLeft.innerHTML = "◄";
    if (onLeft) {
        Cheat_Menu.addEvent(btnLeft, function (e) {
            e.preventDefault();
            onLeft();
        });
    } else {
        btnLeft.style.visibility = "hidden";
    }

    var valDiv = document.createElement('div');
    valDiv.className = "cheat_value";
    valDiv.innerHTML = valueText;

    var btnRight = document.createElement('button');
    btnRight.className = "cheat_btn";
    btnRight.innerHTML = "►";
    if (onRight) {
        Cheat_Menu.addEvent(btnRight, function (e) {
            e.preventDefault();
            onRight();
        });
    } else {
        btnRight.style.visibility = "hidden";
    }

    controls.appendChild(btnLeft);
    controls.appendChild(valDiv);
    controls.appendChild(btnRight);

    row.appendChild(labelDiv);
    row.appendChild(controls);
    Cheat_Menu.content.appendChild(row);
};


// Source: menu/pages/sharedHandlers.js
// ============================================================
// Cheat Menu - Shared scroll/apply handlers (used by many pages)
// ============================================================

Cheat_Menu.scroll_amount = function (direction) {
    if (direction == "left") {
        Cheat_Menu.amount_index--;
        if (Cheat_Menu.amount_index < 0) {
            Cheat_Menu.amount_index = 0;
        }
        SoundManager.playSystemSound(2);
    } else {
        Cheat_Menu.amount_index++;
        if (Cheat_Menu.amount_index >= Cheat_Menu.amounts.length) {
            Cheat_Menu.amount_index = Cheat_Menu.amounts.length - 1;
        }
        SoundManager.playSystemSound(1);
    }
    Cheat_Menu.update_menu();
};

Cheat_Menu.append_amount_selection = function () {
    Cheat_Menu.append_title("Amount");
    var current_amount = "<font color='#0088ff'>" + Cheat_Menu.amounts[Cheat_Menu.amount_index] + "</font>";
    Cheat_Menu.append_scroll_selector(current_amount, null, null, Cheat_Menu.scroll_amount);
};

Cheat_Menu.scroll_actor = function (direction) {
    if (direction == "left") {
        Cheat_Menu.cheat_selected_actor--;
        if (Cheat_Menu.cheat_selected_actor < 0) {
            Cheat_Menu.cheat_selected_actor = $gameActors._data.length - 1;
        }
    } else {
        Cheat_Menu.cheat_selected_actor++;
        if (Cheat_Menu.cheat_selected_actor >= $gameActors._data.length) {
            Cheat_Menu.cheat_selected_actor = 0;
        }
    }
    SoundManager.playSystemSound(0);
    Cheat_Menu.update_menu();
};

Cheat_Menu.append_actor_selection = function () {
    Cheat_Menu.append_title("Actor");
    var actor_name;
    if ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor]._name) {
        actor_name = "<font color='#0088ff'>" + $gameActors._data[Cheat_Menu.cheat_selected_actor]._name + "</font>";
    } else {
        actor_name = "<font color='#ff0000'>NULL</font>";
    }
    Cheat_Menu.append_scroll_selector(actor_name, null, null, Cheat_Menu.scroll_actor);
};


// Source: menu/pages/combatVitals.js
// ============================================================
// Cheat Menu - Page: Combat & Vitals (Party + Enemy merged)
// ============================================================

Cheat_Menu.create_page_combat_vitals = function () {
    Cheat_Menu.append_cheat_title("Combat");

    Cheat_Menu.append_title("Party");
    var items = [
        { label: "HP 0", btn: "Alive", fn: function () { Cheat_Menu.set_party_hp(0, true); } },
        { label: "HP 1", btn: "Alive", fn: function () { Cheat_Menu.set_party_hp(1, true); } },
        { label: "Full HP", btn: "Alive", fn: function () { Cheat_Menu.recover_party_hp(true); } },
        { label: "HP 0", btn: "All", fn: function () { Cheat_Menu.set_party_hp(0, false); } },
        { label: "HP 1", btn: "All", fn: function () { Cheat_Menu.set_party_hp(1, false); } },
        { label: "Full HP", btn: "All", fn: function () { Cheat_Menu.recover_party_hp(false); } },
        { label: "MP 0", btn: "Alive", fn: function () { Cheat_Menu.set_party_mp(0, true); } },
        { label: "MP 1", btn: "Alive", fn: function () { Cheat_Menu.set_party_mp(1, true); } },
        { label: "Full MP", btn: "Alive", fn: function () { Cheat_Menu.recover_party_mp(true); } },
        { label: "MP 0", btn: "All", fn: function () { Cheat_Menu.set_party_mp(0, false); } },
        { label: "MP 1", btn: "All", fn: function () { Cheat_Menu.set_party_mp(1, false); } },
        { label: "Full MP", btn: "All", fn: function () { Cheat_Menu.recover_party_mp(false); } },
        { label: "TP 0", btn: "Alive", fn: function () { Cheat_Menu.set_party_tp(0, true); } },
        { label: "TP 1", btn: "Alive", fn: function () { Cheat_Menu.set_party_tp(1, true); } },
        { label: "Full TP", btn: "Alive", fn: function () { Cheat_Menu.recover_party_tp(true); } },
        { label: "TP 0", btn: "All", fn: function () { Cheat_Menu.set_party_tp(0, false); } },
        { label: "TP 1", btn: "All", fn: function () { Cheat_Menu.set_party_tp(1, false); } },
        { label: "Full TP", btn: "All", fn: function () { Cheat_Menu.recover_party_tp(false); } }
    ];

    var grid = document.createElement('div');
    grid.className = "cheat_action_grid";

    for (var i = 0; i < items.length; i++) {
        (function (item) {
            var cell = document.createElement('div');
            cell.className = "cheat_action_cell";

            var btn = document.createElement('button');
            btn.className = "cheat_btn";
            var tagClass = item.btn === 'All' ? 'tag-all' : 'tag-alive';
            btn.innerHTML = "<b>" + item.label + "</b><br><small class='" + tagClass + "'>" + item.btn + "</small>";
            btn.style.width = "100%";
            btn.style.height = "100%";
            btn.style.padding = "6px 4px";
            btn.style.lineHeight = "1.3";
            btn.style.whiteSpace = "normal";
            btn.style.wordBreak = "break-word";
            Cheat_Menu.addEvent(btn, function (e) {
                e.preventDefault();
                item.fn();
                SoundManager.playSystemSound(1);
                Cheat_Menu.update_menu();
            });

            cell.appendChild(btn);
            grid.appendChild(cell);
        })(items[i]);
    }

    Cheat_Menu.content.appendChild(grid);

    Cheat_Menu.append_title("Enemy");
    var enemyItems = [
        { label: "HP 0", btn: "Alive", fn: function () { Cheat_Menu.set_enemy_hp(0, true); } },
        { label: "HP 1", btn: "Alive", fn: function () { Cheat_Menu.set_enemy_hp(1, true); } },
        { label: "HP 0", btn: "All", fn: function () { Cheat_Menu.set_enemy_hp(0, false); } },
        { label: "HP 1", btn: "All", fn: function () { Cheat_Menu.set_enemy_hp(1, false); } }
    ];

    var enemyGrid = document.createElement('div');
    enemyGrid.className = "cheat_action_grid";

    for (var j = 0; j < enemyItems.length; j++) {
        (function (item) {
            var cell = document.createElement('div');
            cell.className = "cheat_action_cell";

            var btn = document.createElement('button');
            btn.className = "cheat_btn";
            var tagClass = item.btn === 'All' ? 'tag-all' : 'tag-alive';
            btn.innerHTML = "<b>" + item.label + "</b><br><small class='" + tagClass + "'>" + item.btn + "</small>";
            btn.style.width = "100%";
            btn.style.height = "100%";
            btn.style.padding = "6px 4px";
            btn.style.lineHeight = "1.3";
            btn.style.whiteSpace = "normal";
            btn.style.wordBreak = "break-word";
            Cheat_Menu.addEvent(btn, function (e) {
                e.preventDefault();
                item.fn();
                SoundManager.playSystemSound(1);
                Cheat_Menu.update_menu();
            });

            cell.appendChild(btn);
            enemyGrid.appendChild(cell);
        })(enemyItems[j]);
    }

    Cheat_Menu.content.appendChild(enemyGrid);
};


// Source: menu/pages/godMode.js
// ============================================================
// Cheat Menu - Page: God Mode
// ============================================================

Cheat_Menu.create_page_god_mode = function () {
    Cheat_Menu.append_cheat_title("God Mode");
    Cheat_Menu.append_actor_selection();
    Cheat_Menu.append_godmode_status();
    Cheat_Menu.append_cheat("All Party", "Toggle All", null, function () {
        var members = $gameParty.allMembers();
        var allOn = true;
        for (var i = 0; i < members.length; i++) {
            if (members[i] instanceof Game_Actor && !members[i].god_mode) {
                allOn = false;
                break;
            }
        }
        for (var i = 0; i < members.length; i++) {
            if (members[i] instanceof Game_Actor) {
                if (allOn) {
                    Cheat_Menu.god_mode_off(members[i]);
                } else {
                    Cheat_Menu.god_mode(members[i]);
                }
            }
        }
        SoundManager.playSystemSound(allOn ? 2 : 1);
        Cheat_Menu.update_menu();
    });
};

Cheat_Menu.append_godmode_status = function () {
    var status_text;
    if ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor].god_mode) {
        status_text = "<font color='#00ff00'>on</font>";
    } else {
        status_text = "<font color='#ff0000'>off</font>";
    }
    Cheat_Menu.append_cheat("Status:", status_text, null, Cheat_Menu.god_mode_toggle);
};


// Source: menu/pages/progression.js
// ============================================================
// Cheat Menu - Page: Progression (EXP + Stats + Gold merged)
// ============================================================

Cheat_Menu.create_page_progression = function () {
    Cheat_Menu.append_cheat_title("Progression");
    Cheat_Menu.append_actor_selection();

    // Stats
    var statRow = document.createElement('div');
    statRow.className = "cheat_sub_header";
    statRow.innerHTML = "Stats";
    Cheat_Menu.content.appendChild(statRow);

    var stat_string = "";
    if ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus) {
        if (Cheat_Menu.stat_selection >= $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus.length) {
            Cheat_Menu.stat_selection = 0;
        }
        stat_string += $dataSystem.terms.params[Cheat_Menu.stat_selection];
    }
    var row = document.createElement('div');
    row.className = "cheat_row";
    var btnL = document.createElement('button');
    btnL.className = "cheat_btn";
    btnL.innerHTML = "◄";
    Cheat_Menu.addEvent(btnL, function (e) {
        e.preventDefault();
        Cheat_Menu.scroll_stat("left");
    });
    var statLbl = document.createElement('div');
    statLbl.className = "cheat_value";
    statLbl.innerHTML = stat_string;
    statLbl.style.flex = "1";
    var btnR = document.createElement('button');
    btnR.className = "cheat_btn";
    btnR.innerHTML = "►";
    Cheat_Menu.addEvent(btnR, function (e) {
        e.preventDefault();
        Cheat_Menu.scroll_stat("right");
    });
    row.appendChild(btnL);
    row.appendChild(statLbl);
    row.appendChild(btnR);
    Cheat_Menu.content.appendChild(row);

    var statQty = ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus) ?
        $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus[Cheat_Menu.stat_selection] : 0;
    Cheat_Menu.append_bottom_bar_controls("Bonus: " + statQty,
        function () {
            Cheat_Menu.give_stat($gameActors._data[Cheat_Menu.cheat_selected_actor], Cheat_Menu.stat_selection, -statQty);
            Cheat_Menu.update_menu();
            SoundManager.playSystemSound(1);
        },
        Cheat_Menu.apply_current_stat
    );

    // EXP
    var expHeader = document.createElement('div');
    expHeader.className = "cheat_sub_header";
    expHeader.innerHTML = "EXP";
    Cheat_Menu.content.appendChild(expHeader);

    var expQty = $gameActors._data[Cheat_Menu.cheat_selected_actor] ? $gameActors._data[Cheat_Menu.cheat_selected_actor].currentExp() : 0;
    Cheat_Menu.append_bottom_bar_controls("EXP: " + expQty,
        function () {
            if ($gameActors._data[Cheat_Menu.cheat_selected_actor]) {
                Cheat_Menu.give_exp($gameActors._data[Cheat_Menu.cheat_selected_actor], -expQty);
                Cheat_Menu.update_menu();
                SoundManager.playSystemSound(1);
            }
        },
        Cheat_Menu.apply_current_exp
    );

    // Gold
    var goldHeader = document.createElement('div');
    goldHeader.className = "cheat_sub_header";
    goldHeader.innerHTML = "Gold";
    Cheat_Menu.content.appendChild(goldHeader);

    var goldQty = $gameParty._gold;
    Cheat_Menu.append_bottom_bar_controls("Gold: " + goldQty,
        function () {
            Cheat_Menu.give_gold(-goldQty);
            Cheat_Menu.update_menu();
            SoundManager.playSystemSound(1);
        },
        Cheat_Menu.apply_current_gold
    );
};

Cheat_Menu.scroll_stat = function (direction) {
    if ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus) {
        if (direction == "left") {
            Cheat_Menu.stat_selection--;
            if (Cheat_Menu.stat_selection < 0) {
                Cheat_Menu.stat_selection = $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus.length - 1;
            }
        } else {
            Cheat_Menu.stat_selection++;
            if (Cheat_Menu.stat_selection >= $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus.length) {
                Cheat_Menu.stat_selection = 0;
            }
        }
    } else {
        Cheat_Menu.stat_selection = 0;
    }
    SoundManager.playSystemSound(0);
    Cheat_Menu.update_menu();
};

Cheat_Menu.apply_current_stat = function (direction) {
    var amount = Cheat_Menu.amounts[Cheat_Menu.amount_index];
    if (direction == "left") {
        amount = -amount;
        SoundManager.playSystemSound(2);
    } else {
        SoundManager.playSystemSound(1);
    }
    Cheat_Menu.give_stat($gameActors._data[Cheat_Menu.cheat_selected_actor], Cheat_Menu.stat_selection, amount);
    Cheat_Menu.update_menu();
};

Cheat_Menu.apply_current_exp = function (direction) {
    var amount = Cheat_Menu.amounts[Cheat_Menu.amount_index];
    if (direction == "left") {
        amount = -amount;
        SoundManager.playSystemSound(2);
    } else {
        SoundManager.playSystemSound(1);
    }
    Cheat_Menu.give_exp($gameActors._data[Cheat_Menu.cheat_selected_actor], amount);
    Cheat_Menu.update_menu();
};

Cheat_Menu.apply_current_gold = function (direction) {
    var amount = Cheat_Menu.amounts[Cheat_Menu.amount_index];
    if (direction == "left") {
        amount = -amount;
        SoundManager.playSystemSound(2);
    } else {
        SoundManager.playSystemSound(1);
    }
    Cheat_Menu.give_gold(amount);
    Cheat_Menu.update_menu();
};


// Source: menu/pages/speed.js
// ============================================================
// Cheat Menu - Page: Movement (Speed + Noclip merged)
// ============================================================

Cheat_Menu.create_page_speed = function () {
    Cheat_Menu.append_cheat_title("Movement");
    Cheat_Menu.initialize_speed_lock();

    Cheat_Menu.append_title("Speed");
    var presets = [
        { label: "Slow", speed: 2 },
        { label: "Normal", speed: 4 },
        { label: "Fast", speed: 5 },
        { label: "Max", speed: 6 }
    ];
    var row = document.createElement('div');
    row.className = "cheat_row";
    row.style.flexWrap = "wrap";
    row.style.justifyContent = "center";
    for (var i = 0; i < presets.length; i++) {
        (function (p) {
            var btn = document.createElement('button');
            btn.className = "cheat_btn";
            btn.style.minWidth = "60px";
            btn.style.flex = "1";
            btn.innerHTML = p.label;
            Cheat_Menu.addEvent(btn, function (e) {
                e.preventDefault();
                Cheat_Menu.change_player_speed(p.speed - $gamePlayer._moveSpeed);
                SoundManager.playSystemSound(1);
                Cheat_Menu.update_menu();
            });
            row.appendChild(btn);
        })(presets[i]);
    }
    Cheat_Menu.content.appendChild(row);

    var currentSpeed = "<font color='#44cc55'>" + Cheat_Menu.speed + "</font>";
    Cheat_Menu.append_scroll_selector(currentSpeed, null, null, function (dir) {
        Cheat_Menu.change_player_speed(dir === "left" ? -1 : 1);
        SoundManager.playSystemSound(dir === "left" ? 2 : 1);
        Cheat_Menu.update_menu();
    });

    var lockText;
    if (!Cheat_Menu.speed_unlocked) {
        lockText = "<font color='#00ff00'>Locked</font>";
    } else {
        lockText = "<font color='#ff0000'>Unlocked</font>";
    }
    Cheat_Menu.append_cheat("Speed Lock", lockText, null, Cheat_Menu.apply_speed_lock_toggle);

    Cheat_Menu.append_title("No Clip");
    var ncText;
    if ($gamePlayer._through) {
        ncText = "<font color='#00ff00'>on</font>";
    } else {
        ncText = "<font color='#ff0000'>off</font>";
    }
    Cheat_Menu.append_cheat("Status:", ncText, null, Cheat_Menu.toggle_no_clip_status);
};

Cheat_Menu.apply_speed_lock_toggle = function () {
    Cheat_Menu.toggle_lock_player_speed();
    SoundManager.playSystemSound(Cheat_Menu.speed_unlocked ? 2 : 1);
    Cheat_Menu.update_menu();
};

Cheat_Menu.toggle_no_clip_status = function () {
    $gamePlayer._through = !($gamePlayer._through);
    SoundManager.playSystemSound($gamePlayer._through ? 1 : 2);
    Cheat_Menu.update_menu();
};


// Source: menu/pages/items.js
// ============================================================
// Cheat Menu - Page: Items
// ============================================================

Cheat_Menu.create_page_items = function () {
    Cheat_Menu.append_cheat_title("Items");
    Cheat_Menu.append_searchable_list(
        $dataItems,
        Cheat_Menu.item_selection,
        function (idx) {
            Cheat_Menu.item_selection = idx;
            SoundManager.playSystemSound(0);
            Cheat_Menu.update_menu();
        },
        function (item) { return item ? item.name : "NULL"; },
        true,
        function (idx) { return "x" + ($gameParty._items[idx] || 0); }
    );
    var qty = $gameParty._items[Cheat_Menu.item_selection] || 0;
    Cheat_Menu.append_bottom_bar_controls("Owned: " + qty,
        function () {
            Cheat_Menu.give_item(Cheat_Menu.item_selection, -qty);
            Cheat_Menu.update_menu();
            SoundManager.playSystemSound(1);
        },
        Cheat_Menu.apply_current_item
    );
};

Cheat_Menu.apply_current_item = function (direction) {
    var amount = Cheat_Menu.amounts[Cheat_Menu.amount_index];
    if (direction == "left") {
        amount = -amount;
        SoundManager.playSystemSound(2);
    } else {
        SoundManager.playSystemSound(1);
    }
    Cheat_Menu.give_item(Cheat_Menu.item_selection, amount);
    Cheat_Menu.update_menu();
};

// Source: menu/pages/weapons.js
// ============================================================
// Cheat Menu - Page: Weapons
// ============================================================

Cheat_Menu.create_page_weapons = function () {
    Cheat_Menu.append_cheat_title("Weapons");
    Cheat_Menu.append_searchable_list(
        $dataWeapons,
        Cheat_Menu.weapon_selection,
        function (idx) {
            Cheat_Menu.weapon_selection = idx;
            SoundManager.playSystemSound(0);
            Cheat_Menu.update_menu();
        },
        function (item) { return item ? item.name : "NULL"; },
        true,
        function (idx) { return "x" + ($gameParty._weapons[idx] || 0); }
    );
    var qty = $gameParty._weapons[Cheat_Menu.weapon_selection] || 0;
    Cheat_Menu.append_bottom_bar_controls("Owned: " + qty,
        function () {
            Cheat_Menu.give_weapon(Cheat_Menu.weapon_selection, -qty);
            Cheat_Menu.update_menu();
            SoundManager.playSystemSound(1);
        },
        Cheat_Menu.apply_current_weapon
    );
};

Cheat_Menu.apply_current_weapon = function (direction) {
    var amount = Cheat_Menu.amounts[Cheat_Menu.amount_index];
    if (direction == "left") {
        amount = -amount;
        SoundManager.playSystemSound(2);
    } else {
        SoundManager.playSystemSound(1);
    }
    Cheat_Menu.give_weapon(Cheat_Menu.weapon_selection, amount);
    Cheat_Menu.update_menu();
};

// Source: menu/pages/armors.js
// ============================================================
// Cheat Menu - Page: Armors
// ============================================================

Cheat_Menu.create_page_armors = function () {
    Cheat_Menu.append_cheat_title("Armors");
    Cheat_Menu.append_searchable_list(
        $dataArmors,
        Cheat_Menu.armor_selection,
        function (idx) {
            Cheat_Menu.armor_selection = idx;
            SoundManager.playSystemSound(0);
            Cheat_Menu.update_menu();
        },
        function (item) { return item ? item.name : "NULL"; },
        true,
        function (idx) { return "x" + ($gameParty._armors[idx] || 0); }
    );
    var qty = $gameParty._armors[Cheat_Menu.armor_selection] || 0;
    Cheat_Menu.append_bottom_bar_controls("Owned: " + qty,
        function () {
            Cheat_Menu.give_armor(Cheat_Menu.armor_selection, -qty);
            Cheat_Menu.update_menu();
            SoundManager.playSystemSound(1);
        },
        Cheat_Menu.apply_current_armor
    );
};

Cheat_Menu.apply_current_armor = function (direction) {
    var amount = Cheat_Menu.amounts[Cheat_Menu.amount_index];
    if (direction == "left") {
        amount = -amount;
        SoundManager.playSystemSound(2);
    } else {
        SoundManager.playSystemSound(1);
    }
    Cheat_Menu.give_armor(Cheat_Menu.armor_selection, amount);
    Cheat_Menu.update_menu();
};

// Source: menu/pages/variables.js
// ============================================================
// Cheat Menu - Page: Variables
// ============================================================

Cheat_Menu.create_page_variables = function () {
    Cheat_Menu.append_cheat_title("Variables");
    Cheat_Menu.append_searchable_list(
        $dataSystem.variables,
        Cheat_Menu.variable_selection,
        function (idx) {
            Cheat_Menu.variable_selection = idx;
            SoundManager.playSystemSound(0);
            Cheat_Menu.update_menu();

            var current_val = $gameVariables.value(idx);
            var title = idx + ": " + ($dataSystem.variables[idx] || ("Variable " + idx));
            if (typeof current_val === "string") {
                Cheat_Menu.open_text_modal(title, current_val || "", function (newVal) {
                    $gameVariables.setValue(idx, newVal);
                    SoundManager.playSystemSound(1);
                    Cheat_Menu.update_menu();
                });
            } else {
                Cheat_Menu.open_value_modal(title, current_val || 0, function (newVal) {
                    $gameVariables.setValue(idx, newVal);
                    SoundManager.playSystemSound(1);
                    Cheat_Menu.update_menu();
                });
            }
        },
        function (item, idx) { return item || "Variable " + idx; },
        true,
        function (idx) {
            return $gameVariables.value(idx);
        },
        false,
        'grid-wide'
    );
    var current_val = $gameVariables.value(Cheat_Menu.variable_selection);
    if (typeof current_val === "string") {
        Cheat_Menu.append_bottom_bar_controls("Text: " + (current_val || ""),
            function () {
                $gameVariables.setValue(Cheat_Menu.variable_selection, "");
                Cheat_Menu.update_menu();
                SoundManager.playSystemSound(1);
            },
            function () { }
        );
    } else {
        current_val = current_val || 0;
        Cheat_Menu.append_bottom_bar_controls("Value: " + current_val,
            function () {
                $gameVariables.setValue(Cheat_Menu.variable_selection, 0);
                Cheat_Menu.update_menu();
                SoundManager.playSystemSound(1);
            },
            Cheat_Menu.apply_current_variable
        );
    }
};

Cheat_Menu.apply_current_variable = function (direction) {
    var amount = Cheat_Menu.amounts[Cheat_Menu.amount_index];
    if (direction == "left") {
        amount = -amount;
        SoundManager.playSystemSound(2);
    } else {
        SoundManager.playSystemSound(1);
    }
    Cheat_Menu.set_variable(Cheat_Menu.variable_selection, amount);
    Cheat_Menu.update_menu();
};

// Source: menu/pages/switches.js
// ============================================================
// Cheat Menu - Page: Switches
// ============================================================

Cheat_Menu.create_page_switches = function () {
    Cheat_Menu.append_cheat_title("Switches");
    Cheat_Menu.append_searchable_list(
        $dataSystem.switches,
        Cheat_Menu.switch_selection,
        function (idx) {
            Cheat_Menu.switch_selection = idx;
            Cheat_Menu.toggle_switch(idx);
            if ($gameSwitches.value(idx)) {
                SoundManager.playSystemSound(1);
            } else {
                SoundManager.playSystemSound(2);
            }
            Cheat_Menu.update_menu();
        },
        function (item, idx) { return item || "Switch " + idx; },
        true,
        function (idx) {
            var val = $gameSwitches.value(idx);
            if (val) {
                return "<font color='#44cc55'>ON</font>";
            } else {
                return "<font color='#ff4444'>OFF</font>";
            }
        },
        false,
        'grid-wide'
    );
};


// Source: menu/pages/saveRecall.js
// ============================================================
// Cheat Menu - Save and Recall
// ============================================================

Cheat_Menu.create_page_save_recall = function () {
    Cheat_Menu.append_cheat_title("Save and Recall");

    for (var i = 0; i < Cheat_Menu.saved_positions.length; i++) {
        var pos = Cheat_Menu.saved_positions[i];
        var slotLabel = "Slot " + (i + 1) + ": ";
        if (pos.m !== -1) {
            var mapName = $dataMapInfos[pos.m] ? $dataMapInfos[pos.m].name : "Map " + pos.m;
            slotLabel += mapName + " (" + pos.x + ", " + pos.y + ")";
        } else {
            slotLabel += "Empty";
        }

        var row = document.createElement('div');
        row.className = "cheat_row";

        var label = document.createElement('div');
        label.className = "cheat_label";
        label.style.flex = "1";
        label.style.fontSize = "0.85em";
        label.style.overflow = "hidden";
        label.style.textOverflow = "ellipsis";
        label.style.whiteSpace = "nowrap";
        label.innerHTML = slotLabel;

        var controls = document.createElement('div');
        controls.className = "cheat_controls";

        var btnSave = document.createElement('button');
        btnSave.className = "cheat_btn";
        btnSave.innerHTML = "Save";
        btnSave.style.minWidth = "50px";
        Cheat_Menu.addEvent(btnSave, Cheat_Menu.save_position.bind(null, i));

        var btnRecall = document.createElement('button');
        btnRecall.className = "cheat_btn";
        btnRecall.innerHTML = "Recall";
        btnRecall.style.minWidth = "55px";
        if (pos.m !== -1) {
            btnRecall.style.borderColor = "#44cc55";
        } else {
            btnRecall.style.opacity = "0.4";
        }
        Cheat_Menu.addEvent(btnRecall, (function (slotIdx) {
            return function (e) {
                e.preventDefault();
                var p = Cheat_Menu.saved_positions[slotIdx];
                if (p.m === -1) {
                    SoundManager.playSystemSound(2);
                    return;
                }
                var mapName = $dataMapInfos[p.m] ? $dataMapInfos[p.m].name : "Map " + p.m;
                Cheat_Menu.open_confirm_modal(
                    "Teleport to " + mapName + " at (" + p.x + ", " + p.y + ")?",
                    function () {
                        Cheat_Menu.teleport(p.m, p.x, p.y);
                        SoundManager.playSystemSound(1);
                        Cheat_Menu.update_menu();
                    }
                );
            };
        })(i));

        controls.appendChild(btnSave);
        controls.appendChild(btnRecall);
        row.appendChild(label);
        row.appendChild(controls);
        Cheat_Menu.content.appendChild(row);
    }
};

Cheat_Menu.save_position = function (pos_num) {
    Cheat_Menu.saved_positions[pos_num].m = $gameMap.mapId();
    Cheat_Menu.saved_positions[pos_num].x = $gamePlayer.x;
    Cheat_Menu.saved_positions[pos_num].y = $gamePlayer.y;
    SoundManager.playSystemSound(1);
    Cheat_Menu.update_menu();
};


// Source: menu/pages/teleport.js
// ============================================================
// Cheat Menu - Page: Teleport
// ============================================================

Cheat_Menu.create_page_teleport = function () {
    Cheat_Menu.append_cheat_title("Teleport");

    Cheat_Menu.append_searchable_list(
        $dataMapInfos,
        Cheat_Menu.teleport_location.m,
        function (idx) {
            Cheat_Menu.teleport_location.m = idx;
            SoundManager.playSystemSound(0);
            Cheat_Menu.update_menu();
        },
        function (item, idx) { return item ? item.name : "Map " + idx; },
        true,
        function (idx) {
            if (idx === Cheat_Menu.teleport_location.m) {
                return "<font color='#44cc55'>selected</font>";
            }
            return "";
        }
    );

    Cheat_Menu.append_cheat("Current Position", "Fill", null, function () {
        Cheat_Menu.teleport_location.m = $gameMap.mapId();
        Cheat_Menu.teleport_location.x = $gamePlayer.x;
        Cheat_Menu.teleport_location.y = $gamePlayer.y;
        SoundManager.playSystemSound(0);
        Cheat_Menu.update_menu();
    });

    Cheat_Menu.append_scroll_selector("X: " + Cheat_Menu.teleport_location.x, null, null, Cheat_Menu.scroll_x_teleport_selection);
    Cheat_Menu.append_scroll_selector("Y: " + Cheat_Menu.teleport_location.y, null, null, Cheat_Menu.scroll_y_teleport_selection);
    function tpAction(e) { e.preventDefault(); Cheat_Menu.teleport_current_location(); }
    function tpClipAction(e) { e.preventDefault(); Cheat_Menu.teleport_current_location(); $gamePlayer._through = true; SoundManager.playSystemSound(1); }
    var tRow = document.createElement('div');
    tRow.className = "cheat_row";
    tRow.style.gap = "6px";
    var tBtn = document.createElement('button');
    tBtn.className = "cheat_btn";
    tBtn.style.flex = "1";
    tBtn.innerHTML = "Activate";
    Cheat_Menu.addEvent(tBtn, tpAction);
    tRow.appendChild(tBtn);
    var tnBtn = document.createElement('button');
    tnBtn.className = "cheat_btn";
    tnBtn.style.flex = "1";
    tnBtn.innerHTML = "TP+Clip";
    Cheat_Menu.addEvent(tnBtn, tpClipAction);
    tRow.appendChild(tnBtn);
    Cheat_Menu.content.appendChild(tRow);
};

Cheat_Menu.scroll_x_teleport_selection = function (direction) {
    if (direction == "left") {
        Cheat_Menu.teleport_location.x--;
        if (Cheat_Menu.teleport_location.x < 0) {
            Cheat_Menu.teleport_location.x = 255;
        }
    } else {
        Cheat_Menu.teleport_location.x++;
        if (Cheat_Menu.teleport_location.x > 255) {
            Cheat_Menu.teleport_location.x = 0;
        }
    }
    SoundManager.playSystemSound(0);
    Cheat_Menu.update_menu();
};

Cheat_Menu.scroll_y_teleport_selection = function (direction) {
    if (direction == "left") {
        Cheat_Menu.teleport_location.y--;
        if (Cheat_Menu.teleport_location.y < 0) {
            Cheat_Menu.teleport_location.y = 255;
        }
    } else {
        Cheat_Menu.teleport_location.y++;
        if (Cheat_Menu.teleport_location.y > 255) {
            Cheat_Menu.teleport_location.y = 0;
        }
    }
    SoundManager.playSystemSound(0);
    Cheat_Menu.update_menu();
};

Cheat_Menu.teleport_current_location = function () {
    Cheat_Menu.teleport(Cheat_Menu.teleport_location.m, Cheat_Menu.teleport_location.x, Cheat_Menu.teleport_location.y);
    SoundManager.playSystemSound(1);
    Cheat_Menu.update_menu();
};


// Source: menu/pages/clearStates.js
// ============================================================
// Cheat Menu - Page: Clear States
// ============================================================

Cheat_Menu.create_page_clear_states = function () {
    Cheat_Menu.append_cheat_title("Clear States");
    Cheat_Menu.append_cheat("Clear Party States", "Activate", null, function () {
        Cheat_Menu.clear_party_states();
        SoundManager.playSystemSound(1);
    });
    Cheat_Menu.append_actor_selection();
    Cheat_Menu.append_title("Current State");
    var number_states = 0;
    if ($gameActors._data[Cheat_Menu.cheat_selected_actor] &&
        $gameActors._data[Cheat_Menu.cheat_selected_actor]._states &&
        $gameActors._data[Cheat_Menu.cheat_selected_actor]._states.length >= 0) {
        number_states = $gameActors._data[Cheat_Menu.cheat_selected_actor]._states.length;
    } else {
        number_states = null;
    }
    Cheat_Menu.append_cheat("Number Effects:", number_states, null, function () {
        Cheat_Menu.clear_actor_states($gameActors._data[Cheat_Menu.cheat_selected_actor]);
        SoundManager.playSystemSound(1);
        Cheat_Menu.update_menu();
    });
};

// Source: menu/pages/general.js
// ============================================================
// Cheat Menu - Page: Interface (merged General + Interface)
// ============================================================

Cheat_Menu.create_page_general = function () {
    Cheat_Menu.append_cheat_title("Interface");

    Cheat_Menu.append_scroll_selector("Menu Position: " + Cheat_Menu.positions[Cheat_Menu.position], null, null, function (dir) {
        if (dir === "left") {
            Cheat_Menu.position--;
            if (Cheat_Menu.position < 0) Cheat_Menu.position = 4;
        } else {
            Cheat_Menu.position++;
            if (Cheat_Menu.position > 4) Cheat_Menu.position = 0;
        }
        SoundManager.playSystemSound(0);
        Cheat_Menu.update_menu();
    });

    Cheat_Menu.append_scroll_selector("Font Size: " + Cheat_Menu.fontSize + "px", null, null, function (dir) {
        if (dir === "left") Cheat_Menu.fontSize = Math.max(8, Cheat_Menu.fontSize - 1);
        else Cheat_Menu.fontSize = Math.min(24, Cheat_Menu.fontSize + 1);
        Cheat_Menu.overlay_box.style.fontSize = Cheat_Menu.fontSize + "px";
        SoundManager.playSystemSound(0);
        Cheat_Menu.update_menu();
    });

    Cheat_Menu.append_scroll_selector("Menu Scale Size: " + Cheat_Menu.menu_scale + "%", null, null, function (dir) {
        if (dir === "left") Cheat_Menu.menu_scale = Math.max(40, Cheat_Menu.menu_scale - 5);
        else Cheat_Menu.menu_scale = Math.min(100, Cheat_Menu.menu_scale + 5);
        Cheat_Menu.manual_menu_size = null;
        SoundManager.playSystemSound(0);
        Cheat_Menu.save_values();
        Cheat_Menu.update_menu();
    });

    Cheat_Menu.append_setting_row("Hover Toggle Button", Cheat_Menu.btn_config.enabled ? "ON" : "OFF", null,
        function () { Cheat_Menu.btn_config.enabled = !Cheat_Menu.btn_config.enabled; Cheat_Menu.update_menu(); }
    );
    if (Cheat_Menu.btn_config.enabled) {
        Cheat_Menu.append_setting_row("Toggle Button Position", Cheat_Menu.btn_positions[Cheat_Menu.btn_config.posIndex],
            function () {
                Cheat_Menu.btn_config.posIndex = (Cheat_Menu.btn_config.posIndex - 1 + Cheat_Menu.btn_positions.length) % Cheat_Menu.btn_positions.length;
                Cheat_Menu.update_menu();
            },
            function () {
                Cheat_Menu.btn_config.posIndex = (Cheat_Menu.btn_config.posIndex + 1) % Cheat_Menu.btn_positions.length;
                Cheat_Menu.update_menu();
            }
        );
        Cheat_Menu.append_setting_row("Toggle Button Opacity", Cheat_Menu.btn_config.opacity + "%",
            function () { Cheat_Menu.btn_config.opacity = Math.max(10, Cheat_Menu.btn_config.opacity - 10); Cheat_Menu.update_menu(); },
            function () { Cheat_Menu.btn_config.opacity = Math.min(100, Cheat_Menu.btn_config.opacity + 10); Cheat_Menu.update_menu(); }
        );
    }

};

// Source: menu/registry.js
// ============================================================
// Cheat Menu - Menu Registry & Umbrella Grouping
// ============================================================

Cheat_Menu.register_pages = function () {
    if (Cheat_Menu._pages_registered) return;
    Cheat_Menu._pages_registered = true;

    // Register all menu pages (order determines sidebar position before grouping)
    // Insert at front so menu order is as defined here
    Cheat_Menu.menus = [
        Cheat_Menu.create_page_combat_vitals,
        Cheat_Menu.create_page_god_mode,
        Cheat_Menu.create_page_speed,
        Cheat_Menu.create_page_enemy_hp,
        Cheat_Menu.create_page_party_vitals,
        Cheat_Menu.create_page_give_exp,
        Cheat_Menu.create_page_stats,
        Cheat_Menu.create_page_gold,
        Cheat_Menu.create_page_items,
        Cheat_Menu.create_page_weapons,
        Cheat_Menu.create_page_armors,
        Cheat_Menu.create_page_variables,
        Cheat_Menu.create_page_switches,
        Cheat_Menu.create_page_save_recall,
        Cheat_Menu.create_page_teleport,
        Cheat_Menu.create_page_clear_states,
        Cheat_Menu.create_page_general
    ];
};

Cheat_Menu.inject_ui_settings = function () {
    Cheat_Menu.menus.push(function () {
        Cheat_Menu.append_cheat_title("Quick Actions HUD");
        Cheat_Menu.append_setting_row("Enable", Cheat_Menu.hud_config.enabled ? "ON" : "OFF", null,
            function () { Cheat_Menu.hud_config.enabled = !Cheat_Menu.hud_config.enabled; Cheat_Menu.update_menu(); }
        );
        if (Cheat_Menu.hud_config.enabled) {
            Cheat_Menu.append_setting_row("Opacity", Cheat_Menu.hud_config.opacity + "%",
                function () { Cheat_Menu.hud_config.opacity = Math.max(0, Cheat_Menu.hud_config.opacity - 10); Cheat_Menu.update_menu(); },
                function () { Cheat_Menu.hud_config.opacity = Math.min(100, Cheat_Menu.hud_config.opacity + 10); Cheat_Menu.update_menu(); }
            );
            Cheat_Menu.append_setting_row("Font Size", Cheat_Menu.hud_config.fontSize + "px",
                function () { Cheat_Menu.hud_config.fontSize = Math.max(8, Cheat_Menu.hud_config.fontSize - 1); Cheat_Menu.update_menu(); },
                function () { Cheat_Menu.hud_config.fontSize = Math.min(24, Cheat_Menu.hud_config.fontSize + 1); Cheat_Menu.update_menu(); }
            );
            var layoutLabel = Cheat_Menu.hud_config.layout === 'vertical' ? 'Vertical' : 'Horizontal';
            Cheat_Menu.append_setting_row("Layout", layoutLabel,
                function () { Cheat_Menu.hud_config.layout = 'vertical'; Cheat_Menu.update_menu(); },
                function () { Cheat_Menu.hud_config.layout = 'horizontal'; Cheat_Menu.update_menu(); }
            );
            var posList = ['Top', 'Bottom', 'Left', 'Right'];
            var posIdx = posList.indexOf(Cheat_Menu.hud_config.position);
            if (posIdx === -1) posIdx = 0;
            Cheat_Menu.append_setting_row("Position", Cheat_Menu.hud_config.position,
                function () {
                    var idx = posList.indexOf(Cheat_Menu.hud_config.position) - 1;
                    if (idx < 0) idx = posList.length - 1;
                    Cheat_Menu.hud_config.position = posList[idx];
                    Cheat_Menu.hud_config.freePos = null;
                    Cheat_Menu.update_menu();
                    Cheat_Menu.save_values();
                },
                function () {
                    var idx = posList.indexOf(Cheat_Menu.hud_config.position) + 1;
                    if (idx >= posList.length) idx = 0;
                    Cheat_Menu.hud_config.position = posList[idx];
                    Cheat_Menu.hud_config.freePos = null;
                    Cheat_Menu.update_menu();
                    Cheat_Menu.save_values();
                }
            );
            if (Cheat_Menu.hud_config.freePos) {
                Cheat_Menu.append_cheat("Reset Position", "Reset", null, function () {
                    Cheat_Menu.hud_config.freePos = null;
                    Cheat_Menu.update_menu();
                });
            }

            Cheat_Menu.append_title("Active Buttons");
            var grid = document.createElement('div');
            grid.className = "cheat_settings_grid";
            var keys = Object.keys(Cheat_Menu.hud_actions);
            for (var i = 0; i < keys.length; i++) {
                let k = keys[i];
                let isActive = Cheat_Menu.hud_config.active.indexOf(k) !== -1;
                var btn = document.createElement('button');
                btn.className = "cheat_btn" + (isActive ? " active" : "");
                btn.style.width = "100%";
                btn.style.padding = "8px 4px";
                btn.style.backgroundColor = isActive ? "rgba(68, 204, 85, 0.3)" : "";
                btn.style.borderColor = isActive ? "#44cc55" : "";
                btn.innerHTML = Cheat_Menu.hud_actions[k].title;
                (function (key, active) {
                    var toggleButton = function (e) {
                        e.preventDefault();
                        if (active) {
                            Cheat_Menu.hud_config.active.splice(Cheat_Menu.hud_config.active.indexOf(key), 1);
                        } else {
                            Cheat_Menu.hud_config.active.push(key);
                        }
                        Cheat_Menu.update_menu();
                    };
                    btn.addEventListener('mousedown', toggleButton);
                    btn.addEventListener('touchstart', toggleButton, { passive: false });
                })(k, isActive);
                grid.appendChild(btn);
            }
            Cheat_Menu.content.appendChild(grid);
        }
    });
};

Cheat_Menu.group_menus_by_umbrella = function () {

    var rawNames = [];
    var real_append = Cheat_Menu.append_cheat_title;
    Cheat_Menu.append_cheat_title = function (name) {
        rawNames.push(name);
    };

    var old_content = Cheat_Menu.content;
    Cheat_Menu.content = document.createElement('div');

    for (var i = 0; i < Cheat_Menu.menus.length; i++) {
        var len = rawNames.length;
        try { Cheat_Menu.menus[i](); } catch (e) { /* silent — skip broken page */ }
        if (rawNames.length === len) {
            rawNames.push("Menu " + (i + 1));
        }
    }

    Cheat_Menu.append_cheat_title = real_append;
    Cheat_Menu.content = old_content;
    Cheat_Menu._debug_rawNames = rawNames;
    if (typeof console !== 'undefined') console.log('[CheatMenu] group rawNames:', JSON.stringify(rawNames));

    var rawMenus = Cheat_Menu.menus.slice();

    var groups = {
        "Inventory": { keys: ["items", "weapon", "armor"], items: [] },
        "Combat & Vitals": { keys: ["hp", "mp", "tp", "enemy", "party", "god mode", "god", "clear", "state", "states", "combat"], items: [] },
        "Progression": { keys: ["exp", "stat", "gold"], items: [] },
        "Variables & Switches": { keys: ["variable", "switch"], items: [] },
        "Movement": { keys: ["movement", "no clip", "speed", "noclip"], items: [] },
        "Navigation": { keys: ["save and recall", "teleport", "recall"], items: [] },
        "Settings": { keys: ["settings", "interface", "quick actions hud", "general"], items: [] }
    };

    var isMatch = function (name, keys) {
        var lower = name.toLowerCase();
        for (var k = 0; k < keys.length; k++) {
            if (lower.indexOf(keys[k]) !== -1) return true;
        }
        return false;
    };

    var uncategorized = [];
    for (var i = 0; i < rawNames.length; i++) {
        var n = rawNames[i];
        var fn = rawMenus[i];
        var matched = false;
        for (var g in groups) {
            if (isMatch(n, groups[g].keys)) {
                groups[g].items.push({ name: n, fn: fn });
                matched = true;
                break;
            }
        }
        if (!matched) {
            uncategorized.push({ name: n, fn: fn });
        }
    }

    var newMenus = [];
    var newNames = [];

    var createUmbrella = function (title, items) {
        if (items.length === 0) return;

        newMenus.push(function () {
            var nav = document.createElement('div');
            nav.className = "cheat_sub_nav";

            if (!Cheat_Menu.sub_tab_per_group) Cheat_Menu.sub_tab_per_group = {};
            var subIdx = Cheat_Menu.sub_tab_per_group[title] || 0;
            if (subIdx >= items.length) subIdx = 0;

            for (var j = 0; j < items.length; j++) {
                let btn = document.createElement('button');
                btn.className = "cheat_sub_tab" + (subIdx === j ? " active" : "");
                btn.innerHTML = items[j].name;
                let idx = j;

                var tabFn = function (e) {
                    e.preventDefault();
                    if (subIdx !== idx) {
                        Cheat_Menu.sub_tab_per_group[title] = idx;
                        Cheat_Menu.list_state = { search: "", scroll: 0 };
                        SoundManager.playSystemSound(0);
                        Cheat_Menu.update_menu();
                    }
                };
                btn.addEventListener('mousedown', tabFn);
                btn.addEventListener('touchstart', tabFn, { passive: false });

                nav.appendChild(btn);
            }

            Cheat_Menu.content.appendChild(nav);

            var old_append = Cheat_Menu.append_cheat_title;
            Cheat_Menu.append_cheat_title = function () { };
            items[subIdx].fn();
            Cheat_Menu.append_cheat_title = old_append;
        });

        newNames.push(title);
    };

    createUmbrella("Inventory", groups["Inventory"].items);
    createUmbrella("Combat & Vitals", groups["Combat & Vitals"].items);
    createUmbrella("Progression", groups["Progression"].items);
    createUmbrella("Variables & Switches", groups["Variables & Switches"].items);
    createUmbrella("Movement", groups["Movement"].items);
    createUmbrella("Navigation", groups["Navigation"].items);
    createUmbrella("Settings", groups["Settings"].items);

    for (var k = 0; k < uncategorized.length; k++) {
        newMenus.push(uncategorized[k].fn);
        newNames.push(uncategorized[k].name);
    }

    Cheat_Menu.menus = newMenus;
    Cheat_Menu.menu_names = newNames;
    if (typeof console !== 'undefined') console.log('[CheatMenu] sidebar names:', JSON.stringify(newNames));

    if (Cheat_Menu.cheat_selected >= Cheat_Menu.menus.length) {
        Cheat_Menu.cheat_selected = 0;
    }

    Cheat_Menu._debug_menu_names = newNames;
};

// Source: menu/renderer.js
// ============================================================
// Cheat Menu - Renderer (update_menu)
// ============================================================

Cheat_Menu.update_menu = function () {
    // Group menus on first call (game data is loaded by now)
    if (!Cheat_Menu._menus_grouped && Cheat_Menu.menus.length > 0) {
        Cheat_Menu.inject_ui_settings();
        Cheat_Menu.group_menus_by_umbrella();
        Cheat_Menu._menus_grouped = true;
    }

    if (!Cheat_Menu.menus || Cheat_Menu.menus.length === 0) return;
    if (!Cheat_Menu.menu_names || Cheat_Menu.menu_names.length === 0) return;

    if (Cheat_Menu.cheat_selected < 0 || Cheat_Menu.cheat_selected >= Cheat_Menu.menus.length) {
        Cheat_Menu.cheat_selected = 0;
    }

    // Clear current content
    Cheat_Menu.sidebar.innerHTML = "";
    Cheat_Menu.content.innerHTML = "";

    // Build Sidebar
    var names = Cheat_Menu.get_menu_names();
    for (var i = 0; i < names.length; i++) {
        let btn = document.createElement('button');
        btn.className = "sidebar_btn" + (Cheat_Menu.cheat_selected === i ? " active" : "");
        btn.innerHTML = names[i];
        let idx = i;
        var sidebarFn = function (e) {
            e.preventDefault();
            if (Cheat_Menu.cheat_selected !== idx) {
                Cheat_Menu.cheat_selected = idx;
                Cheat_Menu.list_state = { search: "", scroll: 0 };
                SoundManager.playSystemSound(0);
                Cheat_Menu.update_menu();
            }
        };
        btn.addEventListener('mousedown', sidebarFn);
        btn.addEventListener('touchstart', sidebarFn, { passive: false });
        Cheat_Menu.sidebar.appendChild(btn);
    }

    // Render current menu
    Cheat_Menu.menus[Cheat_Menu.cheat_selected]();

    // Position and size
    Cheat_Menu.position_menu();
    Cheat_Menu.update_menu_size();

    // Update overlay elements
    Cheat_Menu.render_hover_button();
    Cheat_Menu.render_quick_hud();

    // Attach scroll buttons for touch/mouse
    requestAnimationFrame(function () {
        Cheat_Menu.add_sidebar_scroll_buttons(Cheat_Menu.sidebar);
        Cheat_Menu.add_scroll_buttons(Cheat_Menu.content);

        var searchContainers = document.querySelectorAll('.cheat_search_container');
        for (var i = 0; i < searchContainers.length; i++) {
            var list = searchContainers[i].querySelector('.cheat_list');
            if (list) {
                Cheat_Menu.add_list_scroll_buttons(list);
            }
        }

        Cheat_Menu.refresh_scroll_buttons();
    });
};

// Source: input/keyboard.js
// ============================================================
// Cheat Menu - Keyboard Input Handler
// ============================================================

window.addEventListener("keydown", function (event) {
    if (!event.ctrlKey && !event.altKey && (event.keyCode === 119) && $gameTemp && !$gameTemp.isPlaytest()) {
        // F8 - Open dev tools
        event.stopPropagation();
        event.preventDefault();
        require('nw.gui').Window.get().showDevTools();
    } else if (!event.altKey && !event.ctrlKey && !event.shiftKey && (event.keyCode === 120) && $gameTemp && !$gameTemp.isPlaytest()) {
        // F9 - Trick game into playtest mode to open debug menu
        $gameTemp._isPlaytest = true;
        setTimeout(function () {
            $gameTemp._isPlaytest = false;
        }, 100);
    } else if (Cheat_Menu.overlay_openable && !event.altKey && !event.ctrlKey && !event.shiftKey) {
        // Key '1' (49) to open/close menu
        if (event.keyCode == Cheat_Menu.keyCodes.KEYCODE_1.keyCode) {
            if (!Cheat_Menu.initialized) {
                // Clean up god mode intervals from previous session
                for (var i = 0; i < $gameActors._data.length; i++) {
                    if ($gameActors._data[i]) {
                        $gameActors._data[i].god_mode = false;
                        if ($gameActors._data[i].god_mode_interval) {
                            clearInterval($gameActors._data[i].god_mode_interval);
                        }
                    }
                }

                // Reset to initial values, then overlay saved values
                Cheat_Menu.reset_to_initial();
                Cheat_Menu.load_saved_values();

                // If speed is locked, initialize for effect
                if (Cheat_Menu.speed_unlocked == false) {
                    Cheat_Menu.initialize_speed_lock();
                }

                Cheat_Menu.initialized = true;
            }

            if (!Cheat_Menu.cheat_menu_open) {
                Cheat_Menu.open_menu();
            } else {
                Cheat_Menu.close_menu();
            }
        }

        // Navigate and activate cheats
        else if (Cheat_Menu.cheat_menu_open) {
            // Tilde to cycle menu position
            if (event.keyCode == Cheat_Menu.keyCodes.KEYCODE_TILDE.keyCode) {
                Cheat_Menu.position++;
                if (Cheat_Menu.position > 4) {
                    Cheat_Menu.position = 0;
                }
                Cheat_Menu.update_menu();
            } else {
                // Check key listeners
                for (var keyCode in Cheat_Menu.keyCodes) {
                    if (event.keyCode == Cheat_Menu.keyCodes[keyCode].keyCode) {
                        var listener = Cheat_Menu.keyCodes[keyCode].key_listener;
                        if (Cheat_Menu.key_listeners[listener]) {
                            Cheat_Menu.key_listeners[listener](event);
                        }
                    }
                }
            }
        }
    }
});

// Source: core/init.js
// ============================================================
// Cheat Menu - Initialization & Game Hooks
// ============================================================

// Main initialization - called on new game and load game
Cheat_Menu.initialize = function () {
    Cheat_Menu.overlay_openable = true;
    Cheat_Menu.initialized = false;
    Cheat_Menu.cheat_menu_open = false;
    Cheat_Menu.speed_initialized = false;
    Cheat_Menu._menus_grouped = false;
    Cheat_Menu.sub_tab_per_group = {};
    Cheat_Menu.list_state = { search: "", scroll: 0 };

    // Remove any existing menu from DOM
    if (Cheat_Menu.overlay_box && Cheat_Menu.overlay_box.parentNode) {
        Cheat_Menu.overlay_box.remove();
    }

    // Clear any existing update timer
    if (Cheat_Menu.menu_update_timer) {
        clearInterval(Cheat_Menu.menu_update_timer);
        Cheat_Menu.menu_update_timer = null;
    }

    // Reset page registry so grouping re-collects flat page list on next menu open
    Cheat_Menu._pages_registered = false;
    // Register page functions (safe - no game data access)
    Cheat_Menu.register_pages();

    // Ensure configs have proper defaults (state.js runs before constants.js at parse time)
    Cheat_Menu.btn_config = { ...Cheat_Menu.default_btn_config, ...Cheat_Menu.btn_config };
    Cheat_Menu.hud_config = { ...Cheat_Menu.default_hud_config, ...Cheat_Menu.hud_config };

    // Render hover button after a short delay (game canvas ready)
    setTimeout(Cheat_Menu.render_hover_button, 1000);
};

// Hook: Load Game
DataManager.default_loadGame = DataManager.loadGame;
DataManager.loadGame = function (savefileId) {
    Cheat_Menu.initialize();
    var result = DataManager.default_loadGame(savefileId);
    Cheat_Menu.load_saved_values();
    Cheat_Menu.initialize_speed_lock();
    return result;
};

// Hook: New Game
DataManager.default_setupNewGame = DataManager.setupNewGame;
DataManager.setupNewGame = function () {
    Cheat_Menu.initialize();
    DataManager.default_setupNewGame();
};

// Hook: Save Game
DataManager.default_saveGame = DataManager.saveGame;
DataManager.saveGame = function (savefileId) {
    Cheat_Menu.save_values();
    return DataManager.default_saveGame(savefileId);
};

// Window resize handler for menu positioning
window.addEventListener("resize", function () {
    if (Cheat_Menu.overlay_box && Cheat_Menu.cheat_menu_open) {
        Cheat_Menu.position_menu();
        Cheat_Menu.update_menu_size();
        Cheat_Menu.refresh_scroll_buttons();
    }
});

// Global observer to catch native hotkeys closing the menu (Escape, Right Click)
document.addEventListener('keydown', function () {
    setTimeout(Cheat_Menu.check_menu_state, 50);
});
document.addEventListener('mousedown', function () {
    setTimeout(Cheat_Menu.check_menu_state, 50);
});

Cheat_Menu.check_menu_state = function () {
    var isActuallyOpen = Cheat_Menu.overlay_box &&
        document.body.contains(Cheat_Menu.overlay_box) &&
        Cheat_Menu.overlay_box.style.display !== "none";

    if (Cheat_Menu.cheat_menu_open && !isActuallyOpen) {
        Cheat_Menu.cheat_menu_open = false;
        Cheat_Menu.render_quick_hud();
    }
};

