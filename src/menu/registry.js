// ============================================================
// Cheat Menu - Menu Registry & Umbrella Grouping
// ============================================================

Cheat_Menu.register_pages = function () {
    if (Cheat_Menu._pages_registered) return;
    Cheat_Menu._pages_registered = true;

    // Register all menu pages (order determines sidebar position before grouping)
    // Insert at front so menu order is as defined here
    Cheat_Menu.menus = [
        Cheat_Menu.create_page_god_mode,
        Cheat_Menu.create_page_no_clip,
        Cheat_Menu.create_page_enemy_hp,
        Cheat_Menu.create_page_party_hp,
        Cheat_Menu.create_page_party_mp,
        Cheat_Menu.create_page_party_tp,
        Cheat_Menu.create_page_give_exp,
        Cheat_Menu.create_page_stats,
        Cheat_Menu.create_page_gold,
        Cheat_Menu.create_page_items,
        Cheat_Menu.create_page_weapons,
        Cheat_Menu.create_page_armors,
        Cheat_Menu.create_page_variables,
        Cheat_Menu.create_page_switches,
        Cheat_Menu.create_page_speed,
        Cheat_Menu.create_page_save_recall,
        Cheat_Menu.create_page_teleport,
        Cheat_Menu.create_page_clear_states,
        Cheat_Menu.create_page_general
    ];
};

Cheat_Menu.inject_ui_settings = function () {
    Cheat_Menu.menus.push(function () {
        Cheat_Menu.append_cheat_title("Interface");
        Cheat_Menu.append_setting_row("Menu Scale Size", Cheat_Menu.menu_scale + "%",
            function () { Cheat_Menu.menu_scale = Math.max(30, Cheat_Menu.menu_scale - 5); Cheat_Menu.update_menu(); },
            function () { Cheat_Menu.menu_scale = Math.min(100, Cheat_Menu.menu_scale + 5); Cheat_Menu.update_menu(); }
        );
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
    });

    Cheat_Menu.menus.push(function () {
        Cheat_Menu.append_cheat_title("Quick Actions HUD");
        Cheat_Menu.append_setting_row("Enable Taskbar HUD", Cheat_Menu.hud_config.enabled ? "ON" : "OFF", null,
            function () { Cheat_Menu.hud_config.enabled = !Cheat_Menu.hud_config.enabled; Cheat_Menu.update_menu(); }
        );
        if (Cheat_Menu.hud_config.enabled) {
            Cheat_Menu.append_setting_row("Taskbar Position", Cheat_Menu.hud_config.position, null,
                function () { Cheat_Menu.hud_config.position = Cheat_Menu.hud_config.position === 'Top' ? 'Bottom' : 'Top'; Cheat_Menu.update_menu(); }
            );
            Cheat_Menu.append_setting_row("HUD Opacity", Cheat_Menu.hud_config.opacity + "%",
                function () { Cheat_Menu.hud_config.opacity = Math.max(0, Cheat_Menu.hud_config.opacity - 10); Cheat_Menu.update_menu(); },
                function () { Cheat_Menu.hud_config.opacity = Math.min(100, Cheat_Menu.hud_config.opacity + 10); Cheat_Menu.update_menu(); }
            );
            Cheat_Menu.append_setting_row("HUD Font Size", Cheat_Menu.hud_config.fontSize + "px",
                function () { Cheat_Menu.hud_config.fontSize = Math.max(8, Cheat_Menu.hud_config.fontSize - 1); Cheat_Menu.update_menu(); },
                function () { Cheat_Menu.hud_config.fontSize = Math.min(24, Cheat_Menu.hud_config.fontSize + 1); Cheat_Menu.update_menu(); }
            );

            Cheat_Menu.append_title("Active HUD Buttons");
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
                btn.style.backgroundColor = isActive ? "rgba(0, 136, 255, 0.3)" : "";
                btn.style.borderColor = isActive ? "#00aaff" : "";
                btn.innerHTML = Cheat_Menu.hud_actions[k].title;
                btn.addEventListener('mousedown', function (e) {
                    e.preventDefault();
                    if (isActive) {
                        Cheat_Menu.hud_config.active.splice(Cheat_Menu.hud_config.active.indexOf(k), 1);
                    } else {
                        Cheat_Menu.hud_config.active.push(k);
                    }
                    Cheat_Menu.update_menu();
                });
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
        Cheat_Menu.menus[i]();
        if (rawNames.length === len) {
            rawNames.push("Menu " + (i + 1));
        }
    }

    Cheat_Menu.append_cheat_title = real_append;
    Cheat_Menu.content = old_content;
    Cheat_Menu._debug_rawNames = rawNames;

    var rawMenus = Cheat_Menu.menus.slice();

    var groups = {
        "Inventory": { keys: ["item", "weapon", "armor"], items: [] },
        "Combat & Vitals": { keys: ["hp", "mp", "tp", "enemy", "party", "god mode", "god"], items: [] },
        "Progression": { keys: ["exp", "stat", "gold"], items: [] },
        "Variables & Switches": { keys: ["variable", "switch"], items: [] },
        "Movement": { keys: ["no clip", "speed"], items: [] },
        "Navigation": { keys: ["save and recall", "teleport"], items: [] },
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

            if (Cheat_Menu.sub_tab_selected >= items.length) {
                Cheat_Menu.sub_tab_selected = 0;
            }

            for (var j = 0; j < items.length; j++) {
                let btn = document.createElement('button');
                btn.className = "cheat_sub_tab" + (Cheat_Menu.sub_tab_selected === j ? " active" : "");
                btn.innerHTML = items[j].name;
                let idx = j;

                btn.addEventListener('mousedown', function (e) {
                    e.preventDefault();
                    if (Cheat_Menu.sub_tab_selected !== idx) {
                        Cheat_Menu.sub_tab_selected = idx;
                        Cheat_Menu.list_state = { search: "", scroll: 0 };
                        SoundManager.playSystemSound(0);
                        Cheat_Menu.update_menu();
                    }
                });

                nav.appendChild(btn);
            }

            Cheat_Menu.content.appendChild(nav);

            var old_append = Cheat_Menu.append_cheat_title;
            Cheat_Menu.append_cheat_title = function () { };
            items[Cheat_Menu.sub_tab_selected].fn();
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

    if (Cheat_Menu.cheat_selected >= Cheat_Menu.menus.length) {
        Cheat_Menu.cheat_selected = 0;
    }

    Cheat_Menu._debug_menu_names = newNames;
};