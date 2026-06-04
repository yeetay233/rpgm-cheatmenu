// ============================================================
// Cheat Menu - Shared scroll/apply handlers (used by many pages)
// ============================================================

Cheat_Menu.scroll_amount = function (direction) {
    if (direction == "left") {
        Cheat_Menu.amount_index--;
        if (Cheat_Menu.amount_index < 0) {
            Cheat_Menu.amount_index = 0;
        }
        SoundManager.playSystemSound(2);
    } else {
        Cheat_Menu.amount_index++;
        if (Cheat_Menu.amount_index >= Cheat_Menu.amounts.length) {
            Cheat_Menu.amount_index = Cheat_Menu.amounts.length - 1;
        }
        SoundManager.playSystemSound(1);
    }
    Cheat_Menu.update_menu();
};

Cheat_Menu.append_amount_selection = function () {
    Cheat_Menu.append_title("Amount");
    var current_amount = "<font color='#0088ff'>" + Cheat_Menu.amounts[Cheat_Menu.amount_index] + "</font>";
    Cheat_Menu.append_scroll_selector(current_amount, null, null, Cheat_Menu.scroll_amount);
};