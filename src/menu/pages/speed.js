// ============================================================
// Cheat Menu - Page: Movement (Speed + Noclip merged)
// ============================================================

Cheat_Menu.create_page_speed = function () {
    Cheat_Menu.append_cheat_title("Movement");
    Cheat_Menu.initialize_speed_lock();

    Cheat_Menu.append_sub_header("Speed");

    // Presets as compact grid row
    var presets = [
        { label: "Slow", speed: 2 },
        { label: "Normal", speed: 4 },
        { label: "Fast", speed: 5 },
        { label: "Max", speed: 6 }
    ];
    var pRow = document.createElement('div');
    pRow.className = "cheat_control_grid";
    var pLabel = document.createElement('div');
    pLabel.className = "cheat_control_label";
    pLabel.innerHTML = "Presets";
    var pActions = document.createElement('div');
    pActions.className = "cheat_control_actions";
    var pBtnRow = document.createElement('div');
    pBtnRow.className = "cheat_btn_row";
    for (var i = 0; i < presets.length; i++) {
        (function (p) {
            var btn = document.createElement('button');
            btn.className = "cheat_btn";
            btn.style.minWidth = "44px";
            btn.innerHTML = p.label;
            Cheat_Menu.addEvent(btn, function (e) {
                e.preventDefault();
                Cheat_Menu.change_player_speed(p.speed - $gamePlayer._moveSpeed);
                SoundManager.playSystemSound(1);
                Cheat_Menu.update_menu();
            });
            pBtnRow.appendChild(btn);
        })(presets[i]);
    }
    pActions.appendChild(pBtnRow);
    pRow.appendChild(pLabel);
    pRow.appendChild(pActions);
    Cheat_Menu.content.appendChild(pRow);

    var currentSpeed = "Speed: <font color='#44cc55'>" + Cheat_Menu.speed + "</font>";
    Cheat_Menu.append_scroll_selector(currentSpeed, null, null, function (dir) {
        Cheat_Menu.change_player_speed(dir === "left" ? -1 : 1);
        SoundManager.playSystemSound(dir === "left" ? 2 : 1);
        Cheat_Menu.update_menu();
    });

    var lockText;
    if (!Cheat_Menu.speed_unlocked) {
        lockText = "<font color='#00ff00'>Locked</font>";
    } else {
        lockText = "<font color='#ff0000'>Unlocked</font>";
    }
    Cheat_Menu.append_cheat("Speed Lock", lockText, null, Cheat_Menu.apply_speed_lock_toggle);

    Cheat_Menu.append_sub_header("No Clip");
    var ncText;
    if ($gamePlayer._through) {
        ncText = "<font color='#00ff00'>on</font>";
    } else {
        ncText = "<font color='#ff0000'>off</font>";
    }
    Cheat_Menu.append_cheat("Status:", ncText, null, Cheat_Menu.toggle_no_clip_status);
};

Cheat_Menu.apply_speed_lock_toggle = function () {
    Cheat_Menu.toggle_lock_player_speed();
    SoundManager.playSystemSound(Cheat_Menu.speed_unlocked ? 2 : 1);
    Cheat_Menu.update_menu();
};

Cheat_Menu.toggle_no_clip_status = function () {
    $gamePlayer._through = !($gamePlayer._through);
    SoundManager.playSystemSound($gamePlayer._through ? 1 : 2);
    Cheat_Menu.update_menu();
};
