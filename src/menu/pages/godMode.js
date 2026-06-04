// ============================================================
// Cheat Menu - Page: God Mode
// ============================================================

Cheat_Menu.create_page_god_mode = function () {
    Cheat_Menu.append_cheat_title("God Mode");
    Cheat_Menu.append_actor_selection(4, 5);
    Cheat_Menu.append_godmode_status();
};

Cheat_Menu.scroll_actor = function (direction) {
    if (direction == "left") {
        Cheat_Menu.cheat_selected_actor--;
        if (Cheat_Menu.cheat_selected_actor < 0) {
            Cheat_Menu.cheat_selected_actor = $gameActors._data.length - 1;
        }
    } else {
        Cheat_Menu.cheat_selected_actor++;
        if (Cheat_Menu.cheat_selected_actor >= $gameActors._data.length) {
            Cheat_Menu.cheat_selected_actor = 0;
        }
    }
    SoundManager.playSystemSound(0);
    Cheat_Menu.update_menu();
};

Cheat_Menu.append_actor_selection = function () {
    Cheat_Menu.append_title("Actor");
    var actor_name;
    if ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor]._name) {
        actor_name = "<font color='#0088ff'>" + $gameActors._data[Cheat_Menu.cheat_selected_actor]._name + "</font>";
    } else {
        actor_name = "<font color='#ff0000'>NULL</font>";
    }
    Cheat_Menu.append_scroll_selector(actor_name, null, null, Cheat_Menu.scroll_actor);
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