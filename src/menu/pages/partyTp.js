// ============================================================
// Cheat Menu - Page: Party TP
// ============================================================

Cheat_Menu.create_page_party_tp = function () {
    Cheat_Menu.append_cheat_title("Party TP");
    Cheat_Menu.append_title("Alive");
    Cheat_Menu.append_cheat("Party TP to 0", "Activate", null, function () {
        Cheat_Menu.set_party_tp(0, true);
        SoundManager.playSystemSound(1);
    });
    Cheat_Menu.append_cheat("Party TP to 1", "Activate", null, function () {
        Cheat_Menu.set_party_tp(1, true);
        SoundManager.playSystemSound(1);
    });
    Cheat_Menu.append_cheat("Party Full TP", "Activate", null, function () {
        Cheat_Menu.recover_party_tp(true);
        SoundManager.playSystemSound(1);
    });
    Cheat_Menu.append_title("All");
    Cheat_Menu.append_cheat("Party TP to 0", "Activate", null, function () {
        Cheat_Menu.set_party_tp(0, false);
        SoundManager.playSystemSound(1);
    });
    Cheat_Menu.append_cheat("Party TP to 1", "Activate", null, function () {
        Cheat_Menu.set_party_tp(1, false);
        SoundManager.playSystemSound(1);
    });
    Cheat_Menu.append_cheat("Party Full TP", "Activate", null, function () {
        Cheat_Menu.recover_party_tp(false);
        SoundManager.playSystemSound(1);
    });
};