// ============================================================
// Cheat Menu - Page: Teleport
// ============================================================

Cheat_Menu.create_page_teleport = function () {
    Cheat_Menu.append_cheat_title("Teleport");
    var current_map = "" + Cheat_Menu.teleport_location.m + ": ";
    if ($dataMapInfos[Cheat_Menu.teleport_location.m] && $dataMapInfos[Cheat_Menu.teleport_location.m].name) {
        current_map += $dataMapInfos[Cheat_Menu.teleport_location.m].name;
    } else {
        current_map += "NULL";
    }
    Cheat_Menu.append_scroll_selector(current_map, null, null, Cheat_Menu.scroll_map_teleport_selection);
    Cheat_Menu.append_scroll_selector("X: " + Cheat_Menu.teleport_location.x, null, null, Cheat_Menu.scroll_x_teleport_selection);
    Cheat_Menu.append_scroll_selector("Y: " + Cheat_Menu.teleport_location.y, null, null, Cheat_Menu.scroll_y_teleport_selection);
    Cheat_Menu.append_cheat("Teleport", "Activate", null, Cheat_Menu.teleport_current_location);
};

Cheat_Menu.scroll_map_teleport_selection = function (direction) {
    if (direction == "left") {
        Cheat_Menu.teleport_location.m--;
        if (Cheat_Menu.teleport_location.m < 1) {
            Cheat_Menu.teleport_location.m = $dataMapInfos.length - 1;
        }
    } else {
        Cheat_Menu.teleport_location.m++;
        if (Cheat_Menu.teleport_location.m >= $dataMapInfos.length) {
            Cheat_Menu.teleport_location.m = 1;
        }
    }
    SoundManager.playSystemSound(0);
    Cheat_Menu.update_menu();
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