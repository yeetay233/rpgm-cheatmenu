// ============================================================
// Cheat Menu - Page: General
// ============================================================

Cheat_Menu.create_page_general = function () {
    Cheat_Menu.append_cheat_title("General");

    Cheat_Menu.append_scroll_selector("Position: " + Cheat_Menu.positions[Cheat_Menu.position], null, null, function (dir) {
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

    Cheat_Menu.append_cheat("Close Menu", "Close", null, function () {
        Cheat_Menu.close_menu();
    });
};