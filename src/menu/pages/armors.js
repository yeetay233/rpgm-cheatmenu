// ============================================================
// Cheat Menu - Page: Armors
// ============================================================

Cheat_Menu.create_page_armors = function () {
    Cheat_Menu.append_cheat_title("Armors");
    Cheat_Menu.append_searchable_list(
        $dataArmors,
        Cheat_Menu.armor_selection,
        function (idx) {
            Cheat_Menu.armor_selection = idx;
            var listEl = document.querySelector('.cheat_list');
            if (listEl) Cheat_Menu.list_state.scroll = listEl.scrollTop;
            SoundManager.playSystemSound(0);
            Cheat_Menu.update_menu();
        },
        function (item) { return item ? item.name : "NULL"; },
        true,
        function (idx) { return "x" + ($gameParty._armors[idx] || 0); },
        false,
        null,
        'armors'
    );
    var qty = $gameParty._armors[Cheat_Menu.armor_selection] || 0;
    Cheat_Menu.append_bottom_bar_controls("Owned: " + qty,
        function () {
            Cheat_Menu.give_armor(Cheat_Menu.armor_selection, -qty);
            Cheat_Menu.update_menu();
            SoundManager.playSystemSound(1);
        },
        Cheat_Menu.apply_current_armor
    );
};

Cheat_Menu.apply_current_armor = function (direction) {
    var amount = Cheat_Menu.amounts[Cheat_Menu.amount_index];
    if (direction == "left") {
        amount = -amount;
        SoundManager.playSystemSound(2);
    } else {
        SoundManager.playSystemSound(1);
    }
    Cheat_Menu.give_armor(Cheat_Menu.armor_selection, amount);
    Cheat_Menu.update_menu();
};