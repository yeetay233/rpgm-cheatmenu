// ============================================================
// Cheat Menu - Combat Cheats (God Mode, HP/MP/TP, Enemy)
// ============================================================

Cheat_Menu.god_mode = function (actor) {
    if (actor instanceof Game_Actor && !(actor.god_mode)) {
        actor.god_mode = true;

        actor.gainHP_bkup = actor.gainHp;
        actor.gainHp = function (value) {
            value = this.mhp;
            this.gainHP_bkup(value);
        };

        actor.setHp_bkup = actor.setHp;
        actor.setHp = function (hp) {
            hp = this.mhp;
            this.setHp_bkup(hp);
        };

        actor.gainMp_bkup = actor.gainMp;
        actor.gainMp = function (value) {
            value = this.mmp;
            this.gainMp_bkup(value);
        };

        actor.setMp_bkup = actor.setMp;
        actor.setMp = function (mp) {
            mp = this.mmp;
            this.setMp_bkup(mp);
        };

        actor.gainTp_bkup = actor.gainTp;
        actor.gainTp = function (value) {
            value = this.maxTp();
            this.gainTp_bkup(value);
        };

        actor.setTp_bkup = actor.setTp;
        actor.setTp = function (tp) {
            tp = this.maxTp();
            this.setTp_bkup(tp);
        };

        actor.paySkillCost_bkup = actor.paySkillCost;
        actor.paySkillCost = function (skill) {
            // do nothing
        };

        actor.god_mode_interval = setInterval(function () {
            actor.gainHp(actor.mhp);
            actor.gainMp(actor.mmp);
            actor.gainTp(actor.maxTp());
        }, 100);
    }
};

Cheat_Menu.god_mode_off = function (actor) {
    if (actor instanceof Game_Actor && actor.god_mode) {
        actor.god_mode = false;

        actor.gainHp = actor.gainHP_bkup;
        actor.setHp = actor.setHp_bkup;
        actor.gainMp = actor.gainMp_bkup;
        actor.setMp = actor.setMp_bkup;
        actor.gainTp = actor.gainTp_bkup;
        actor.setTp = actor.setTp_bkup;
        actor.paySkillCost = actor.paySkillCost_bkup;

        clearInterval(actor.god_mode_interval);
    }
};

Cheat_Menu.god_mode_toggle = function () {
    var actor = $gameActors._data[Cheat_Menu.cheat_selected_actor];
    if (actor) {
        if (!actor.god_mode) {
            Cheat_Menu.god_mode(actor);
            SoundManager.playSystemSound(1);
        } else {
            Cheat_Menu.god_mode_off(actor);
            SoundManager.playSystemSound(2);
        }
        Cheat_Menu.update_menu();
    }
};

Cheat_Menu.set_party_hp = function (hp, alive) {
    var members = $gameParty.allMembers();
    for (var i = 0; i < members.length; i++) {
        if ((alive && members[i]._hp != 0) || !alive) {
            members[i].setHp(hp);
        }
    }
};

Cheat_Menu.set_party_mp = function (mp, alive) {
    var members = $gameParty.allMembers();
    for (var i = 0; i < members.length; i++) {
        if ((alive && members[i]._hp != 0) || !alive) {
            members[i].setMp(mp);
        }
    }
};

Cheat_Menu.set_party_tp = function (tp, alive) {
    var members = $gameParty.allMembers();
    for (var i = 0; i < members.length; i++) {
        if ((alive && members[i]._hp != 0) || !alive) {
            members[i].setTp(tp);
        }
    }
};

Cheat_Menu.recover_party_hp = function (alive) {
    var members = $gameParty.allMembers();
    for (var i = 0; i < members.length; i++) {
        if ((alive && members[i]._hp != 0) || !alive) {
            members[i].setHp(members[i].mhp);
        }
    }
};

Cheat_Menu.recover_party_mp = function (alive) {
    var members = $gameParty.allMembers();
    for (var i = 0; i < members.length; i++) {
        if ((alive && members[i]._hp != 0) || !alive) {
            members[i].setMp(members[i].mmp);
        }
    }
};

Cheat_Menu.recover_party_tp = function (alive) {
    var members = $gameParty.allMembers();
    for (var i = 0; i < members.length; i++) {
        if ((alive && members[i]._hp != 0) || !alive) {
            members[i].setTp(members[i].maxTp());
        }
    }
};

Cheat_Menu.set_enemy_hp = function (hp, alive) {
    var members = $gameTroop.members();
    for (var i = 0; i < members.length; i++) {
        if (members[i]) {
            if ((alive && members[i]._hp != 0) || !alive) {
                members[i].setHp(hp);
            }
        }
    }
};

Cheat_Menu.clear_actor_states = function (actor) {
    if (actor instanceof Game_Actor) {
        if (actor._states != undefined && actor._states.length > 0) {
            actor.clearStates();
        }
    }
};

Cheat_Menu.clear_party_states = function () {
    var members = $gameParty.allMembers();
    for (var i = 0; i < members.length; i++) {
        Cheat_Menu.clear_actor_states(members[i]);
    }
};