// ============================================================
// Cheat Menu - Inventory Cheats (Items, Weapons, Armor)
// ============================================================

Cheat_Menu.give_item = function (item_id, amount) {
    if ($dataItems[item_id] != undefined) {
        $gameParty.gainItem($dataItems[item_id], amount);
    }
};

Cheat_Menu.give_weapon = function (weapon_id, amount) {
    if ($dataWeapons[weapon_id] != undefined) {
        $gameParty.gainItem($dataWeapons[weapon_id], amount);
    }
};

Cheat_Menu.give_armor = function (armor_id, amount) {
    if ($dataArmors[armor_id] != undefined) {
        $gameParty.gainItem($dataArmors[armor_id], amount);
    }
};