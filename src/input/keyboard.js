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