// ============================================================
// Cheat Menu - Movement Cheats (Speed, No-Clip, Teleport)
// ============================================================

Cheat_Menu.initialize_speed_lock = function () {
    if (Cheat_Menu.speed === null || typeof Cheat_Menu.speed !== 'number') {
        Cheat_Menu.speed_initialized = false;
    }
    if (!Cheat_Menu.speed_initialized) {
        Cheat_Menu.speed = $gamePlayer._moveSpeed;
        Object.defineProperty($gamePlayer, "_moveSpeed", {
            get: function () { return Cheat_Menu.speed; },
            set: function (newVal) { if (Cheat_Menu.speed_unlocked) { Cheat_Menu.speed = newVal; } }
        });
        Cheat_Menu.speed_initialized = true;
    }
};

Cheat_Menu.change_player_speed = function (amount) {
    Cheat_Menu.initialize_speed_lock();
    Cheat_Menu.speed += amount;
};

Cheat_Menu.toggle_lock_player_speed = function () {
    Cheat_Menu.initialize_speed_lock();
    Cheat_Menu.speed_unlocked = !Cheat_Menu.speed_unlocked;
};

Cheat_Menu.teleport = function (map_id, x_pos, y_pos) {
    $gamePlayer.reserveTransfer(map_id, x_pos, y_pos, $gamePlayer.direction(), 0);
    $gamePlayer.setPosition(x_pos, y_pos);
};