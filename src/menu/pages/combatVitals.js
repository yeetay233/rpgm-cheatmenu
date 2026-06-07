// ============================================================
// Cheat Menu - Page: Combat & Vitals (Party + Enemy merged)
// ============================================================

Cheat_Menu.create_page_combat_vitals = function () {
    Cheat_Menu.append_cheat_title("Combat");

    Cheat_Menu.append_title("Party");
    var items = [
        { label: "HP 0", btn: "Alive", fn: function () { Cheat_Menu.set_party_hp(0, true); } },
        { label: "HP 1", btn: "Alive", fn: function () { Cheat_Menu.set_party_hp(1, true); } },
        { label: "Full HP", btn: "Alive", fn: function () { Cheat_Menu.recover_party_hp(true); } },
        { label: "HP 0", btn: "All", fn: function () { Cheat_Menu.set_party_hp(0, false); } },
        { label: "HP 1", btn: "All", fn: function () { Cheat_Menu.set_party_hp(1, false); } },
        { label: "Full HP", btn: "All", fn: function () { Cheat_Menu.recover_party_hp(false); } },
        { label: "MP 0", btn: "Alive", fn: function () { Cheat_Menu.set_party_mp(0, true); } },
        { label: "MP 1", btn: "Alive", fn: function () { Cheat_Menu.set_party_mp(1, true); } },
        { label: "Full MP", btn: "Alive", fn: function () { Cheat_Menu.recover_party_mp(true); } },
        { label: "MP 0", btn: "All", fn: function () { Cheat_Menu.set_party_mp(0, false); } },
        { label: "MP 1", btn: "All", fn: function () { Cheat_Menu.set_party_mp(1, false); } },
        { label: "Full MP", btn: "All", fn: function () { Cheat_Menu.recover_party_mp(false); } },
        { label: "TP 0", btn: "Alive", fn: function () { Cheat_Menu.set_party_tp(0, true); } },
        { label: "TP 1", btn: "Alive", fn: function () { Cheat_Menu.set_party_tp(1, true); } },
        { label: "Full TP", btn: "Alive", fn: function () { Cheat_Menu.recover_party_tp(true); } },
        { label: "TP 0", btn: "All", fn: function () { Cheat_Menu.set_party_tp(0, false); } },
        { label: "TP 1", btn: "All", fn: function () { Cheat_Menu.set_party_tp(1, false); } },
        { label: "Full TP", btn: "All", fn: function () { Cheat_Menu.recover_party_tp(false); } }
    ];

    var grid = document.createElement('div');
    grid.className = "cheat_action_grid";

    for (var i = 0; i < items.length; i++) {
        (function (item) {
            var cell = document.createElement('div');
            cell.className = "cheat_action_cell";

            var btn = document.createElement('button');
            btn.className = "cheat_btn";
            var tagClass = item.btn === 'All' ? 'tag-all' : 'tag-alive';
            btn.innerHTML = "<b>" + item.label + "</b><br><small class='" + tagClass + "'>" + item.btn + "</small>";
            btn.style.width = "100%";
            btn.style.height = "100%";
            btn.style.padding = "4px 3px";
            btn.style.lineHeight = "1.3";
            btn.style.whiteSpace = "normal";
            btn.style.wordBreak = "break-word";
            Cheat_Menu.addEvent(btn, function (e) {
                e.preventDefault();
                item.fn();
                SoundManager.playSystemSound(1);
                Cheat_Menu.update_menu();
            });

            cell.appendChild(btn);
            grid.appendChild(cell);
        })(items[i]);
    }

    Cheat_Menu.content.appendChild(grid);

    Cheat_Menu.append_title("Enemy");
    var enemyItems = [
        { label: "HP 0", btn: "Alive", fn: function () { Cheat_Menu.set_enemy_hp(0, true); } },
        { label: "HP 1", btn: "Alive", fn: function () { Cheat_Menu.set_enemy_hp(1, true); } },
        { label: "HP 0", btn: "All", fn: function () { Cheat_Menu.set_enemy_hp(0, false); } },
        { label: "HP 1", btn: "All", fn: function () { Cheat_Menu.set_enemy_hp(1, false); } }
    ];

    var enemyGrid = document.createElement('div');
    enemyGrid.className = "cheat_action_grid";

    for (var j = 0; j < enemyItems.length; j++) {
        (function (item) {
            var cell = document.createElement('div');
            cell.className = "cheat_action_cell";

            var btn = document.createElement('button');
            btn.className = "cheat_btn";
            var tagClass = item.btn === 'All' ? 'tag-all' : 'tag-alive';
            btn.innerHTML = "<b>" + item.label + "</b><br><small class='" + tagClass + "'>" + item.btn + "</small>";
            btn.style.width = "100%";
            btn.style.height = "100%";
            btn.style.padding = "4px 3px";
            btn.style.lineHeight = "1.3";
            btn.style.whiteSpace = "normal";
            btn.style.wordBreak = "break-word";
            Cheat_Menu.addEvent(btn, function (e) {
                e.preventDefault();
                item.fn();
                SoundManager.playSystemSound(1);
                Cheat_Menu.update_menu();
            });

            cell.appendChild(btn);
            enemyGrid.appendChild(cell);
        })(enemyItems[j]);
    }

    Cheat_Menu.content.appendChild(enemyGrid);
};
