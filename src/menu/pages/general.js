// ============================================================
// Cheat Menu - Page: Interface (merged General + Interface)
// ============================================================

Cheat_Menu.create_page_general = function () {
    Cheat_Menu.append_cheat_title("Interface");

    Cheat_Menu.append_setting_row("Menu Scale Size", Cheat_Menu.menu_scale + "%",
        function () { Cheat_Menu.menu_scale = Math.max(30, Cheat_Menu.menu_scale - 5); Cheat_Menu.update_menu(); },
        function () { Cheat_Menu.menu_scale = Math.min(100, Cheat_Menu.menu_scale + 5); Cheat_Menu.update_menu(); }
    );

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

    Cheat_Menu.append_cheat("Close Menu", "Close", null, function () {
        Cheat_Menu.close_menu();
    });
};