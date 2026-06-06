// ============================================================
// Cheat Menu - Page: Variables
// ============================================================

Cheat_Menu.create_page_variables = function () {
    Cheat_Menu.append_cheat_title("Variables");
    Cheat_Menu.append_searchable_list(
        $dataSystem.variables,
        Cheat_Menu.variable_selection,
        function (idx) {
            Cheat_Menu.variable_selection = idx;
            SoundManager.playSystemSound(0);
            Cheat_Menu.update_menu();

            var current_val = $gameVariables.value(idx);
            var title = idx + ": " + ($dataSystem.variables[idx] || ("Variable " + idx));
            if (typeof current_val === "string") {
                Cheat_Menu.open_text_modal(title, current_val || "", function (newVal) {
                    $gameVariables.setValue(idx, newVal);
                    SoundManager.playSystemSound(1);
                    Cheat_Menu.update_menu();
                });
            } else {
                Cheat_Menu.open_value_modal(title, current_val || 0, function (newVal) {
                    $gameVariables.setValue(idx, newVal);
                    SoundManager.playSystemSound(1);
                    Cheat_Menu.update_menu();
                });
            }
        },
        function (item, idx) { return item || "Variable " + idx; },
        true,
        function (idx) {
            return $gameVariables.value(idx);
        },
        false,
        'grid-wide'
    );
    var current_val = $gameVariables.value(Cheat_Menu.variable_selection);
    if (typeof current_val === "string") {
        Cheat_Menu.append_bottom_bar_controls("Text: " + (current_val || ""),
            function () {
                $gameVariables.setValue(Cheat_Menu.variable_selection, "");
                Cheat_Menu.update_menu();
                SoundManager.playSystemSound(1);
            },
            function () { }
        );
    } else {
        current_val = current_val || 0;
        Cheat_Menu.append_bottom_bar_controls("Value: " + current_val,
            function () {
                $gameVariables.setValue(Cheat_Menu.variable_selection, 0);
                Cheat_Menu.update_menu();
                SoundManager.playSystemSound(1);
            },
            Cheat_Menu.apply_current_variable
        );
    }
};

Cheat_Menu.apply_current_variable = function (direction) {
    var amount = Cheat_Menu.amounts[Cheat_Menu.amount_index];
    if (direction == "left") {
        amount = -amount;
        SoundManager.playSystemSound(2);
    } else {
        SoundManager.playSystemSound(1);
    }
    Cheat_Menu.set_variable(Cheat_Menu.variable_selection, amount);
    Cheat_Menu.update_menu();
};