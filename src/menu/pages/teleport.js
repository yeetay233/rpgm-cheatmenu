// ============================================================
// Cheat Menu - Page: Teleport
// ============================================================

Cheat_Menu.create_page_teleport = function () {
    Cheat_Menu.append_cheat_title("Teleport");

    Cheat_Menu.append_searchable_list(
        $dataMapInfos,
        Cheat_Menu.teleport_location.m,
        function (idx) {
            Cheat_Menu.teleport_location.m = idx;
            SoundManager.playSystemSound(0);
            Cheat_Menu.update_menu();
        },
        function (item, idx) { return item ? item.name : "Map " + idx; },
        true,
        function (idx) {
            if (idx === Cheat_Menu.teleport_location.m) {
                return "<font color='#44cc55'>selected</font>";
            }
            return "";
        }
    );

    Cheat_Menu.append_cheat("Current Position", "Fill", null, function () {
        Cheat_Menu.teleport_location.m = $gameMap.mapId();
        Cheat_Menu.teleport_location.x = $gamePlayer.x;
        Cheat_Menu.teleport_location.y = $gamePlayer.y;
        SoundManager.playSystemSound(0);
        Cheat_Menu.update_menu();
    });

    Cheat_Menu.append_scroll_selector("X: " + Cheat_Menu.teleport_location.x, null, null, Cheat_Menu.scroll_x_teleport_selection);
    Cheat_Menu.append_scroll_selector("Y: " + Cheat_Menu.teleport_location.y, null, null, Cheat_Menu.scroll_y_teleport_selection);
    var tRow = document.createElement('div');
    tRow.className = "cheat_row";
    tRow.style.gap = "6px";
    function tpAction(e) { e.preventDefault(); Cheat_Menu.teleport_current_location(); }
    function tpClipAction(e) { e.preventDefault(); Cheat_Menu.teleport_current_location(); $gamePlayer._through = true; SoundManager.playSystemSound(1); }
    var tBtn = document.createElement('button');
    tBtn.className = "cheat_btn";
    tBtn.style.flex = "1";
    tBtn.innerHTML = "Activate";
    tBtn.addEventListener('mousedown', tpAction);
    tBtn.addEventListener('touchstart', tpAction, { passive: false });
    tRow.appendChild(tBtn);
    var tnBtn = document.createElement('button');
    tnBtn.className = "cheat_btn";
    tnBtn.style.flex = "1";
    tnBtn.innerHTML = "TP+Clip";
    tnBtn.addEventListener('mousedown', tpClipAction);
    tnBtn.addEventListener('touchstart', tpClipAction, { passive: false });
    tRow.appendChild(tnBtn);
    Cheat_Menu.content.appendChild(tRow);
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
