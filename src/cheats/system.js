// ============================================================
// Cheat Menu - System Cheats (Variables, Switches, Save/Recall)
// ============================================================

Cheat_Menu.set_variable = function (variable_id, value) {
    if ($dataSystem.variables[variable_id] != undefined) {
        var new_value = $gameVariables.value(variable_id) + value;
        $gameVariables.setValue(variable_id, new_value);
    }
};

Cheat_Menu.toggle_switch = function (switch_id) {
    if ($dataSystem.switches[switch_id] != undefined) {
        $gameSwitches.setValue(switch_id, !$gameSwitches.value(switch_id));
    }
};