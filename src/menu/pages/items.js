// ============================================================
// Cheat Menu - Page: Items
// ============================================================

Cheat_Menu.create_page_items = function () {
    Cheat_Menu.append_cheat_title("Items");
    Cheat_Menu.append_searchable_list(
        $dataItems,
        Cheat_Menu.item_selection,
        function (idx) {
            Cheat_Menu.item_selection = idx;
            var listEl = document.querySelector('.cheat_list');
            if (listEl) Cheat_Menu.list_state.scroll = listEl.scrollTop;
            SoundManager.playSystemSound(0);
            Cheat_Menu.update_menu();
        },
        function (item) { return item ? item.name : "NULL"; },
        true,
        function (idx) { return "x" + ($gameParty._items[idx] || 0); }
    );
    var qty = $gameParty._items[Cheat_Menu.item_selection] || 0;
    Cheat_Menu.append_bottom_bar_controls("Owned: " + qty,
        function () {
            Cheat_Menu.give_item(Cheat_Menu.item_selection, -qty);
            Cheat_Menu.update_menu();
            SoundManager.playSystemSound(1);
        },
        Cheat_Menu.apply_current_item
    );
};

Cheat_Menu.apply_current_item = function (direction) {
    var amount = Cheat_Menu.amounts[Cheat_Menu.amount_index];
    if (direction == "left") {
        amount = -amount;
        SoundManager.playSystemSound(2);
    } else {
        SoundManager.playSystemSound(1);
    }
    Cheat_Menu.give_item(Cheat_Menu.item_selection, amount);
    Cheat_Menu.update_menu();
};