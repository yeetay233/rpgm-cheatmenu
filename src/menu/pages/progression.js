// ============================================================
// Cheat Menu - Page: Progression (EXP + Stats + Gold merged)
// ============================================================

Cheat_Menu.create_page_progression = function () {
    Cheat_Menu.append_cheat_title("Progression");
    Cheat_Menu.append_actor_selection();

    // Stats
    var statSection = document.createElement('div');
    statSection.className = "cheat_progression_section";

    var statRow = document.createElement('div');
    statRow.className = "cheat_sub_header";
    statRow.innerHTML = "Stats";
    statSection.appendChild(statRow);

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
    btnL.innerHTML = "◄";
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
    btnR.innerHTML = "►";
    Cheat_Menu.addEvent(btnR, function (e) {
        e.preventDefault();
        Cheat_Menu.scroll_stat("right");
    });
    row.appendChild(btnL);
    row.appendChild(statLbl);
    row.appendChild(btnR);
    statSection.appendChild(row);

    var prevContent = Cheat_Menu.content;
    Cheat_Menu.content = statSection;
    var statQty = ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus) ?
        $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus[Cheat_Menu.stat_selection] : 0;
    Cheat_Menu.append_bottom_bar_controls("Bonus: " + statQty,
        function () {
            Cheat_Menu.give_stat($gameActors._data[Cheat_Menu.cheat_selected_actor], Cheat_Menu.stat_selection, -statQty);
            Cheat_Menu.update_menu();
            SoundManager.playSystemSound(1);
        },
        Cheat_Menu.apply_current_stat
    );
    Cheat_Menu.content = prevContent;
    Cheat_Menu.content.appendChild(statSection);

    // EXP
    var expSection = document.createElement('div');
    expSection.className = "cheat_progression_section";

    var expHeader = document.createElement('div');
    expHeader.className = "cheat_sub_header";
    expHeader.innerHTML = "EXP";
    expSection.appendChild(expHeader);

    var prevContent2 = Cheat_Menu.content;
    Cheat_Menu.content = expSection;
    var expQty = $gameActors._data[Cheat_Menu.cheat_selected_actor] ? $gameActors._data[Cheat_Menu.cheat_selected_actor].currentExp() : 0;
    Cheat_Menu.append_bottom_bar_controls("EXP: " + expQty,
        function () {
            if ($gameActors._data[Cheat_Menu.cheat_selected_actor]) {
                Cheat_Menu.give_exp($gameActors._data[Cheat_Menu.cheat_selected_actor], -expQty);
                Cheat_Menu.update_menu();
                SoundManager.playSystemSound(1);
            }
        },
        Cheat_Menu.apply_current_exp
    );
    Cheat_Menu.content = prevContent2;
    Cheat_Menu.content.appendChild(expSection);

    // Gold
    var goldSection = document.createElement('div');
    goldSection.className = "cheat_progression_section";

    var goldHeader = document.createElement('div');
    goldHeader.className = "cheat_sub_header";
    goldHeader.innerHTML = "Gold";
    goldSection.appendChild(goldHeader);

    var prevContent3 = Cheat_Menu.content;
    Cheat_Menu.content = goldSection;
    var goldQty = $gameParty._gold;
    Cheat_Menu.append_bottom_bar_controls("Gold: " + goldQty,
        function () {
            Cheat_Menu.give_gold(-goldQty);
            Cheat_Menu.update_menu();
            SoundManager.playSystemSound(1);
        },
        Cheat_Menu.apply_current_gold
    );
    Cheat_Menu.content = prevContent3;
    Cheat_Menu.content.appendChild(goldSection);
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

Cheat_Menu.apply_current_exp = function (direction) {
    var amount = Cheat_Menu.amounts[Cheat_Menu.amount_index];
    if (direction == "left") {
        amount = -amount;
        SoundManager.playSystemSound(2);
    } else {
        SoundManager.playSystemSound(1);
    }
    Cheat_Menu.give_exp($gameActors._data[Cheat_Menu.cheat_selected_actor], amount);
    Cheat_Menu.update_menu();
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
