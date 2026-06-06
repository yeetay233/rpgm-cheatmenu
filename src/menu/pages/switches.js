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
            var listEl = document.querySelector('.cheat_list');
            if (listEl) Cheat_Menu.list_state.scroll = listEl.scrollTop;
            var name = $dataSystem.switches[idx] || "Switch " + idx;
            var currentVal = $gameSwitches.value(idx);
            Cheat_Menu.open_confirm_modal("Toggle <b>" + name + "</b>?<br>Currently: <b>" + (currentVal ? "ON" : "OFF") + "</b>", function () {
                Cheat_Menu.toggle_switch(idx);
                if ($gameSwitches.value(idx)) {
                    SoundManager.playSystemSound(1);
                } else {
                    SoundManager.playSystemSound(2);
                }
                Cheat_Menu.update_menu();
            });
        },
        function (item, idx) { return item || "Switch " + idx; },
        true,
        function (idx) {
            var val = $gameSwitches.value(idx);
            if (val) {
                return "<font color='#44cc55'>ON</font>";
            } else {
                return "<font color='#ff4444'>OFF</font>";
            }
        },
        false,
        'grid-wide'
    );
};
