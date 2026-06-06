// ============================================================
// Cheat Menu - Page: Party MP
// ============================================================

Cheat_Menu.create_page_party_mp = function () {
    Cheat_Menu.append_cheat_title("Party MP");
    Cheat_Menu.append_title("Alive");
    Cheat_Menu.append_cheat("Party MP to 0", "Activate", null, function () {
        Cheat_Menu.set_party_mp(0, true);
        SoundManager.playSystemSound(1);
    });
    Cheat_Menu.append_cheat("Party MP to 1", "Activate", null, function () {
        Cheat_Menu.set_party_mp(1, true);
        SoundManager.playSystemSound(1);
    });
    Cheat_Menu.append_cheat("Party Full MP", "Activate", null, function () {
        Cheat_Menu.recover_party_mp(true);
        SoundManager.playSystemSound(1);
    });
    Cheat_Menu.append_title("All");
    Cheat_Menu.append_cheat("Party MP to 0", "Activate", null, function () {
        Cheat_Menu.set_party_mp(0, false);
        SoundManager.playSystemSound(1);
    });
    Cheat_Menu.append_cheat("Party MP to 1", "Activate", null, function () {
        Cheat_Menu.set_party_mp(1, false);
        SoundManager.playSystemSound(1);
    });
    Cheat_Menu.append_cheat("Party Full MP", "Activate", null, function () {
        Cheat_Menu.recover_party_mp(false);
        SoundManager.playSystemSound(1);
    });
};