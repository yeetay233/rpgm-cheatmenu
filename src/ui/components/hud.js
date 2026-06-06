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
        Cheat_Menu.quick_hud_el.className = pos;
        Cheat_Menu.quick_hud_el.style.flexDirection = 'row';
        Cheat_Menu.quick_hud_el.style.width = '100vw';
    }

    // Collapse/Expand button (always first)
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
