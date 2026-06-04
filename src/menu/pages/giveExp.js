// ============================================================
// Cheat Menu - Page: Give EXP
// ============================================================

Cheat_Menu.create_page_give_exp = function () {
    Cheat_Menu.append_cheat_title("Give EXP");
    Cheat_Menu.append_actor_selection();
    Cheat_Menu.append_exp_cheat();
};

Cheat_Menu.append_exp_cheat = function () {
    var qty = $gameActors._data[Cheat_Menu.cheat_selected_actor] ? $gameActors._data[Cheat_Menu.cheat_selected_actor].currentExp() : 0;
    Cheat_Menu.append_bottom_bar_controls("EXP: " + qty,
        function () {
            if ($gameActors._data[Cheat_Menu.cheat_selected_actor]) {
                Cheat_Menu.give_exp($gameActors._data[Cheat_Menu.cheat_selected_actor], -qty);
                Cheat_Menu.update_menu();
                SoundManager.playSystemSound(1);
            }
        },
        Cheat_Menu.apply_current_exp
    );
};

Cheat_Menu.apply_current_exp = function (direction) {
    var amount = Cheat_Menu.amounts[Cheat_Menu.amount_index];
    if (direction == "left") {
        amount = -amount;
        SoundManager.playSystemSound(2);
    } else {
        SoundManager.playSystemSound(1);
    }
    Cheat_Menu.give_exp($gameActors._data[Cheat_Menu.cheat_selected_actor], amount);
    Cheat_Menu.update_menu();
};