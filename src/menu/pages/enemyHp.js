// ============================================================
// Cheat Menu - Page: Enemy HP (grid)
// ============================================================

Cheat_Menu.create_page_enemy_hp = function () {
    Cheat_Menu.append_cheat_title("Enemy HP");

    var items = [
        { label: "HP 0", btn: "Alive", fn: function () { Cheat_Menu.set_enemy_hp(0, true); } },
        { label: "HP 1", btn: "Alive", fn: function () { Cheat_Menu.set_enemy_hp(1, true); } },
        { label: "HP 0", btn: "All", fn: function () { Cheat_Menu.set_enemy_hp(0, false); } },
        { label: "HP 1", btn: "All", fn: function () { Cheat_Menu.set_enemy_hp(1, false); } }
    ];

    var grid = document.createElement('div');
    grid.className = "cheat_action_grid";

    for (var i = 0; i < items.length; i++) {
        (function (item) {
            var cell = document.createElement('div');
            cell.className = "cheat_action_cell";

            var btn = document.createElement('button');
            btn.className = "cheat_btn";
            btn.innerHTML = "<b>" + item.label + "</b><br><small>" + item.btn + "</small>";
            btn.style.width = "100%";
            btn.style.height = "100%";
            btn.style.padding = "6px 4px";
            btn.style.lineHeight = "1.3";
            btn.style.whiteSpace = "normal";
            btn.style.wordBreak = "break-word";
            var ehFn = function (e) {
                e.preventDefault();
                item.fn();
                SoundManager.playSystemSound(1);
                Cheat_Menu.update_menu();
            };
            btn.addEventListener('mousedown', ehFn);
            btn.addEventListener('touchstart', ehFn, { passive: false });

            cell.appendChild(btn);
            grid.appendChild(cell);
        })(items[i]);
    }

    Cheat_Menu.content.appendChild(grid);
};
