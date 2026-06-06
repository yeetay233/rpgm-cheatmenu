// ============================================================
// Cheat Menu - Page: God Mode
// ============================================================

Cheat_Menu.create_page_god_mode = function () {
    Cheat_Menu.append_cheat_title("God Mode");
    Cheat_Menu.append_actor_selection();
    Cheat_Menu.append_godmode_status();
    Cheat_Menu.append_cheat("All Party", "Toggle All", null, function () {
        var members = $gameParty.allMembers();
        var allOn = true;
        for (var i = 0; i < members.length; i++) {
            if (members[i] instanceof Game_Actor && !members[i].god_mode) {
                allOn = false;
                break;
            }
        }
        for (var i = 0; i < members.length; i++) {
            if (members[i] instanceof Game_Actor) {
                if (allOn) {
                    Cheat_Menu.god_mode_off(members[i]);
                } else {
                    Cheat_Menu.god_mode(members[i]);
                }
            }
        }
        SoundManager.playSystemSound(allOn ? 2 : 1);
        Cheat_Menu.update_menu();
    });
};

Cheat_Menu.append_godmode_status = function () {
    var status_text;
    if ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor].god_mode) {
        status_text = "<font color='#00ff00'>on</font>";
    } else {
        status_text = "<font color='#ff0000'>off</font>";
    }
    Cheat_Menu.append_cheat("Status:", status_text, null, Cheat_Menu.god_mode_toggle);
};
