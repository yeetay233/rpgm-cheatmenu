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
    Cheat_Menu.sub_tab_selected = 0;
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
    return DataManager.default_loadGame(savefileId);
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