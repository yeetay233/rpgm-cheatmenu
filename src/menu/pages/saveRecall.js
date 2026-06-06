// ============================================================
// Cheat Menu - Save and Recall
// ============================================================

Cheat_Menu.create_page_save_recall = function () {
    Cheat_Menu.append_cheat_title("Save and Recall");

    for (var i = 0; i < Cheat_Menu.saved_positions.length; i++) {
        var pos = Cheat_Menu.saved_positions[i];
        var slotLabel = "Slot " + (i + 1) + ": ";
        if (pos.m !== -1) {
            var mapName = $dataMapInfos[pos.m] ? $dataMapInfos[pos.m].name : "Map " + pos.m;
            slotLabel += mapName + " (" + pos.x + ", " + pos.y + ")";
        } else {
            slotLabel += "Empty";
        }

        var row = document.createElement('div');
        row.className = "cheat_row";

        var label = document.createElement('div');
        label.className = "cheat_label";
        label.style.flex = "1";
        label.style.fontSize = "0.85em";
        label.style.overflow = "hidden";
        label.style.textOverflow = "ellipsis";
        label.style.whiteSpace = "nowrap";
        label.innerHTML = slotLabel;

        var controls = document.createElement('div');
        controls.className = "cheat_controls";

        var btnSave = document.createElement('button');
        btnSave.className = "cheat_btn";
        btnSave.innerHTML = "Save";
        btnSave.style.minWidth = "50px";
        Cheat_Menu.addEvent(btnSave, Cheat_Menu.save_position.bind(null, i));

        var btnRecall = document.createElement('button');
        btnRecall.className = "cheat_btn";
        btnRecall.innerHTML = "Recall";
        btnRecall.style.minWidth = "55px";
        if (pos.m !== -1) {
            btnRecall.style.borderColor = "#44cc55";
        } else {
            btnRecall.style.opacity = "0.4";
        }
        Cheat_Menu.addEvent(btnRecall, (function (slotIdx) {
            return function (e) {
                e.preventDefault();
                var p = Cheat_Menu.saved_positions[slotIdx];
                if (p.m === -1) {
                    SoundManager.playSystemSound(2);
                    return;
                }
                var mapName = $dataMapInfos[p.m] ? $dataMapInfos[p.m].name : "Map " + p.m;
                Cheat_Menu.open_confirm_modal(
                    "Teleport to " + mapName + " at (" + p.x + ", " + p.y + ")?",
                    function () {
                        Cheat_Menu.teleport(p.m, p.x, p.y);
                        SoundManager.playSystemSound(1);
                        Cheat_Menu.update_menu();
                    }
                );
            };
        })(i));

        controls.appendChild(btnSave);
        controls.appendChild(btnRecall);
        row.appendChild(label);
        row.appendChild(controls);
        Cheat_Menu.content.appendChild(row);
    }
};

Cheat_Menu.save_position = function (pos_num) {
    Cheat_Menu.saved_positions[pos_num].m = $gameMap.mapId();
    Cheat_Menu.saved_positions[pos_num].x = $gamePlayer.x;
    Cheat_Menu.saved_positions[pos_num].y = $gamePlayer.y;
    SoundManager.playSystemSound(1);
    Cheat_Menu.update_menu();
};
