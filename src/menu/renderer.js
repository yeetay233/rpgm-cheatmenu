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