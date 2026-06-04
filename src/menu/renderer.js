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
        btn.addEventListener('mousedown', function (e) {
            e.preventDefault();
            if (Cheat_Menu.cheat_selected !== idx) {
                Cheat_Menu.cheat_selected = idx;
                Cheat_Menu.sub_tab_selected = 0;
                Cheat_Menu.list_state = { search: "", scroll: 0 };
                SoundManager.playSystemSound(0);
                Cheat_Menu.update_menu();
            }
        });
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

    // Attach drag-scroll and scroll arrows for touch/mouse
    requestAnimationFrame(function () {
        Cheat_Menu.initDragScroll(Cheat_Menu.sidebar);
        Cheat_Menu.initDragScroll(Cheat_Menu.content);
        Cheat_Menu.attach_scroll_arrows(Cheat_Menu.overlay_box, Cheat_Menu.content, 120);

        var searchContainers = document.querySelectorAll('.cheat_search_container');
        for (var i = 0; i < searchContainers.length; i++) {
            var list = searchContainers[i].querySelector('.cheat_list');
            if (list) {
                Cheat_Menu.initDragScroll(list);
                Cheat_Menu.attach_scroll_arrows(searchContainers[i], list, 90);
            }
        }
    });
};