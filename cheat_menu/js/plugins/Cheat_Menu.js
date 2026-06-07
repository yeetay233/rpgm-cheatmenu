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

Cheat_Menu.pinned_items = [];
Cheat_Menu.pinned_weapons = [];
Cheat_Menu.pinned_armors = [];
Cheat_Menu.pinned_variables = [];
Cheat_Menu.pinned_switches = [];
Cheat_Menu.pinned_teleport_maps = [];

Cheat_Menu.savestates = new Array(10).fill(null);
Cheat_Menu.quick_savestate = null;

Cheat_Menu.saved_positions = [{ m: -1, x: -1, y: -1 }, { m: -1, x: -1, y: -1 }, { m: -1, x: -1, y: -1 }, { m: -1, x: -1, y: -1 }, { m: -1, x: -1, y: -1 }, { m: -1, x: -1, y: -1 }, { m: -1, x: -1, y: -1 }, { m: -1, x: -1, y: -1 }, { m: -1, x: -1, y: -1 }, { m: -1, x: -1, y: -1 }];
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
    'sub_tab_per_group', 'list_state', '_page_titles', 'savestates', 'quick_savestate'
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
    // Pad saved_positions to 10 for backward compatibility with older saves
    if (Cheat_Menu.saved_positions) {
        while (Cheat_Menu.saved_positions.length < 10) {
            Cheat_Menu.saved_positions.push({ m: -1, x: -1, y: -1 });
        }
    }
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
    pinned_items: [],
    pinned_weapons: [],
    pinned_armors: [],
    pinned_variables: [],
    pinned_switches: [],
    pinned_teleport_maps: [],
    savestates: new Array(10).fill(null),
    quick_savestate: null,
    saved_positions: [{ m: -1, x: -1, y: -1 }, { m: -1, x: -1, y: -1 }, { m: -1, x: -1, y: -1 }, { m: -1, x: -1, y: -1 }, { m: -1, x: -1, y: -1 }, { m: -1, x: -1, y: -1 }, { m: -1, x: -1, y: -1 }, { m: -1, x: -1, y: -1 }, { m: -1, x: -1, y: -1 }, { m: -1, x: -1, y: -1 }],
    teleport_location: { m: 1, x: 0, y: 0 },
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
    if (Cheat_Menu.speed === null || typeof Cheat_Menu.speed !== 'number') {
        Cheat_Menu.speed_initialized = false;
    }
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

// Source: cheats/savestate.js
// ============================================================
// Cheat Menu - Savestate (disk-backed via hidden slot 99)
// ============================================================

(function () {
    // Suppress event-starting on the first frame after a savestate load so the
    // restored state isn't corrupted by autorun/parallel events that already ran
    // before the capture.  We patch setupStartingMapEvent (instead of
    // setupStartingEvent) because MV's Scene_Map.start() calls
    // setupStartingMapEvent directly, bypassing the wrapper.
    var _setupStartingMapEvent = Game_Map.prototype.setupStartingMapEvent;
    Game_Map.prototype.setupStartingMapEvent = function () {
        if (this._savestateSuppress) {
            this._savestateSuppress = false;
            return false;
        }
        return _setupStartingMapEvent.call(this);
    };

    // Detect engine: MZ uses async StorageManager with string saveNames,
    // MV uses sync StorageManager with numeric savefileIds.
    var _isMZ = typeof StorageManager._forageKeys !== "undefined";

    Cheat_Menu.capture_savestate = function () {
        if (!DataManager || !DataManager.makeSaveContents) return null;
        var scene = SceneManager._scene;
        if (!(scene instanceof Scene_Map)) return null;
        try {
            var contents = DataManager.makeSaveContents();
            // MZ's makeSaveContents excludes $gameTemp, $gameMessage,
            // $gameTroop; MV includes message/troop but not temp.  We stash
            // all three so _finishLoad can restore them on either engine.
            contents.temp = $gameTemp;
            contents.message = $gameMessage;
            contents.troop = $gameTroop;
            // Save menu tab state so load restores the correct umbrella tab
            if (typeof Cheat_Menu !== "undefined") {
                contents._cheatMenuTab = {
                    cheat_selected: Cheat_Menu.cheat_selected,
                    sub_tab_per_group: JSON.parse(JSON.stringify(Cheat_Menu.sub_tab_per_group)),
                    list_state: JSON.parse(JSON.stringify(Cheat_Menu.list_state)),
                    speed_unlocked: Cheat_Menu.speed_unlocked
                };
                // Save the currently playing BGM so we can replay it on load
                if (typeof AudioManager !== "undefined" && AudioManager.saveBgm) {
                    contents._cheatMenuBgm = AudioManager.saveBgm();
                }
            }
            return JsonEx.parse(JsonEx.stringify(contents));
        } catch (e) {
            return null;
        }
    };

    // Persist all savestates to localStorage so they survive page reload / game restart.
    // Persist all savestates to localStorage so they survive page reload / game restart.
    Cheat_Menu.persist_savestates = function () {
        try {
            var data = {
                _version: 2,
                savestates: Cheat_Menu.savestates,
                quick_savestate: Cheat_Menu.quick_savestate
            };
            var json = JsonEx.stringify(data);
            localStorage.setItem('Cheat_Menu_savestates', json);
        } catch (e) {
            // If we can't serialize (e.g. JsonEx not ready or data too large),
            // remove stale data so we don't load corrupted state next session.
            try { localStorage.removeItem('Cheat_Menu_savestates'); } catch (e2) {}
        }
    };

    // Restore savestates from localStorage (called during init).
    Cheat_Menu.restore_savestates = function () {
        try {
            var raw = localStorage.getItem('Cheat_Menu_savestates');
            if (!raw) return;
            var data = JsonEx.parse(raw);
            // Version check — discard data from old serialization format (pre-JsonEx)
            if (data._version !== 2) {
                localStorage.removeItem('Cheat_Menu_savestates');
                return;
            }
            if (data.savestates && data.savestates.length === 10) {
                // Validate that each non-null slot has engine-critical properties
                var valid = true;
                for (var i = 0; i < data.savestates.length; i++) {
                    var s = data.savestates[i];
                    if (s && (!s.map || !s.player || !s.system)) {
                        valid = false;
                        break;
                    }
                }
                if (valid) {
                    Cheat_Menu.savestates = data.savestates;
                }
            }
            if (data.quick_savestate !== undefined) {
                var q = data.quick_savestate;
                if (q && (!q.map || !q.player || !q.system)) {
                    Cheat_Menu.quick_savestate = null;
                } else {
                    Cheat_Menu.quick_savestate = q;
                }
            }
        } catch (e) {
            // Corrupt or unavailable data — keep defaults
            try { localStorage.removeItem('Cheat_Menu_savestates'); } catch (e2) {}
        }
    };

    // Write the savestate to hidden slot 99, then run the full engine save-load
    // pipeline (DataManager.loadGame) so all plugin onLoad hooks fire.
    Cheat_Menu.load_savestate = function (savestate) {
        if (!savestate) return;
        if (!savestate.map || !savestate.player || !savestate.system) return;
        if (!(SceneManager._scene instanceof Scene_Map)) {
            SoundManager.playSystemSound(2);
            return;
        }
        try {
            // Close the menu silently
            if (Cheat_Menu.overlay_box) {
                Cheat_Menu.overlay_box.style.display = "none";
                Cheat_Menu.overlay_box.remove();
            }
            Cheat_Menu.cheat_menu_open = false;

            if (_isMZ) {
                Cheat_Menu._mzSaveLoad(savestate);
            } else {
                Cheat_Menu._mvSaveLoad(savestate);
            }
        } catch (e) {
            if (typeof console !== "undefined" && console.error) {
                console.error("Cheat_Menu load_savestate error:", e);
            }
            SoundManager.playSystemSound(2);
        }
    };

    // --- MZ path (async) ---
    // StorageManager.saveObject(saveName, object) returns a Promise.
    // DataManager.loadGame(savefileId) returns a Promise.
    Cheat_Menu._mzSaveLoad = function (savestate) {
        var saveName = DataManager.makeSavename(99);
        StorageManager.saveObject(saveName, savestate)
            .then(function () {
                return DataManager.loadGame(99);
            })
            .then(function () {
                Cheat_Menu._finishLoad(savestate);
            })
            .catch(function (e) {
                if (typeof console !== "undefined" && console.error) {
                    console.error("Cheat_Menu MZ savestate error:", e);
                }
                SoundManager.playSystemSound(2);
            });
    };

    // --- MV path (synchronous) ---
    // The engine's loadGameWithoutRescue calls loadGlobalInfo() which loads
    // from StorageManager.load(0), then checks isThisGameFile(savefileId)
    // which requires globalInfo[savefileId] to exist.  We must write an
    // entry to the globalInfo store (slot 0) before calling loadGame.
    Cheat_Menu._mvSaveLoad = function (savestate) {
        try {
            var json = JsonEx.stringify(savestate);

            // 1. Write the savestate data to hidden slot 99.
            StorageManager.save(99, json);

            // 2. Register slot 99 in globalInfo so isThisGameFile accepts it.
            var globalInfo = DataManager.loadGlobalInfo() || [];
            globalInfo[99] = {
                globalId: DataManager._globalId,
                title: $dataSystem ? $dataSystem.gameTitle : "",
                characters: [],
                faces: [],
                playtime: "",
                timestamp: Date.now()
            };
            DataManager.saveGlobalInfo(globalInfo);

            // 3. Run the engine's sync load pipeline.
            DataManager.loadGame(99);
            Cheat_Menu._finishLoad(savestate);
        } catch (e) {
            if (typeof console !== "undefined" && console.error) {
                console.error("Cheat_Menu MV savestate error:", e);
            }
            SoundManager.playSystemSound(2);
        }
    };

    // Post-load restoration: extras that extractSaveContents doesn't cover,
    // mid-dialogue interpreter fix, autorun suppression, scene transition.
    Cheat_Menu._finishLoad = function (savestate) {
        try {
            // Restore objects that the engine's extractSaveContents skips.
            // MV: makeSaveContents includes message+troop but not temp.
            // MZ: makeSaveContents excludes all three but extractSaveContents in MZ
            //     restores message+temp internally.  Overriding $gameTemp in MZ can
            //     corrupt engine state the native menu depends on (e.g., _menuParentCommand).
            if (_isMZ) {
                // MZ — engine already restored $gameMessage/$gameTroop via its own
                // extractSaveContents.  Only restore $gameTemp on MV where it's missing.
                $gameMessage = savestate.message || new Game_Message();
                $gameTroop = savestate.troop || new Game_Troop();
            } else {
                $gameTemp = savestate.temp || new Game_Temp();
                $gameMessage = savestate.message || new Game_Message();
                $gameTroop = savestate.troop || new Game_Troop();
            }

            // --- Ensure $dataMap matches the restored map ---
            // After loadGame(99), $dataMap still points to the previous map's
            // data, so Game_Event.list() crashes on
            // $dataMap.events[savedEventId].pages.  Load the correct map data
            // synchronously before Scene_Map starts running events.
            var _mapId = $gameMap.mapId();
            if (_mapId > 0 && (!$dataMap || $dataMap.id !== _mapId)) {
                try {
                    var _fn = 'Map%1.json'.format(_mapId.padZero(3));
                    var _xhr = new XMLHttpRequest();
                    _xhr.open('GET', (DataManager._dataMapPath || 'data/') + _fn, false);
                    _xhr.overrideMimeType('text/plain');
                    _xhr.send(null);
                    if (_xhr.status === 200 || _xhr.status === 0) {
                        $dataMap = JsonEx.parse(_xhr.responseText);
                    }
                } catch (e) {
                    DataManager.loadMapData(_mapId);
                }
                // BGM is restored from savestate._cheatMenuBgm below,
                // so we skip $gameMap.autoplay() here.
            }

            // --- Mid-dialogue fix ---
            // After a mid-dialogue save the restored $gameMessage gets cleared
            // by Window_Message.newPage() on the first frame, making the
            // interpreter advance past the Show Text command.  We rewind the
            // interpreter to the preceding Show Text (101) command and clear the
            // restored message so it re-executes the dialogue fresh next frame.
            if ($gameMap && $gameMap._interpreter) {
                var interp = $gameMap._interpreter;
                if (interp._waitMode === "message") {
                    var list = interp._list;
                    var idx = interp._index;
                    if (list && idx > 0) {
                        var scanIdx = idx - 1;
                        while (
                            scanIdx > 0 &&
                            list[scanIdx] &&
                            list[scanIdx].code === 401
                        ) {
                            scanIdx--;
                        }
                        if (list[scanIdx] && list[scanIdx].code === 101) {
                            interp._index = scanIdx;
                            interp._waitMode = "";
                            if ($gameMessage && $gameMessage.clear) {
                                $gameMessage.clear();
                            }
                        }
                    }
                }
            }

            // Suppress autorun/parallel events on the first frame
            if ($gameMap) $gameMap._savestateSuppress = true;

            // Clear stale input from menu interaction
            if (Input.clear) Input.clear();

            // Clear any stale transfer (shouldn't be set, but be safe)
            if ($gamePlayer && $gamePlayer.isTransferring()) {
                $gamePlayer.clearTransferInfo();
            }

            // Clean up the temporary globalInfo entry for slot 99 so it
            // doesn't pollute the normal save screen.
            if (!_isMZ) {
                var oldGlobalInfo = DataManager.loadGlobalInfo();
                if (oldGlobalInfo && oldGlobalInfo[99]) {
                    delete oldGlobalInfo[99];
                    DataManager.saveGlobalInfo(oldGlobalInfo);
                }
            }

            // Restore the cheat menu tab that was active when this state was saved,
            // so reopening the menu goes directly to the expected umbrella group.
            if (savestate._cheatMenuTab) {
                if (typeof Cheat_Menu !== "undefined") {
                    Cheat_Menu.cheat_selected = savestate._cheatMenuTab.cheat_selected || 0;
                    Cheat_Menu.sub_tab_per_group = savestate._cheatMenuTab.sub_tab_per_group || {};
                    Cheat_Menu.list_state = savestate._cheatMenuTab.list_state || { search: "", scroll: 0 };
                    // Restore speed lock state so it survives savestate save/load cycle
                    if (savestate._cheatMenuTab.speed_unlocked !== undefined) {
                        Cheat_Menu.speed_unlocked = savestate._cheatMenuTab.speed_unlocked;
                    }
                }
            }

            // Restore the BGM that was playing at capture time (play from start).
            // This replaces $gameMap.autoplay() so the saved song is used
            // regardless of the map's assigned BGM.
            if (savestate._cheatMenuBgm && typeof AudioManager !== "undefined") {
                AudioManager.playBgm(savestate._cheatMenuBgm);
            }

            SoundManager.playLoad();
            try {
                SceneManager.goto(Scene_Map);
            } catch (e2) {
                if (typeof console !== "undefined" && console.warn) {
                    console.warn("Cheat_Menu scene transition error:", e2);
                }
            }
        } catch (e) {
            if (typeof console !== "undefined" && console.error) {
                console.error("Cheat_Menu _finishLoad error:", e);
            }
            SoundManager.playSystemSound(2);
        }
    };
})();


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
        Cheat_Menu.refresh_scroll_buttons();
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

var PIN_EMPTY = '<svg class="cpin" viewBox="0 0 16 16" width="11" height="11"><path d="M3 1 L13 1 L13 15 L8 11 L3 15 Z" fill="none" stroke="#888" stroke-width="1.5" stroke-linejoin="round"/></svg>';
var PIN_FILLED = '<svg class="cpin cpinned" viewBox="0 0 16 16" width="11" height="11"><path d="M3 1 L13 1 L13 15 L8 11 L3 15 Z" fill="#44cc55" stroke="none" stroke-linejoin="round"/></svg>';

var VIRTUAL_ITEM_HEIGHT = 28;
var VIRTUAL_BUFFER = 40;
var VIRTUAL_THRESHOLD = 80;

Cheat_Menu.append_searchable_list = function (dataArray, selectedIdx, onSelectCallback, getNameFunc, isGrid, getValueFunc, verticalLayout, extraClass, listType) {
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
    var _rendering = false;
    var _debounceTimer = null;

    var getPinnedKey = function () {
        if (listType === 'items') return 'pinned_items';
        if (listType === 'weapons') return 'pinned_weapons';
        if (listType === 'armors') return 'pinned_armors';
        if (listType === 'variables') return 'pinned_variables';
        if (listType === 'switches') return 'pinned_switches';
        if (listType === 'teleport') return 'pinned_teleport_maps';
        return null;
    };

    function buildItemElement(item, virtualIndex) {
        var li = document.createElement('li');
        li.className = "cheat_list_item";
        if (item.idx === selectedIdx) {
            li.className += " selected";
            focusedIndex = virtualIndex;
        }
        li.dataset.listIndex = virtualIndex;

        var pinnedKey = getPinnedKey();
        if (pinnedKey) {
            var pinBtn = document.createElement('span');
            pinBtn.className = "cheat_pin_btn";
            var isPinned = Cheat_Menu[pinnedKey].indexOf(item.idx) !== -1;
            pinBtn.innerHTML = isPinned ? PIN_FILLED : PIN_EMPTY;
            (function (idx, btn) {
                pinBtn.addEventListener('mousedown', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var arr = Cheat_Menu[pinnedKey];
                    var pos = arr.indexOf(idx);
                    if (pos === -1) {
                        arr.push(idx);
                        btn.innerHTML = PIN_FILLED;
                    } else {
                        arr.splice(pos, 1);
                        btn.innerHTML = PIN_EMPTY;
                    }
                    Cheat_Menu.save_values();
                });
                pinBtn.addEventListener('touchstart', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var arr = Cheat_Menu[pinnedKey];
                    var pos = arr.indexOf(idx);
                    if (pos === -1) {
                        arr.push(idx);
                        btn.innerHTML = PIN_FILLED;
                    } else {
                        arr.splice(pos, 1);
                        btn.innerHTML = PIN_EMPTY;
                    }
                    Cheat_Menu.save_values();
                }, { passive: false });
            })(item.idx, pinBtn);
            li.appendChild(pinBtn);
        }

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
        return li;
    }

    function buildSpacer(height) {
        var s = document.createElement('li');
        s.style.height = height + "px";
        s.style.listStyle = "none";
        s.style.pointerEvents = "none";
        return s;
    }

    var renderList = function (filterText) {
        if (_rendering) return;
        _rendering = true;
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

        var pinnedKey = getPinnedKey();
        if (pinnedKey && Cheat_Menu[pinnedKey] && Cheat_Menu[pinnedKey].length > 0) {
            var pinnedSet = {};
            for (var p = 0; p < Cheat_Menu[pinnedKey].length; p++) {
                pinnedSet[Cheat_Menu[pinnedKey][p]] = true;
            }
            var pinned = [];
            var unpinned = [];
            for (var v = 0; v < visibleItems.length; v++) {
                if (pinnedSet[visibleItems[v].idx]) {
                    pinned.push(visibleItems[v]);
                } else {
                    unpinned.push(visibleItems[v]);
                }
            }
            visibleItems = pinned.concat(unpinned);
        }

        if (visibleItems.length === 0) {
            var emptyLi = document.createElement('li');
            emptyLi.className = "cheat_list_item";
            emptyLi.style.justifyContent = "center";
            emptyLi.style.color = "#666";
            emptyLi.style.cursor = "default";
            emptyLi.innerHTML = "No results";
            listDiv.appendChild(emptyLi);
            _rendering = false;
            return;
        }

        searchInput.placeholder = "Search (" + visibleItems.length + " results)...";
        focusedIndex = -1;

        var itemHeight = isGrid ? 26 : VIRTUAL_ITEM_HEIGHT;

        if (visibleItems.length > VIRTUAL_THRESHOLD && !isGrid) {
            var scrollTop = Cheat_Menu.list_state.scroll || 0;
            var viewH = listDiv.clientHeight || 400;
            var visCount = Math.ceil(viewH / itemHeight);
            var start = Math.max(0, Math.floor(scrollTop / itemHeight) - VIRTUAL_BUFFER);
            var end = Math.min(visibleItems.length, Math.ceil((scrollTop + viewH) / itemHeight) + VIRTUAL_BUFFER);

            if (start > 0) {
                listDiv.appendChild(buildSpacer(start * itemHeight));
            }
            for (var vi = start; vi < end; vi++) {
                var li = buildItemElement(visibleItems[vi], vi);
                listDiv.appendChild(li);
            }
            if (end < visibleItems.length) {
                listDiv.appendChild(buildSpacer((visibleItems.length - end) * itemHeight));
            }
            listDiv.scrollTop = scrollTop;
        } else {
            for (var vj = 0; vj < visibleItems.length; vj++) {
                var li2 = buildItemElement(visibleItems[vj], vj);
                listDiv.appendChild(li2);
            }
        }

        _rendering = false;
    };

    var scheduleRender = function (filterText) {
        if (_debounceTimer) clearTimeout(_debounceTimer);
        _debounceTimer = setTimeout(function () {
            _debounceTimer = null;
            renderList(filterText);
        }, 16);
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
        scheduleRender(Cheat_Menu.list_state.search);
    };

    container.appendChild(searchInput);
    container.appendChild(listDiv);
    Cheat_Menu.content.appendChild(container);

    renderList(Cheat_Menu.list_state.search);
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
    },
    'quick_save': {
        title: 'Quick Save',
        fn: function () {
            if (!DataManager || !DataManager.makeSaveContents) return;
            var captured = Cheat_Menu.capture_savestate();
            if (captured) {
                Cheat_Menu.quick_savestate = captured;
                if (Cheat_Menu.persist_savestates) Cheat_Menu.persist_savestates();
                SoundManager.playSystemSound(1);
            }
        }
    },
    'quick_load': {
        title: 'Quick Load',
        fn: function () {
            var s = Cheat_Menu.quick_savestate;
            if (!s) {
                SoundManager.playSystemSound(2);
                return;
            }
            Cheat_Menu.load_savestate(s);
        }
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
        Cheat_Menu.quick_hud_el.style.width = 'auto';
        Cheat_Menu.quick_hud_el.style.border = 'none';
        Cheat_Menu.quick_hud_el.style.borderRadius = '0';
        if (pos === 'top') {
            Cheat_Menu.quick_hud_el.style.left = '0';
            Cheat_Menu.quick_hud_el.style.right = '0';
            Cheat_Menu.quick_hud_el.style.top = '0';
            Cheat_Menu.quick_hud_el.style.bottom = '';
            Cheat_Menu.quick_hud_el.style.marginLeft = 'auto';
            Cheat_Menu.quick_hud_el.style.marginRight = 'auto';
        } else if (pos === 'bottom') {
            Cheat_Menu.quick_hud_el.style.left = '0';
            Cheat_Menu.quick_hud_el.style.right = '0';
            Cheat_Menu.quick_hud_el.style.top = '';
            Cheat_Menu.quick_hud_el.style.bottom = '0';
            Cheat_Menu.quick_hud_el.style.marginLeft = 'auto';
            Cheat_Menu.quick_hud_el.style.marginRight = 'auto';
        } else if (pos === 'left') {
            Cheat_Menu.quick_hud_el.style.left = '0';
            Cheat_Menu.quick_hud_el.style.right = '';
            Cheat_Menu.quick_hud_el.style.top = '50%';
            Cheat_Menu.quick_hud_el.style.bottom = '';
            Cheat_Menu.quick_hud_el.style.transform = 'translateY(-50%)';
        } else if (pos === 'right') {
            Cheat_Menu.quick_hud_el.style.left = '';
            Cheat_Menu.quick_hud_el.style.right = '0';
            Cheat_Menu.quick_hud_el.style.top = '50%';
            Cheat_Menu.quick_hud_el.style.bottom = '';
            Cheat_Menu.quick_hud_el.style.transform = 'translateY(-50%)';
        }
    }
    Cheat_Menu.quick_hud_el.style.maxWidth = isVertical ? '60px' : '90vw';
    Cheat_Menu.quick_hud_el.style.flexDirection = isVertical ? 'column' : 'row';

    // Collapse/Expand button (hidden when menu open)
    if (!Cheat_Menu.cheat_menu_open) {
        var collapseBtn = document.createElement('button');
        collapseBtn.className = 'cheat_hud_btn cheat_hud_ctrl';
        collapseBtn.type = 'button';
        collapseBtn.style.fontSize = Cheat_Menu.hud_config.fontSize + "px";
        collapseBtn.style.opacity = Cheat_Menu.hud_config.opacity / 100;
        collapseBtn.innerHTML = isCollapsed ? "<span>▶</span>" : "<span>▼</span>";
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
        // Measure current position BEFORE clearing margin/transform artifacts
        var rect = el.getBoundingClientRect();
        var cx = e.touches ? e.touches[0].clientX : e.clientX;
        var cy = e.touches ? e.touches[0].clientY : e.clientY;
        // Clear all margin/transform artifacts from preset positioning
        el.style.marginLeft = '';
        el.style.marginRight = '';
        el.style.marginTop = '';
        el.style.marginBottom = '';
        el.style.transform = '';
        el.style.right = '';
        el.style.bottom = '';
        // Migrate to fixed/auto layout
        var isV = Cheat_Menu.hud_config.layout === 'vertical';
        el.style.position = 'fixed';
        el.style.width = 'auto';
        el.style.maxWidth = isV ? '60px' : '90vw';
        el.style.flexDirection = isV ? 'column' : 'row';
        el.className = '';
        // Anchor at the pre-margin position so the element doesn't jump
        el.style.left = rect.left + 'px';
        el.style.top = rect.top + 'px';
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

        // Ensure no margin/transform artifacts remain during drag
        el.style.marginLeft = '';
        el.style.marginRight = '';
        el.style.marginTop = '';
        el.style.marginBottom = '';
        el.style.transform = '';
        el.style.right = '';
        el.style.bottom = '';
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
        Cheat_Menu.hover_btn.addEventListener('mousedown', function (e) {
            e.stopPropagation();
        });
        Cheat_Menu.hover_btn.addEventListener('click', function (e) {
            e.stopPropagation();
        });

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

// Standardized control row: label left, button right
Cheat_Menu.append_cheat = function (cheat_text, status_text, key, click_handler) {
    var row = document.createElement('div');
    row.className = "cheat_control_grid";

    var label = document.createElement('div');
    label.className = "cheat_control_label";
    label.innerHTML = cheat_text;

    var actions = document.createElement('div');
    actions.className = "cheat_control_actions";

    var btnRow = document.createElement('div');
    btnRow.className = "cheat_btn_row";

    var btn = document.createElement('button');
    btn.className = "cheat_btn";
    btn.innerHTML = status_text;
    Cheat_Menu.addEvent(btn, click_handler);

    btnRow.appendChild(btn);
    actions.appendChild(btnRow);

    row.appendChild(label);
    row.appendChild(actions);

    Cheat_Menu.content.appendChild(row);
};

// Scroll selector: ◄ value ► [+ Apply] — compact grid row
Cheat_Menu.append_scroll_selector = function (text, key1, key2, scroll_handler, apply_handler) {
    var row = document.createElement('div');
    row.className = "cheat_control_grid";

    var label = document.createElement('div');
    label.className = "cheat_control_label";
    label.innerHTML = text;

    var actions = document.createElement('div');
    actions.className = "cheat_control_actions";

    var btnRow = document.createElement('div');
    btnRow.className = "cheat_btn_row";

    var btnLeft = document.createElement('button');
    btnLeft.className = "cheat_btn";
    btnLeft.innerHTML = "◄";
    Cheat_Menu.addEvent(btnLeft, scroll_handler.bind(null, "left"));

    var centerText = document.createElement('div');
    centerText.className = "cheat_value";
    centerText.innerHTML = text.replace(/^.*?: /, '');
    centerText.style.minWidth = "28px";

    var btnRight = document.createElement('button');
    btnRight.className = "cheat_btn";
    btnRight.innerHTML = "►";
    Cheat_Menu.addEvent(btnRight, scroll_handler.bind(null, "right"));

    btnRow.appendChild(btnLeft);
    btnRow.appendChild(centerText);
    btnRow.appendChild(btnRight);

    if (apply_handler) {
        var btnApply = document.createElement('button');
        btnApply.className = "cheat_btn";
        btnApply.innerHTML = "Apply";
        Cheat_Menu.addEvent(btnApply, apply_handler);
        btnRow.appendChild(btnApply);
    }

    actions.appendChild(btnRow);
    row.appendChild(label);
    row.appendChild(actions);

    Cheat_Menu.content.appendChild(row);
};

Cheat_Menu.append_sub_header = function (text) {
    var el = document.createElement('div');
    el.className = "cheat_sub_header";
    el.innerHTML = text;
    Cheat_Menu.content.appendChild(el);
};

// Simple add/remove row: label left, [-amount] [+amount] right
Cheat_Menu.append_add_remove = function (text, amount, onApply) {
    var row = document.createElement('div');
    row.className = "cheat_control_grid";

    var label = document.createElement('div');
    label.className = "cheat_control_label";
    label.innerHTML = text;

    var actions = document.createElement('div');
    actions.className = "cheat_control_actions";

    var btnRow = document.createElement('div');
    btnRow.className = "cheat_btn_row";

    var btnRemove = document.createElement('button');
    btnRemove.className = "cheat_btn";
    btnRemove.innerHTML = "-" + amount;
    Cheat_Menu.addEvent(btnRemove, function () { onApply("left"); });

    var btnAdd = document.createElement('button');
    btnAdd.className = "cheat_btn";
    btnAdd.innerHTML = "+" + amount;
    Cheat_Menu.addEvent(btnAdd, function () { onApply("right"); });

    btnRow.appendChild(btnRemove);
    btnRow.appendChild(btnAdd);
    actions.appendChild(btnRow);

    row.appendChild(label);
    row.appendChild(actions);

    Cheat_Menu.content.appendChild(row);
};


// Source: ui/builders/settings.js
// ============================================================
// Cheat Menu - Settings & Bottom Bar Builders
// ============================================================

// Compact amount display helper
Cheat_Menu.format_amount = function (n) {
    if (n >= 1000000) return (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "K";
    return "" + n;
};

Cheat_Menu.append_bottom_bar_controls = function (labelText, onZero, onApply) {
    var row = document.createElement('div');
    row.className = "cheat_modifier_row";

    // Left group: [Value: n] [+n] [-n] [RESET]
    var leftGroup = document.createElement('div');
    leftGroup.className = "modifier_group_left";

    var valLabel = document.createElement('span');
    valLabel.className = "cheat_modifier_value";
    valLabel.innerHTML = labelText;

    var amt = Cheat_Menu.amounts[Cheat_Menu.amount_index];
    var amtStr = Cheat_Menu.format_amount(amt);

    var btnPlus = document.createElement('button');
    btnPlus.className = "cheat_btn";
    btnPlus.innerHTML = "+" + amtStr;
    Cheat_Menu.addEvent(btnPlus, function (e) { e.preventDefault(); onApply("right"); });

    var btnMinus = document.createElement('button');
    btnMinus.className = "cheat_btn";
    btnMinus.innerHTML = "-" + amtStr;
    Cheat_Menu.addEvent(btnMinus, function (e) { e.preventDefault(); onApply("left"); });

    var btnReset = document.createElement('button');
    btnReset.className = "cheat_btn";
    btnReset.innerHTML = "RESET";
    Cheat_Menu.addEvent(btnReset, function (e) { e.preventDefault(); onZero(); });

    leftGroup.appendChild(valLabel);
    leftGroup.appendChild(btnPlus);
    leftGroup.appendChild(btnMinus);
    leftGroup.appendChild(btnReset);

    // Right group: [Step: n] [▲] [▼]
    var rightGroup = document.createElement('div');
    rightGroup.className = "modifier_group_right";

    var stepLabel = document.createElement('span');
    stepLabel.className = "cheat_modifier_step_label";
    stepLabel.innerHTML = "Step: " + Cheat_Menu.format_amount(amt);

    var btnStepUp = document.createElement('button');
    btnStepUp.className = "cheat_btn";
    btnStepUp.innerHTML = "▲";
    Cheat_Menu.addEvent(btnStepUp, function (e) { e.preventDefault(); Cheat_Menu.scroll_amount("right"); });

    var btnStepDown = document.createElement('button');
    btnStepDown.className = "cheat_btn";
    btnStepDown.innerHTML = "▼";
    Cheat_Menu.addEvent(btnStepDown, function (e) { e.preventDefault(); Cheat_Menu.scroll_amount("left"); });

    rightGroup.appendChild(stepLabel);
    rightGroup.appendChild(btnStepUp);
    rightGroup.appendChild(btnStepDown);

    row.appendChild(leftGroup);
    row.appendChild(rightGroup);
    Cheat_Menu.content.appendChild(row);
};

Cheat_Menu.append_setting_row = function (label, valueText, onLeft, onRight) {
    var row = document.createElement('div');
    row.className = "cheat_control_grid";

    var labelDiv = document.createElement('div');
    labelDiv.className = "cheat_control_label";
    labelDiv.innerHTML = label;

    var actions = document.createElement('div');
    actions.className = "cheat_control_actions";

    var btnRow = document.createElement('div');
    btnRow.className = "cheat_btn_row";

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
    valDiv.style.minWidth = "30px";

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

    btnRow.appendChild(btnLeft);
    btnRow.appendChild(valDiv);
    btnRow.appendChild(btnRight);
    actions.appendChild(btnRow);

    row.appendChild(labelDiv);
    row.appendChild(actions);

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

    var partyItems = [
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

    var enemyItems = [
        { label: "HP 0", btn: "Alive", fn: function () { Cheat_Menu.set_enemy_hp(0, true); } },
        { label: "HP 1", btn: "Alive", fn: function () { Cheat_Menu.set_enemy_hp(1, true); } },
        { label: "HP 0", btn: "All", fn: function () { Cheat_Menu.set_enemy_hp(0, false); } },
        { label: "HP 1", btn: "All", fn: function () { Cheat_Menu.set_enemy_hp(1, false); } }
    ];

    function buildCombatSection(sectionTitle, items) {
        var section = document.createElement('div');
        section.className = "cheat_combat_section";

        var titleDiv = document.createElement('div');
        titleDiv.className = "cheat_menu_title";
        titleDiv.innerHTML = sectionTitle;
        section.appendChild(titleDiv);

        var aliveItems = [];
        var allItems = [];
        for (var i = 0; i < items.length; i++) {
            if (items[i].btn === 'Alive') {
                aliveItems.push(items[i]);
            } else {
                allItems.push(items[i]);
            }
        }

        var row = document.createElement('div');
        row.className = "cheat_combat_row";

        function makeColumn(btnLabel, columnItems) {
            var col = document.createElement('div');
            col.className = "cheat_combat_column";

            var header = document.createElement('div');
            header.className = "cheat_combat_header";
            header.innerHTML = btnLabel;
            col.appendChild(header);

            for (var j = 0; j < columnItems.length; j++) {
                (function (item) {
                    var btn = document.createElement('button');
                    btn.className = "cheat_btn";
                    btn.innerHTML = "<b>" + item.label + "</b>";
                    Cheat_Menu.addEvent(btn, function (e) {
                        e.preventDefault();
                        item.fn();
                        SoundManager.playSystemSound(1);
                        Cheat_Menu.update_menu();
                    });
                    col.appendChild(btn);
                })(columnItems[j]);
            }

            return col;
        }

        row.appendChild(makeColumn("Alive", aliveItems));
        row.appendChild(makeColumn("All", allItems));
        section.appendChild(row);
        Cheat_Menu.content.appendChild(section);
    }

    buildCombatSection("Party", partyItems);
    buildCombatSection("Enemy", enemyItems);
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
    Cheat_Menu.append_sub_header("Stats");
    var stat_string = "";
    if ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus) {
        if (Cheat_Menu.stat_selection >= $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus.length) {
            Cheat_Menu.stat_selection = 0;
        }
        stat_string += $dataSystem.terms.params[Cheat_Menu.stat_selection];
    }
    Cheat_Menu.append_scroll_selector(stat_string, null, null, function (dir) {
        Cheat_Menu.scroll_stat(dir);
    });

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
    Cheat_Menu.append_sub_header("EXP");
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
    Cheat_Menu.append_sub_header("Gold");
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

    Cheat_Menu.append_sub_header("Speed");

    // Presets as compact grid row
    var presets = [
        { label: "Slow", speed: 2 },
        { label: "Normal", speed: 4 },
        { label: "Fast", speed: 5 },
        { label: "Max", speed: 6 }
    ];
    var pRow = document.createElement('div');
    pRow.className = "cheat_control_grid";
    var pLabel = document.createElement('div');
    pLabel.className = "cheat_control_label";
    pLabel.innerHTML = "Presets";
    var pActions = document.createElement('div');
    pActions.className = "cheat_control_actions";
    var pBtnRow = document.createElement('div');
    pBtnRow.className = "cheat_btn_row";
    for (var i = 0; i < presets.length; i++) {
        (function (p) {
            var btn = document.createElement('button');
            btn.className = "cheat_btn";
            btn.style.minWidth = "44px";
            btn.innerHTML = p.label;
            Cheat_Menu.addEvent(btn, function (e) {
                e.preventDefault();
                Cheat_Menu.change_player_speed(p.speed - $gamePlayer._moveSpeed);
                SoundManager.playSystemSound(1);
                Cheat_Menu.update_menu();
            });
            pBtnRow.appendChild(btn);
        })(presets[i]);
    }
    pActions.appendChild(pBtnRow);
    pRow.appendChild(pLabel);
    pRow.appendChild(pActions);
    Cheat_Menu.content.appendChild(pRow);

    var currentSpeed = "Speed: <font color='#44cc55'>" + Cheat_Menu.speed + "</font>";
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

    Cheat_Menu.append_sub_header("No Clip");
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
            var listEl = document.querySelector('.cheat_list');
            if (listEl) Cheat_Menu.list_state.scroll = listEl.scrollTop;
            SoundManager.playSystemSound(0);
            Cheat_Menu.update_menu();
        },
        function (item) { return item ? item.name : "NULL"; },
        true,
        function (idx) { return "x" + ($gameParty._items[idx] || 0); },
        false,
        null,
        'items'
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
            var listEl = document.querySelector('.cheat_list');
            if (listEl) Cheat_Menu.list_state.scroll = listEl.scrollTop;
            SoundManager.playSystemSound(0);
            Cheat_Menu.update_menu();
        },
        function (item) { return item ? item.name : "NULL"; },
        true,
        function (idx) { return "x" + ($gameParty._weapons[idx] || 0); },
        false,
        null,
        'weapons'
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
            var listEl = document.querySelector('.cheat_list');
            if (listEl) Cheat_Menu.list_state.scroll = listEl.scrollTop;
            SoundManager.playSystemSound(0);
            Cheat_Menu.update_menu();
        },
        function (item) { return item ? item.name : "NULL"; },
        true,
        function (idx) { return "x" + ($gameParty._armors[idx] || 0); },
        false,
        null,
        'armors'
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
            var listEl = document.querySelector('.cheat_list');
            if (listEl) Cheat_Menu.list_state.scroll = listEl.scrollTop;
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
        'grid-wide',
        'variables'
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
            var listEl = document.querySelector('.cheat_list');
            if (listEl) Cheat_Menu.list_state.scroll = listEl.scrollTop;
            var name = $dataSystem.switches[idx] || "Switch " + idx;
            var currentVal = $gameSwitches.value(idx);
            Cheat_Menu.open_confirm_modal("Toggle <b>" + name + "</b>?<br>Currently: <b>" + (currentVal ? "ON" : "OFF") + "</b>", function () {
                Cheat_Menu.toggle_switch(idx);
                if ($gameSwitches.value(idx)) {
                    SoundManager.playSystemSound(1);
                } else {
                    SoundManager.playSystemSound(2);
                }
                Cheat_Menu.update_menu();
            });
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
        'grid-wide',
        'switches'
    );
};


// Source: menu/pages/saveRecall.js
// ============================================================
// Cheat Menu - Save and Recall
// ============================================================

Cheat_Menu.create_page_save_recall = function () {
    Cheat_Menu.append_cheat_title("Location");

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
        row.className = "cheat_control_grid";

        var label = document.createElement('div');
        label.className = "cheat_control_label";
        label.innerHTML = slotLabel;

        var actions = document.createElement('div');
        actions.className = "cheat_control_actions";

        var btnRow = document.createElement('div');
        btnRow.className = "cheat_btn_row";

        var btnSave = document.createElement('button');
        btnSave.className = "cheat_btn";
        btnSave.innerHTML = "Save";
        btnSave.style.minWidth = "44px";
        Cheat_Menu.addEvent(btnSave, Cheat_Menu.save_position.bind(null, i));

        var btnRecall = document.createElement('button');
        btnRecall.className = "cheat_btn";
        btnRecall.innerHTML = "Recall";
        btnRecall.style.minWidth = "50px";
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

        btnRow.appendChild(btnSave);
        btnRow.appendChild(btnRecall);
        actions.appendChild(btnRow);
        row.appendChild(label);
        row.appendChild(actions);
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


// Source: menu/pages/saves.js
// ============================================================
// Cheat Menu - Page: Saves (10 in-memory savestate slots)
// ============================================================

Cheat_Menu.build_savestate_row = function (label, state, onSave, onLoad) {
    var row = document.createElement('div');
    row.className = "cheat_control_grid";

    var labelEl = document.createElement('div');
    labelEl.className = "cheat_control_label";
    labelEl.innerHTML = label;

    var actions = document.createElement('div');
    actions.className = "cheat_control_actions";

    var btnRow = document.createElement('div');
    btnRow.className = "cheat_btn_row";

    var btnSave = document.createElement('button');
    btnSave.className = "cheat_btn";
    btnSave.innerHTML = "Save State";
    btnSave.style.minWidth = "80px";
    Cheat_Menu.addEvent(btnSave, function (e) {
        e.preventDefault();
        onSave();
        Cheat_Menu.update_menu();
    });

    var btnLoad = document.createElement('button');
    btnLoad.className = "cheat_btn";
    btnLoad.innerHTML = "Load State";
    btnLoad.style.minWidth = "80px";
    if (!state) {
        btnLoad.style.opacity = "0.4";
    }
    Cheat_Menu.addEvent(btnLoad, function (e) {
        e.preventDefault();
        onLoad();
    });

    btnRow.appendChild(btnSave);
    btnRow.appendChild(btnLoad);
    actions.appendChild(btnRow);
    row.appendChild(labelEl);
    row.appendChild(actions);
    return row;
};

Cheat_Menu.make_slot_label = function (prefix, state) {
    if (state && state.map) {
        var mapId = state.map._mapId || "?";
        var mapName = ($dataMapInfos && $dataMapInfos[mapId]) ? $dataMapInfos[mapId].name : "Map " + mapId;
        return prefix + ": <span style='color:#aaa;'>" + mapName + "</span>";
    }
    return prefix + ": <span style='color:#666;'>Empty</span>";
};

Cheat_Menu.create_page_saves = function () {
    Cheat_Menu.append_cheat_title("States");

    // Quick Save slot (index 0)
    var qs = Cheat_Menu.quick_savestate;
    var qsLabel = Cheat_Menu.make_slot_label("Quick Save", qs);
    var qsRow = Cheat_Menu.build_savestate_row(qsLabel, qs,
        function () {
            if (!DataManager || !DataManager.makeSaveContents) return;
            var captured = Cheat_Menu.capture_savestate();
            if (captured) {
                Cheat_Menu.quick_savestate = captured;
                Cheat_Menu.persist_savestates();
                SoundManager.playSystemSound(1);
            }
        },
        function () {
            var s = Cheat_Menu.quick_savestate;
            if (!s) {
                SoundManager.playSystemSound(2);
                return;
            }
            Cheat_Menu.load_savestate(s);
        }
    );
    Cheat_Menu.content.appendChild(qsRow);

    // Regular savestate slots (1-10)
    for (var i = 0; i < 10; i++) {
        var state = Cheat_Menu.savestates[i];
        var slotLabel = Cheat_Menu.make_slot_label("Savestate " + (i + 1), state);
        var row = Cheat_Menu.build_savestate_row(slotLabel, state,
            function (idx) {
                return function () {
                    if (!DataManager || !DataManager.makeSaveContents) return;
                    var captured = Cheat_Menu.capture_savestate();
                    if (captured) {
                        Cheat_Menu.savestates[idx] = captured;
                        Cheat_Menu.persist_savestates();
                        SoundManager.playSystemSound(1);
                    }
                };
            }(i),
            function (idx) {
                return function () {
                    var s = Cheat_Menu.savestates[idx];
                    if (!s) {
                        SoundManager.playSystemSound(2);
                        return;
                    }
                    Cheat_Menu.load_savestate(s);
                };
            }(i)
        );
        Cheat_Menu.content.appendChild(row);
    }
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
            var listEl = document.querySelector('.cheat_list');
            if (listEl) Cheat_Menu.list_state.scroll = listEl.scrollTop;
            SoundManager.playSystemSound(0);
            Cheat_Menu.update_menu();
        },
        function (item, idx) { return item ? item.name : "Map " + idx; },
        true,
        null,
        null, null, "teleport"
    );

    Cheat_Menu.append_cheat("Current Position", "Fill", null, function () {
        Cheat_Menu.teleport_location.m = $gameMap.mapId();
        Cheat_Menu.teleport_location.x = $gamePlayer.x;
        Cheat_Menu.teleport_location.y = $gamePlayer.y;
        SoundManager.playSystemSound(0);
        Cheat_Menu.update_menu();
    });

    // Combined X/Y coordinates row
    var coordRow = document.createElement('div');
    coordRow.className = "cheat_control_grid";
    var coordLabel = document.createElement('div');
    coordLabel.className = "cheat_control_label";
    coordLabel.innerHTML = "Coordinates";
    var coordActions = document.createElement('div');
    coordActions.className = "cheat_control_actions";
    var coordBtnRow = document.createElement('div');
    coordBtnRow.className = "cheat_btn_row";
    coordBtnRow.style.gap = "12px";
    // X cluster
    var xCluster = document.createElement('span');
    xCluster.className = "cheat_coord_cluster";
    var xLabelEl = document.createElement('span');
    xLabelEl.className = "cheat_val_xy";
    xLabelEl.innerHTML = "X:";
    var xBtnLeft = document.createElement('button');
    xBtnLeft.className = "cheat_btn";
    xBtnLeft.innerHTML = "◄";
    Cheat_Menu.addEvent(xBtnLeft, Cheat_Menu.scroll_x_teleport_selection.bind(null, "left"));
    var xVal = document.createElement('span');
    xVal.className = "cheat_value";
    xVal.innerHTML = Cheat_Menu.teleport_location.x;
    xVal.style.minWidth = "20px";
    var xBtnRight = document.createElement('button');
    xBtnRight.className = "cheat_btn";
    xBtnRight.innerHTML = "►";
    Cheat_Menu.addEvent(xBtnRight, Cheat_Menu.scroll_x_teleport_selection.bind(null, "right"));
    xCluster.appendChild(xLabelEl);
    xCluster.appendChild(xBtnLeft);
    xCluster.appendChild(xVal);
    xCluster.appendChild(xBtnRight);
    // Y cluster
    var yCluster = document.createElement('span');
    yCluster.className = "cheat_coord_cluster";
    var yLabelEl = document.createElement('span');
    yLabelEl.className = "cheat_val_xy";
    yLabelEl.innerHTML = "Y:";
    var yBtnLeft = document.createElement('button');
    yBtnLeft.className = "cheat_btn";
    yBtnLeft.innerHTML = "◄";
    Cheat_Menu.addEvent(yBtnLeft, Cheat_Menu.scroll_y_teleport_selection.bind(null, "left"));
    var yVal = document.createElement('span');
    yVal.className = "cheat_value";
    yVal.innerHTML = Cheat_Menu.teleport_location.y;
    yVal.style.minWidth = "20px";
    var yBtnRight = document.createElement('button');
    yBtnRight.className = "cheat_btn";
    yBtnRight.innerHTML = "►";
    Cheat_Menu.addEvent(yBtnRight, Cheat_Menu.scroll_y_teleport_selection.bind(null, "right"));
    yCluster.appendChild(yLabelEl);
    yCluster.appendChild(yBtnLeft);
    yCluster.appendChild(yVal);
    yCluster.appendChild(yBtnRight);
    coordBtnRow.appendChild(xCluster);
    coordBtnRow.appendChild(yCluster);
    coordActions.appendChild(coordBtnRow);
    coordRow.appendChild(coordLabel);
    coordRow.appendChild(coordActions);
    Cheat_Menu.content.appendChild(coordRow);

    // Action row
    var tRow = document.createElement('div');
    tRow.className = "cheat_control_grid";
    var tLabel = document.createElement('div');
    tLabel.className = "cheat_control_label";
    tLabel.innerHTML = "Action";
    var tActions = document.createElement('div');
    tActions.className = "cheat_control_actions";
    var tBtnRow = document.createElement('div');
    tBtnRow.className = "cheat_btn_row";
    var tBtn = document.createElement('button');
    tBtn.className = "cheat_btn";
    tBtn.style.minWidth = "56px";
    tBtn.innerHTML = "Activate";
    Cheat_Menu.addEvent(tBtn, function (e) { e.preventDefault(); Cheat_Menu.teleport_current_location(); });
    tBtnRow.appendChild(tBtn);
    var tnBtn = document.createElement('button');
    tnBtn.className = "cheat_btn";
    tnBtn.style.minWidth = "56px";
    tnBtn.innerHTML = "TP + NoClip";
    Cheat_Menu.addEvent(tnBtn, function (e) { e.preventDefault(); Cheat_Menu.teleport_current_location(); $gamePlayer._through = true; SoundManager.playSystemSound(1); });
    tBtnRow.appendChild(tnBtn);
    tActions.appendChild(tBtnRow);
    tRow.appendChild(tLabel);
    tRow.appendChild(tActions);
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
    // NOTE: build.js determines which page files are included — only add functions
    // whose source file is in the build's module list.
    Cheat_Menu.menus = [
        Cheat_Menu.create_page_combat_vitals,
        Cheat_Menu.create_page_god_mode,
        Cheat_Menu.create_page_speed,
        Cheat_Menu.create_page_progression,
        Cheat_Menu.create_page_items,
        Cheat_Menu.create_page_weapons,
        Cheat_Menu.create_page_armors,
        Cheat_Menu.create_page_variables,
        Cheat_Menu.create_page_switches,
        Cheat_Menu.create_page_saves,
        Cheat_Menu.create_page_save_recall,
        Cheat_Menu.create_page_teleport,
        Cheat_Menu.create_page_clear_states,
        Cheat_Menu.create_page_general
    ];
    Cheat_Menu._page_titles = [
        "Combat",
        "God Mode",
        "Movement",
        "Progression",
        "Items",
        "Weapons",
        "Armors",
        "Variables",
        "Switches",
        "States",
        "Location",
        "Teleport",
        "Clear States",
        "Interface"
    ];
};

Cheat_Menu.inject_ui_settings = function () {
    Cheat_Menu._page_titles.push("Quick Actions HUD");
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
                    if (posList[idx] === 'Left' || posList[idx] === 'Right') {
                        Cheat_Menu.hud_config.layout = 'vertical';
                    } else {
                        Cheat_Menu.hud_config.layout = 'horizontal';
                    }
                    Cheat_Menu.update_menu();
                    Cheat_Menu.save_values();
                },
                function () {
                    var idx = posList.indexOf(Cheat_Menu.hud_config.position) + 1;
                    if (idx >= posList.length) idx = 0;
                    Cheat_Menu.hud_config.position = posList[idx];
                    Cheat_Menu.hud_config.freePos = null;
                    if (posList[idx] === 'Left' || posList[idx] === 'Right') {
                        Cheat_Menu.hud_config.layout = 'vertical';
                    } else {
                        Cheat_Menu.hud_config.layout = 'horizontal';
                    }
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
            var fallback = (Cheat_Menu._page_titles && Cheat_Menu._page_titles[i]) || ("Menu " + (i + 1));
            rawNames.push(fallback);
        }
    }

    Cheat_Menu.append_cheat_title = real_append;
    Cheat_Menu.content = old_content;
    Cheat_Menu._debug_rawNames = rawNames;

    var rawMenus = Cheat_Menu.menus.slice();

    var groups = {
        "Inventory": { keys: ["items", "weapon", "armor"], items: [] },
        "Combat & Vitals": { keys: ["hp", "mp", "tp", "enemy", "party", "god mode", "god", "clear", "combat"], items: [] },
        "Progression": { keys: ["exp", "gold", "progression"], items: [] },
        "Variables & Switches": { keys: ["variable", "switch"], items: [] },
        "Movement": { keys: ["movement", "no clip", "speed", "noclip"], items: [] },
        "Saves": { keys: ["saves", "savestate", "states", "location", "recall"], items: [] },
        "Navigation": { keys: ["teleport"], items: [] },
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

            var entry = items[subIdx];
            if (typeof entry.fn === 'function') {
                var old_append = Cheat_Menu.append_cheat_title;
                Cheat_Menu.append_cheat_title = function () { };
                entry.fn();
                Cheat_Menu.append_cheat_title = old_append;
            }
        });

        newNames.push(title);
    };

    createUmbrella("Inventory", groups["Inventory"].items);
    createUmbrella("Combat & Vitals", groups["Combat & Vitals"].items);
    createUmbrella("Progression", groups["Progression"].items);
    createUmbrella("Variables & Switches", groups["Variables & Switches"].items);
    createUmbrella("Movement", groups["Movement"].items);
    createUmbrella("Navigation", groups["Navigation"].items);
    createUmbrella("Saves", groups["Saves"].items);
    createUmbrella("Settings", groups["Settings"].items);

    for (var k = 0; k < uncategorized.length; k++) {
        newMenus.push(uncategorized[k].fn);
        newNames.push(uncategorized[k].name);
    }

    Cheat_Menu.menus = newMenus;
    Cheat_Menu.menu_names = newNames;

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
                list.scrollTop = Cheat_Menu.list_state.scroll;
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

    // Restore persistent state from localStorage
    Cheat_Menu.load_saved_values();
    // Restore savestates from separate localStorage key
    if (Cheat_Menu.restore_savestates) Cheat_Menu.restore_savestates();

    // Render hover button after a short delay (game canvas ready)
    setTimeout(Cheat_Menu.render_hover_button, 1000);
};

// Hook: Load Game
DataManager.default_loadGame = DataManager.loadGame;
DataManager.loadGame = function (savefileId) {
    Cheat_Menu.initialize();
    var result = DataManager.default_loadGame(savefileId);
    // MZ's loadGame can return a Promise (async storage via IndexedDB).
    // If so, defer initialize_speed_lock until the data is actually loaded
    // so the getter/setter is defined on the *new* $gamePlayer instance.
    if (result && typeof result.then === 'function') {
        return result.then(function (v) {
            Cheat_Menu.initialize_speed_lock();
            return v;
        });
    }
    Cheat_Menu.initialize_speed_lock();
    return result;
};

// Hook: New Game
DataManager.default_setupNewGame = DataManager.setupNewGame;
DataManager.setupNewGame = function () {
    Cheat_Menu.initialize();
    DataManager.default_setupNewGame();
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

