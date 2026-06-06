// ============================================================
// Cheat Menu - Page: Stats
// ============================================================

Cheat_Menu.create_page_stats = function () {
    Cheat_Menu.append_cheat_title("Stats");
    Cheat_Menu.append_actor_selection();
    var stat_string = "";
    if ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus) {
        if (Cheat_Menu.stat_selection >= $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus.length) {
            Cheat_Menu.stat_selection = 0;
        }
        stat_string += $dataSystem.terms.params[Cheat_Menu.stat_selection];
    }
    var row = document.createElement('div');
    row.className = "cheat_row";
    var btnL = document.createElement('button');
    btnL.className = "cheat_btn";
    btnL.innerHTML = "◄ Stat";
    Cheat_Menu.addEvent(btnL, function (e) {
        e.preventDefault();
        Cheat_Menu.scroll_stat("left");
    });
    var statLbl = document.createElement('div');
    statLbl.className = "cheat_value";
    statLbl.innerHTML = stat_string;
    statLbl.style.flex = "1";
    var btnR = document.createElement('button');
    btnR.className = "cheat_btn";
    btnR.innerHTML = "Stat ►";
    Cheat_Menu.addEvent(btnR, function (e) {
        e.preventDefault();
        Cheat_Menu.scroll_stat("right");
    });
    row.appendChild(btnL);
    row.appendChild(statLbl);
    row.appendChild(btnR);
    Cheat_Menu.content.appendChild(row);

    var qty = ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus) ?
        $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus[Cheat_Menu.stat_selection] : 0;
    Cheat_Menu.append_bottom_bar_controls("Bonus: " + qty,
        function () {
            Cheat_Menu.give_stat($gameActors._data[Cheat_Menu.cheat_selected_actor], Cheat_Menu.stat_selection, -qty);
            Cheat_Menu.update_menu();
            SoundManager.playSystemSound(1);
        },
        Cheat_Menu.apply_current_stat
    );
};

Cheat_Menu.scroll_stat = function (direction) {
    if ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus) {
        if (direction == "left") {
            Cheat_Menu.stat_selection--;
            if (Cheat_Menu.stat_selection < 0) {
                Cheat_Menu.stat_selection = $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus.length - 1;
            }
        } else {
            Cheat_Menu.stat_selection++;
            if (Cheat_Menu.stat_selection >= $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus.length) {
                Cheat_Menu.stat_selection = 0;
            }
        }
    } else {
        Cheat_Menu.stat_selection = 0;
    }
    SoundManager.playSystemSound(0);
    Cheat_Menu.update_menu();
};

Cheat_Menu.apply_current_stat = function (direction) {
    var amount = Cheat_Menu.amounts[Cheat_Menu.amount_index];
    if (direction == "left") {
        amount = -amount;
        SoundManager.playSystemSound(2);
    } else {
        SoundManager.playSystemSound(1);
    }
    Cheat_Menu.give_stat($gameActors._data[Cheat_Menu.cheat_selected_actor], Cheat_Menu.stat_selection, amount);
    Cheat_Menu.update_menu();
};
