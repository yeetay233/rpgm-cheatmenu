// ============================================================
// Cheat Menu - Page: Saves (10 in-memory savestate slots)
// ============================================================

Cheat_Menu.build_savestate_row = function (label, state, onSave, onLoad) {
    var row = document.createElement('div');
    row.className = "cheat_control_grid";

    var labelEl = document.createElement('div');
    labelEl.className = "cheat_control_label";
    labelEl.innerHTML = label;

    var actions = document.createElement('div');
    actions.className = "cheat_control_actions";

    var btnRow = document.createElement('div');
    btnRow.className = "cheat_btn_row";

    var btnSave = document.createElement('button');
    btnSave.className = "cheat_btn";
    btnSave.innerHTML = "Save State";
    btnSave.style.minWidth = "80px";
    Cheat_Menu.addEvent(btnSave, function (e) {
        e.preventDefault();
        onSave();
        Cheat_Menu.update_menu();
    });

    var btnLoad = document.createElement('button');
    btnLoad.className = "cheat_btn";
    btnLoad.innerHTML = "Load State";
    btnLoad.style.minWidth = "80px";
    if (!state) {
        btnLoad.style.opacity = "0.4";
    }
    Cheat_Menu.addEvent(btnLoad, function (e) {
        e.preventDefault();
        onLoad();
    });

    btnRow.appendChild(btnSave);
    btnRow.appendChild(btnLoad);
    actions.appendChild(btnRow);
    row.appendChild(labelEl);
    row.appendChild(actions);
    return row;
};

Cheat_Menu.make_slot_label = function (prefix, state) {
    if (state && state.map) {
        var mapId = state.map._mapId || "?";
        var mapName = ($dataMapInfos && $dataMapInfos[mapId]) ? $dataMapInfos[mapId].name : "Map " + mapId;
        return prefix + ": <span style='color:#aaa;'>" + mapName + "</span>";
    }
    return prefix + ": <span style='color:#666;'>Empty</span>";
};

Cheat_Menu.create_page_saves = function () {
    Cheat_Menu.append_cheat_title("States");

    // Quick Save slot (index 0)
    var qs = Cheat_Menu.quick_savestate;
    var qsLabel = Cheat_Menu.make_slot_label("Quick Save", qs);
    var qsRow = Cheat_Menu.build_savestate_row(qsLabel, qs,
        function () {
            if (!DataManager || !DataManager.makeSaveContents) return;
            var captured = Cheat_Menu.capture_savestate();
            if (captured) {
                Cheat_Menu.quick_savestate = captured;
                Cheat_Menu.persist_savestates();
                SoundManager.playSystemSound(1);
            }
        },
        function () {
            var s = Cheat_Menu.quick_savestate;
            if (!s) {
                SoundManager.playSystemSound(2);
                return;
            }
            Cheat_Menu.load_savestate(s);
        }
    );
    Cheat_Menu.content.appendChild(qsRow);

    // Regular savestate slots (1-10)
    for (var i = 0; i < 10; i++) {
        var state = Cheat_Menu.savestates[i];
        var slotLabel = Cheat_Menu.make_slot_label("Savestate " + (i + 1), state);
        var row = Cheat_Menu.build_savestate_row(slotLabel, state,
            function (idx) {
                return function () {
                    if (!DataManager || !DataManager.makeSaveContents) return;
                    var captured = Cheat_Menu.capture_savestate();
                    if (captured) {
                        Cheat_Menu.savestates[idx] = captured;
                        Cheat_Menu.persist_savestates();
                        SoundManager.playSystemSound(1);
                    }
                };
            }(i),
            function (idx) {
                return function () {
                    var s = Cheat_Menu.savestates[idx];
                    if (!s) {
                        SoundManager.playSystemSound(2);
                        return;
                    }
                    Cheat_Menu.load_savestate(s);
                };
            }(i)
        );
        Cheat_Menu.content.appendChild(row);
    }
};
