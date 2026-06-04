// ============================================================
// Cheat Menu - Page: Weapons
// ============================================================

Cheat_Menu.create_page_weapons = function () {
    Cheat_Menu.append_cheat_title("Weapons");
    Cheat_Menu.append_searchable_list(
        $dataWeapons,
        Cheat_Menu.weapon_selection,
        function (idx) {
            Cheat_Menu.weapon_selection = idx;
            SoundManager.playSystemSound(0);
            Cheat_Menu.update_menu();
        },
        function (item) { return item ? item.name : "NULL"; },
        true,
        function (idx) { return "x" + ($gameParty._weapons[idx] || 0); }
    );
    var qty = $gameParty._weapons[Cheat_Menu.weapon_selection] || 0;
    Cheat_Menu.append_bottom_bar_controls("Owned: " + qty,
        function () {
            Cheat_Menu.give_weapon(Cheat_Menu.weapon_selection, -qty);
            Cheat_Menu.update_menu();
            SoundManager.playSystemSound(1);
        },
        Cheat_Menu.apply_current_weapon
    );
};

Cheat_Menu.apply_current_weapon = function (direction) {
    var amount = Cheat_Menu.amounts[Cheat_Menu.amount_index];
    if (direction == "left") {
        amount = -amount;
        SoundManager.playSystemSound(2);
    } else {
        SoundManager.playSystemSound(1);
    }
    Cheat_Menu.give_weapon(Cheat_Menu.weapon_selection, amount);
    Cheat_Menu.update_menu();
};