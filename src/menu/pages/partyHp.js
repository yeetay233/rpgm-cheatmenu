// ============================================================
// Cheat Menu - Page: Party HP
// ============================================================

Cheat_Menu.create_page_party_hp = function () {
    Cheat_Menu.append_cheat_title("Party HP");
    Cheat_Menu.append_title("Alive");
    Cheat_Menu.append_cheat("Party HP to 0", "Activate", null, function () {
        Cheat_Menu.set_party_hp(0, true);
        SoundManager.playSystemSound(1);
    });
    Cheat_Menu.append_cheat("Party HP to 1", "Activate", null, function () {
        Cheat_Menu.set_party_hp(1, true);
        SoundManager.playSystemSound(1);
    });
    Cheat_Menu.append_cheat("Party Full HP", "Activate", null, function () {
        Cheat_Menu.recover_party_hp(true);
        SoundManager.playSystemSound(1);
    });
    Cheat_Menu.append_title("All");
    Cheat_Menu.append_cheat("Party HP to 0", "Activate", null, function () {
        Cheat_Menu.set_party_hp(0, false);
        SoundManager.playSystemSound(1);
    });
    Cheat_Menu.append_cheat("Party HP to 1", "Activate", null, function () {
        Cheat_Menu.set_party_hp(1, false);
        SoundManager.playSystemSound(1);
    });
    Cheat_Menu.append_cheat("Party Full HP", "Activate", null, function () {
        Cheat_Menu.recover_party_hp(false);
        SoundManager.playSystemSound(1);
    });
};