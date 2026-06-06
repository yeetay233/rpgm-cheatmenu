// ============================================================
// Cheat Menu - Progression Cheats (EXP, Stats, Gold)
// ============================================================

Cheat_Menu.give_exp = function (actor, amount) {
    if (actor instanceof Game_Actor) {
        actor.gainExp(amount);
    }
};

Cheat_Menu.give_stat = function (actor, stat_index, amount) {
    if (actor instanceof Game_Actor) {
        if (actor._paramPlus[stat_index] != undefined) {
            actor.addParam(stat_index, amount);
        }
    }
};

Cheat_Menu.give_gold = function (amount) {
    $gameParty.gainGold(amount);
};