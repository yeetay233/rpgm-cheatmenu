// ============================================================
// Cheat Menu - Page: Teleport
// ============================================================

Cheat_Menu.create_page_teleport = function () {
    Cheat_Menu.append_cheat_title("Teleport");

    Cheat_Menu.append_searchable_list(
        $dataMapInfos,
        Cheat_Menu.teleport_location.m,
        function (idx) {
            Cheat_Menu.teleport_location.m = idx;
            var listEl = document.querySelector('.cheat_list');
            if (listEl) Cheat_Menu.list_state.scroll = listEl.scrollTop;
            SoundManager.playSystemSound(0);
            Cheat_Menu.update_menu();
        },
        function (item, idx) { return item ? item.name : "Map " + idx; },
        true,
        null,
        null, null, "teleport"
    );

    Cheat_Menu.append_cheat("Current Position", "Fill", null, function () {
        Cheat_Menu.teleport_location.m = $gameMap.mapId();
        Cheat_Menu.teleport_location.x = $gamePlayer.x;
        Cheat_Menu.teleport_location.y = $gamePlayer.y;
        SoundManager.playSystemSound(0);
        Cheat_Menu.update_menu();
    });

    // Combined X/Y coordinates row
    var coordRow = document.createElement('div');
    coordRow.className = "cheat_control_grid";
    var coordLabel = document.createElement('div');
    coordLabel.className = "cheat_control_label";
    coordLabel.innerHTML = "Coordinates";
    var coordActions = document.createElement('div');
    coordActions.className = "cheat_control_actions";
    var coordBtnRow = document.createElement('div');
    coordBtnRow.className = "cheat_btn_row";
    coordBtnRow.style.gap = "12px";
    // X cluster
    var xCluster = document.createElement('span');
    xCluster.className = "cheat_coord_cluster";
    var xLabelEl = document.createElement('span');
    xLabelEl.className = "cheat_val_xy";
    xLabelEl.innerHTML = "X:";
    var xBtnLeft = document.createElement('button');
    xBtnLeft.className = "cheat_btn";
    xBtnLeft.innerHTML = "◄";
    Cheat_Menu.addEvent(xBtnLeft, Cheat_Menu.scroll_x_teleport_selection.bind(null, "left"));
    var xVal = document.createElement('span');
    xVal.className = "cheat_value";
    xVal.innerHTML = Cheat_Menu.teleport_location.x;
    xVal.style.minWidth = "20px";
    var xBtnRight = document.createElement('button');
    xBtnRight.className = "cheat_btn";
    xBtnRight.innerHTML = "►";
    Cheat_Menu.addEvent(xBtnRight, Cheat_Menu.scroll_x_teleport_selection.bind(null, "right"));
    xCluster.appendChild(xLabelEl);
    xCluster.appendChild(xBtnLeft);
    xCluster.appendChild(xVal);
    xCluster.appendChild(xBtnRight);
    // Y cluster
    var yCluster = document.createElement('span');
    yCluster.className = "cheat_coord_cluster";
    var yLabelEl = document.createElement('span');
    yLabelEl.className = "cheat_val_xy";
    yLabelEl.innerHTML = "Y:";
    var yBtnLeft = document.createElement('button');
    yBtnLeft.className = "cheat_btn";
    yBtnLeft.innerHTML = "◄";
    Cheat_Menu.addEvent(yBtnLeft, Cheat_Menu.scroll_y_teleport_selection.bind(null, "left"));
    var yVal = document.createElement('span');
    yVal.className = "cheat_value";
    yVal.innerHTML = Cheat_Menu.teleport_location.y;
    yVal.style.minWidth = "20px";
    var yBtnRight = document.createElement('button');
    yBtnRight.className = "cheat_btn";
    yBtnRight.innerHTML = "►";
    Cheat_Menu.addEvent(yBtnRight, Cheat_Menu.scroll_y_teleport_selection.bind(null, "right"));
    yCluster.appendChild(yLabelEl);
    yCluster.appendChild(yBtnLeft);
    yCluster.appendChild(yVal);
    yCluster.appendChild(yBtnRight);
    coordBtnRow.appendChild(xCluster);
    coordBtnRow.appendChild(yCluster);
    coordActions.appendChild(coordBtnRow);
    coordRow.appendChild(coordLabel);
    coordRow.appendChild(coordActions);
    Cheat_Menu.content.appendChild(coordRow);

    // Action row
    var tRow = document.createElement('div');
    tRow.className = "cheat_control_grid";
    var tLabel = document.createElement('div');
    tLabel.className = "cheat_control_label";
    tLabel.innerHTML = "Action";
    var tActions = document.createElement('div');
    tActions.className = "cheat_control_actions";
    var tBtnRow = document.createElement('div');
    tBtnRow.className = "cheat_btn_row";
    var tBtn = document.createElement('button');
    tBtn.className = "cheat_btn";
    tBtn.style.minWidth = "56px";
    tBtn.innerHTML = "Activate";
    Cheat_Menu.addEvent(tBtn, function (e) { e.preventDefault(); Cheat_Menu.teleport_current_location(); });
    tBtnRow.appendChild(tBtn);
    var tnBtn = document.createElement('button');
    tnBtn.className = "cheat_btn";
    tnBtn.style.minWidth = "56px";
    tnBtn.innerHTML = "TP + NoClip";
    Cheat_Menu.addEvent(tnBtn, function (e) { e.preventDefault(); Cheat_Menu.teleport_current_location(); $gamePlayer._through = true; SoundManager.playSystemSound(1); });
    tBtnRow.appendChild(tnBtn);
    tActions.appendChild(tBtnRow);
    tRow.appendChild(tLabel);
    tRow.appendChild(tActions);
    Cheat_Menu.content.appendChild(tRow);
};

Cheat_Menu.scroll_x_teleport_selection = function (direction) {
    if (direction == "left") {
        Cheat_Menu.teleport_location.x--;
        if (Cheat_Menu.teleport_location.x < 0) {
            Cheat_Menu.teleport_location.x = 255;
        }
    } else {
        Cheat_Menu.teleport_location.x++;
        if (Cheat_Menu.teleport_location.x > 255) {
            Cheat_Menu.teleport_location.x = 0;
        }
    }
    SoundManager.playSystemSound(0);
    Cheat_Menu.update_menu();
};

Cheat_Menu.scroll_y_teleport_selection = function (direction) {
    if (direction == "left") {
        Cheat_Menu.teleport_location.y--;
        if (Cheat_Menu.teleport_location.y < 0) {
            Cheat_Menu.teleport_location.y = 255;
        }
    } else {
        Cheat_Menu.teleport_location.y++;
        if (Cheat_Menu.teleport_location.y > 255) {
            Cheat_Menu.teleport_location.y = 0;
        }
    }
    SoundManager.playSystemSound(0);
    Cheat_Menu.update_menu();
};

Cheat_Menu.teleport_current_location = function () {
    Cheat_Menu.teleport(Cheat_Menu.teleport_location.m, Cheat_Menu.teleport_location.x, Cheat_Menu.teleport_location.y);
    SoundManager.playSystemSound(1);
    Cheat_Menu.update_menu();
};
