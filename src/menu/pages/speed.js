// ============================================================
// Cheat Menu - Page: Speed
// ============================================================

Cheat_Menu.create_page_speed = function () {
    Cheat_Menu.append_cheat_title("Speed");
    Cheat_Menu.append_move_amount_selection();
    Cheat_Menu.append_title("Current Speed");
    Cheat_Menu.append_scroll_selector($gamePlayer._moveSpeed, null, null, Cheat_Menu.apply_speed_change);
    var status_text;
    if (!Cheat_Menu.speed_unlocked) {
        status_text = "<font color='#00ff00'>Locked</font>";
    } else {
        status_text = "<font color='#ff0000'>Unlocked</font>";
    }
    Cheat_Menu.append_cheat("Speed Lock", status_text, null, Cheat_Menu.apply_speed_lock_toggle);
};

Cheat_Menu.scroll_move_amount = function (direction) {
    if (direction == "left") {
        Cheat_Menu.move_amount_index--;
        if (Cheat_Menu.move_amount_index < 0) {
            Cheat_Menu.move_amount_index = 0;
        }
        SoundManager.playSystemSound(2);
    } else {
        Cheat_Menu.move_amount_index++;
        if (Cheat_Menu.move_amount_index >= Cheat_Menu.move_amounts.length) {
            Cheat_Menu.move_amount_index = Cheat_Menu.move_amounts.length - 1;
        }
        SoundManager.playSystemSound(1);
    }
    Cheat_Menu.update_menu();
};

Cheat_Menu.append_move_amount_selection = function () {
    Cheat_Menu.append_title("Amount");
    var current_amount = "<font color='#0088ff'>" + Cheat_Menu.move_amounts[Cheat_Menu.move_amount_index] + "</font>";
    Cheat_Menu.append_scroll_selector(current_amount, null, null, Cheat_Menu.scroll_move_amount);
};

Cheat_Menu.apply_speed_change = function (direction) {
    var amount = Cheat_Menu.move_amounts[Cheat_Menu.move_amount_index];
    if (direction == "left") {
        amount = -amount;
        SoundManager.playSystemSound(2);
    } else {
        SoundManager.playSystemSound(1);
    }
    Cheat_Menu.change_player_speed(amount);
    Cheat_Menu.update_menu();
};

Cheat_Menu.apply_speed_lock_toggle = function () {
    Cheat_Menu.toggle_lock_player_speed();
    if (Cheat_Menu.speed_unlocked) {
        SoundManager.playSystemSound(2);
    } else {
        SoundManager.playSystemSound(1);
    }
    Cheat_Menu.update_menu();
};