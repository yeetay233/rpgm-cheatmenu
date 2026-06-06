// ============================================================
// Cheat Menu - Page: Save and Recall
// ============================================================

Cheat_Menu.create_page_save_recall = function () {
    Cheat_Menu.append_cheat_title("Save and Recall");
    Cheat_Menu.append_title("Current Position: ");
    if ($dataMapInfos[$gameMap.mapId()] && $dataMapInfos[$gameMap.mapId()].name) {
        var current_map = "" + $gameMap.mapId() + ": " + $dataMapInfos[$gameMap.mapId()].name;
        Cheat_Menu.append_description(current_map);
        var map_pos = "(" + $gamePlayer.x + ", " + $gamePlayer.y + ")";
        Cheat_Menu.append_description(map_pos);
    } else {
        Cheat_Menu.append_description("NULL");
    }

    for (var i = 0; i < Cheat_Menu.saved_positions.length; i++) {
        Cheat_Menu.append_title("Position " + (i + 1));
        var map_text;
        var pos_text;
        if (Cheat_Menu.saved_positions[i].m != -1) {
            map_text = "" + Cheat_Menu.saved_positions[i].m + ": ";
            if ($dataMapInfos[Cheat_Menu.saved_positions[i].m].name) {
                map_text += $dataMapInfos[Cheat_Menu.saved_positions[i].m].name;
            } else {
                map_text += "NULL";
            }
            pos_text = "(" + Cheat_Menu.saved_positions[i].x + ", " + Cheat_Menu.saved_positions[i].y + ")";
        } else {
            map_text = "NULL";
            pos_text = "NULL";
        }
        Cheat_Menu.append_cheat("Save:", map_text, null, Cheat_Menu.save_position.bind(null, i));
        Cheat_Menu.append_cheat("Recall:", pos_text, null, Cheat_Menu.recall_position.bind(null, i));
    }
};

Cheat_Menu.save_position = function (pos_num) {
    Cheat_Menu.saved_positions[pos_num].m = $gameMap.mapId();
    Cheat_Menu.saved_positions[pos_num].x = $gamePlayer.x;
    Cheat_Menu.saved_positions[pos_num].y = $gamePlayer.y;
    SoundManager.playSystemSound(1);
    Cheat_Menu.update_menu();
};

Cheat_Menu.recall_position = function (pos_num) {
    if (Cheat_Menu.saved_positions[pos_num].m != -1) {
        Cheat_Menu.teleport(Cheat_Menu.saved_positions[pos_num].m, Cheat_Menu.saved_positions[pos_num].x, Cheat_Menu.saved_positions[pos_num].y);
        SoundManager.playSystemSound(1);
    } else {
        SoundManager.playSystemSound(2);
    }
    Cheat_Menu.update_menu();
};