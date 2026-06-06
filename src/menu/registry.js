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
        "Save and Recall",
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
        "Combat & Vitals": { keys: ["hp", "mp", "tp", "enemy", "party", "god mode", "god", "clear", "state", "states", "combat"], items: [] },
        "Progression": { keys: ["exp", "stat", "gold", "progression"], items: [] },
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