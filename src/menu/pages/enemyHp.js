// ============================================================
// Cheat Menu - Page: Enemy HP
// ============================================================

Cheat_Menu.create_page_enemy_hp = function () {
    Cheat_Menu.append_cheat_title("Enemy HP");
    Cheat_Menu.append_title("Alive");
    Cheat_Menu.append_cheat("Enemy HP to 0", "Activate", null, function () {
        Cheat_Menu.set_enemy_hp(0, true);
        SoundManager.playSystemSound(1);
    });
    Cheat_Menu.append_cheat("Enemy HP to 1", "Activate", null, function () {
        Cheat_Menu.set_enemy_hp(1, true);
        SoundManager.playSystemSound(1);
    });
    Cheat_Menu.append_title("All");
    Cheat_Menu.append_cheat("Enemy HP to 0", "Activate", null, function () {
        Cheat_Menu.set_enemy_hp(0, false);
        SoundManager.playSystemSound(1);
    });
    Cheat_Menu.append_cheat("Enemy HP to 1", "Activate", null, function () {
        Cheat_Menu.set_enemy_hp(1, false);
        SoundManager.playSystemSound(1);
    });
};