// ============================================================
// Cheat Menu - Page: Combat & Vitals (Party + Enemy merged)
// ============================================================

Cheat_Menu.create_page_combat_vitals = function () {
    Cheat_Menu.append_cheat_title("Combat");

    var partyItems = [
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

    var enemyItems = [
        { label: "HP 0", btn: "Alive", fn: function () { Cheat_Menu.set_enemy_hp(0, true); } },
        { label: "HP 1", btn: "Alive", fn: function () { Cheat_Menu.set_enemy_hp(1, true); } },
        { label: "HP 0", btn: "All", fn: function () { Cheat_Menu.set_enemy_hp(0, false); } },
        { label: "HP 1", btn: "All", fn: function () { Cheat_Menu.set_enemy_hp(1, false); } }
    ];

    function buildCombatSection(sectionTitle, items) {
        var section = document.createElement('div');
        section.className = "cheat_combat_section";

        var titleDiv = document.createElement('div');
        titleDiv.className = "cheat_menu_title";
        titleDiv.innerHTML = sectionTitle;
        section.appendChild(titleDiv);

        var aliveItems = [];
        var allItems = [];
        for (var i = 0; i < items.length; i++) {
            if (items[i].btn === 'Alive') {
                aliveItems.push(items[i]);
            } else {
                allItems.push(items[i]);
            }
        }

        var row = document.createElement('div');
        row.className = "cheat_combat_row";

        function makeColumn(btnLabel, columnItems) {
            var col = document.createElement('div');
            col.className = "cheat_combat_column";

            var header = document.createElement('div');
            header.className = "cheat_combat_header";
            header.innerHTML = btnLabel;
            col.appendChild(header);

            for (var j = 0; j < columnItems.length; j++) {
                (function (item) {
                    var btn = document.createElement('button');
                    btn.className = "cheat_btn";
                    btn.innerHTML = "<b>" + item.label + "</b>";
                    Cheat_Menu.addEvent(btn, function (e) {
                        e.preventDefault();
                        item.fn();
                        SoundManager.playSystemSound(1);
                        Cheat_Menu.update_menu();
                    });
                    col.appendChild(btn);
                })(columnItems[j]);
            }

            return col;
        }

        row.appendChild(makeColumn("Alive", aliveItems));
        row.appendChild(makeColumn("All", allItems));
        section.appendChild(row);
        Cheat_Menu.content.appendChild(section);
    }

    buildCombatSection("Party", partyItems);
    buildCombatSection("Enemy", enemyItems);
};
