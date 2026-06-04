// ============================================================
// Cheat Menu - Page: Gold
// ============================================================

Cheat_Menu.create_page_gold = function () {
    Cheat_Menu.append_cheat_title("Gold");
    var qty = $gameParty._gold;
    Cheat_Menu.append_bottom_bar_controls("Gold: " + qty,
        function () {
            Cheat_Menu.give_gold(-qty);
            Cheat_Menu.update_menu();
            SoundManager.playSystemSound(1);
        },
        Cheat_Menu.apply_current_gold
    );
};

Cheat_Menu.apply_current_gold = function (direction) {
    var amount = Cheat_Menu.amounts[Cheat_Menu.amount_index];
    if (direction == "left") {
        amount = -amount;
        SoundManager.playSystemSound(2);
    } else {
        SoundManager.playSystemSound(1);
    }
    Cheat_Menu.give_gold(amount);
    Cheat_Menu.update_menu();
};