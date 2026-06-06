// ============================================================
// Cheat Menu - Page: No Clip
// ============================================================

Cheat_Menu.create_page_no_clip = function () {
    Cheat_Menu.append_cheat_title("No Clip");
    Cheat_Menu.append_no_clip_status();
};

Cheat_Menu.toggle_no_clip_status = function () {
    $gamePlayer._through = !($gamePlayer._through);
    Cheat_Menu.update_menu();
    if ($gamePlayer._through) {
        SoundManager.playSystemSound(1);
    } else {
        SoundManager.playSystemSound(2);
    }
};

Cheat_Menu.append_no_clip_status = function () {
    var status_text;
    if ($gamePlayer._through) {
        status_text = "<font color='#00ff00'>on</font>";
    } else {
        status_text = "<font color='#ff0000'>off</font>";
    }
    Cheat_Menu.append_cheat("Status:", status_text, null, Cheat_Menu.toggle_no_clip_status);
};