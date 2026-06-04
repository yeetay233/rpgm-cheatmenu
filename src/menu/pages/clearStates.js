// ============================================================
// Cheat Menu - Page: Clear States
// ============================================================

Cheat_Menu.create_page_clear_states = function () {
    Cheat_Menu.append_cheat_title("Clear States");
    Cheat_Menu.append_cheat("Clear Party States", "Activate", null, function () {
        Cheat_Menu.clear_party_states();
        SoundManager.playSystemSound(1);
    });
    Cheat_Menu.append_actor_selection();
    Cheat_Menu.append_title("Current State");
    var number_states = 0;
    if ($gameActors._data[Cheat_Menu.cheat_selected_actor] &&
        $gameActors._data[Cheat_Menu.cheat_selected_actor]._states &&
        $gameActors._data[Cheat_Menu.cheat_selected_actor]._states.length >= 0) {
        number_states = $gameActors._data[Cheat_Menu.cheat_selected_actor]._states.length;
    } else {
        number_states = null;
    }
    Cheat_Menu.append_cheat("Number Effects:", number_states, null, function () {
        Cheat_Menu.clear_actor_states($gameActors._data[Cheat_Menu.cheat_selected_actor]);
        SoundManager.playSystemSound(1);
        Cheat_Menu.update_menu();
    });
};