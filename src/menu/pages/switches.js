// ============================================================
// Cheat Menu - Page: Switches
// ============================================================

Cheat_Menu.create_page_switches = function () {
    Cheat_Menu.append_cheat_title("Switches");
    Cheat_Menu.append_searchable_list(
        $dataSystem.switches,
        Cheat_Menu.switch_selection,
        function (idx) {
            Cheat_Menu.switch_selection = idx;
            SoundManager.playSystemSound(0);
            Cheat_Menu.update_menu();
        },
        function (item, idx) { return item || "Switch " + idx; },
        false,
        function (idx) {
            return $gameSwitches.value(idx) ? "ON" : "OFF";
        },
        true
    );
    var current_switch_value = 'NULL';
    if ($gameSwitches.value(Cheat_Menu.switch_selection) != undefined) {
        current_switch_value = $gameSwitches.value(Cheat_Menu.switch_selection) ? "ON" : "OFF";
    }
    Cheat_Menu.append_cheat("Value: " + current_switch_value, "Toggle", null, function () {
        Cheat_Menu.toggle_switch(Cheat_Menu.switch_selection);
        if ($gameSwitches.value(Cheat_Menu.switch_selection)) {
            SoundManager.playSystemSound(1);
        } else {
            SoundManager.playSystemSound(2);
        }
        Cheat_Menu.update_menu();
    });
};