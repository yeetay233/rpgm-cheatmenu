/////////////////////////////////////////////////
// Cheat Menu Plugin Class
/////////////////////////////////////////////////
// Check if already defined (allows game specific extensions to be loaded in any order)
if (typeof Cheat_Menu == "undefined") { Cheat_Menu = {}; }

Cheat_Menu.initialized = false;
Cheat_Menu.cheat_menu_open = false;
Cheat_Menu.overlay_openable = false;
Cheat_Menu.position = 0;
Cheat_Menu.menu_update_timer = null;

Cheat_Menu.cheat_selected = 0;
Cheat_Menu.cheat_selected_actor = 1;
Cheat_Menu.amounts = [1, 10, 100, 1000, 10000, 100000, 1000000];
Cheat_Menu.amount_index = 0;
Cheat_Menu.stat_selection = 0;
Cheat_Menu.item_selection = 1;
Cheat_Menu.weapon_selection = 1;
Cheat_Menu.armor_selection = 1;
Cheat_Menu.move_amounts = [0.5, 1, 1.5, 2];
Cheat_Menu.move_amount_index = 1;

Cheat_Menu.variable_selection = 1;
Cheat_Menu.switch_selection = 1;

Cheat_Menu.saved_positions = [{ m: -1, x: -1, y: -1 }, { m: -1, x: -1, y: -1 }, { m: -1, x: -1, y: -1 }];

Cheat_Menu.teleport_location = { m: 1, x: 0, y: 0 };

Cheat_Menu.speed = null;
Cheat_Menu.speed_unlocked = true;
Cheat_Menu.speed_initialized = false;


/////////////////////////////////////////////////
// Initial values for reseting on new game/load
/////////////////////////////////////////////////

// Check if already defined (allows game specific extensions to be loaded in any order)
if (typeof Cheat_Menu.initial_values == "undefined") { Cheat_Menu.initial_values = {}; }


// All values below are the inital values for a new saved game
//	upon loading a saved game these values will be loaded from the
//	save game if possible overwriting the below values
//	Because of this all of these variables should be non recursive
Cheat_Menu.initial_values.position = 0;
Cheat_Menu.initial_values.cheat_selected = 0;
Cheat_Menu.initial_values.cheat_selected_actor = 1;
Cheat_Menu.initial_values.amount_index = 0;
Cheat_Menu.initial_values.stat_selection = 0;
Cheat_Menu.initial_values.item_selection = 1;
Cheat_Menu.initial_values.weapon_selection = 1;
Cheat_Menu.initial_values.armor_selection = 1;
Cheat_Menu.initial_values.move_amount_index = 1;
Cheat_Menu.initial_values.variable_selection = 1;
Cheat_Menu.initial_values.switch_selection = 1;
Cheat_Menu.initial_values.saved_positions = [{ m: -1, x: -1, y: -1 }, { m: -1, x: -1, y: -1 }, { m: -1, x: -1, y: -1 }];
Cheat_Menu.initial_values.teleport_location = { m: 1, x: 0, y: 0 };
Cheat_Menu.initial_values.speed = null;
Cheat_Menu.initial_values.speed_unlocked = true;

Cheat_Menu.initial_values.fontSize = 14;
Cheat_Menu.initial_values.menu_scale = 100;

Cheat_Menu.initial_values.btn_config = {
	enabled: true,
	opacity: 30,
	size: 40,
	posIndex: 1
};

Cheat_Menu.initial_values.hud_config = {
	enabled: false,
	position: 'Top',
	opacity: 40,
	fontSize: 12,
	active: ['party_full_hp', 'enemy_hp_0', 'toggle_noclip', 'open_inv', 'open_vars']
};

/////////////////////////////////////////////////
// Cheat Functions
/////////////////////////////////////////////////

// enable god mode for an actor
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


// disable god mode for an actor
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

// set all party hp
Cheat_Menu.set_party_hp = function (hp, alive) {
	var members = $gameParty.allMembers();
	for (var i = 0; i < members.length; i++) {
		if ((alive && members[i]._hp != 0) || !alive) {
			members[i].setHp(hp);
		}
	}
};

// set all party mp
Cheat_Menu.set_party_mp = function (mp, alive) {
	var members = $gameParty.allMembers();
	for (var i = 0; i < members.length; i++) {
		if ((alive && members[i]._hp != 0) || !alive) {
			members[i].setMp(mp);
		}
	}
};

// set all party tp
Cheat_Menu.set_party_tp = function (tp, alive) {
	var members = $gameParty.allMembers();
	for (var i = 0; i < members.length; i++) {
		if ((alive && members[i]._hp != 0) || !alive) {
			members[i].setTp(tp);
		}
	}
};

// party full recover hp
Cheat_Menu.recover_party_hp = function (alive) {
	var members = $gameParty.allMembers();
	for (var i = 0; i < members.length; i++) {
		if ((alive && members[i]._hp != 0) || !alive) {
			members[i].setHp(members[i].mhp);
		}
	}
};

// party full recover mp
Cheat_Menu.recover_party_mp = function (alive) {
	var members = $gameParty.allMembers();
	for (var i = 0; i < members.length; i++) {
		if ((alive && members[i]._hp != 0) || !alive) {
			members[i].setMp(members[i].mmp);
		}
	}
};

// party max tp
Cheat_Menu.recover_party_tp = function (alive) {
	var members = $gameParty.allMembers();
	for (var i = 0; i < members.length; i++) {
		if ((alive && members[i]._hp != 0) || !alive) {
			members[i].setTp(members[i].maxTp());
		}
	}
};

// set all enemies hp
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

// increase exp
Cheat_Menu.give_exp = function (actor, amount) {
	if (actor instanceof Game_Actor) {
		actor.gainExp(amount);
	}
};

// increase stat bonus
Cheat_Menu.give_stat = function (actor, stat_index, amount) {
	if (actor instanceof Game_Actor) {
		if (actor._paramPlus[stat_index] != undefined) {
			actor.addParam(stat_index, amount);
		}
	}
};

// increase gold
Cheat_Menu.give_gold = function (amount) {
	$gameParty.gainGold(amount);
};

// increase item count for party of item, by id
Cheat_Menu.give_item = function (item_id, amount) {
	if ($dataItems[item_id] != undefined) {
		$gameParty.gainItem($dataItems[item_id], amount);
	}
};

// increase weapon count for party of item, by id
Cheat_Menu.give_weapon = function (weapon_id, amount) {
	if ($dataWeapons[weapon_id] != undefined) {
		$gameParty.gainItem($dataWeapons[weapon_id], amount);
	}
};

// increase armor count for party of item, by id
Cheat_Menu.give_armor = function (armor_id, amount) {
	if ($dataArmors[armor_id] != undefined) {
		$gameParty.gainItem($dataArmors[armor_id], amount);
	}
};

// initialize speed hook for locking
Cheat_Menu.initialize_speed_lock = function () {
	if (!Cheat_Menu.speed_initialized) {
		Cheat_Menu.speed = $gamePlayer._moveSpeed;
		Object.defineProperty($gamePlayer, "_moveSpeed", {
			get: function () { return Cheat_Menu.speed; },
			set: function (newVal) { if (Cheat_Menu.speed_unlocked) { Cheat_Menu.speed = newVal; } }
		});
		Cheat_Menu.speed_initialized = true;
	}
};

// change player movement speed
Cheat_Menu.change_player_speed = function (amount) {
	Cheat_Menu.initialize_speed_lock();
	Cheat_Menu.speed += amount;
};

// toggle locking of player speed
Cheat_Menu.toggle_lock_player_speed = function (amount) {
	Cheat_Menu.initialize_speed_lock();
	Cheat_Menu.speed_unlocked = !Cheat_Menu.speed_unlocked;
};


// clear active states on an actor
Cheat_Menu.clear_actor_states = function (actor) {
	if (actor instanceof Game_Actor) {
		if (actor._states != undefined && actor._states.length > 0) {
			actor.clearStates();
		}
	}
};

// clear active states on party
Cheat_Menu.clear_party_states = function () {
	var members = $gameParty.allMembers();
	for (var i = 0; i < members.length; i++) {
		Cheat_Menu.clear_actor_states(members[i]);
	}
};

// change game variable value, by id
Cheat_Menu.set_variable = function (variable_id, value) {
	if ($dataSystem.variables[variable_id] != undefined) {
		var new_value = $gameVariables.value(variable_id) + value;
		$gameVariables.setValue(variable_id, new_value);
	}
};

// toggle game switch value, by id
Cheat_Menu.toggle_switch = function (switch_id) {
	if ($dataSystem.switches[switch_id] != undefined) {
		$gameSwitches.setValue(switch_id, !$gameSwitches.value(switch_id));
	}
};

// Change location by map id, and x, y position
Cheat_Menu.teleport = function (map_id, x_pos, y_pos) {
	$gamePlayer.reserveTransfer(map_id, x_pos, y_pos, $gamePlayer.direction(), 0);
	$gamePlayer.setPosition(x_pos, y_pos);
};

/////////////////////////////////////////////////
// Cheat Menu overlay
/////////////////////////////////////////////////

// HTML elements and some CSS for positioning
//	other css in in CSS file attached
Cheat_Menu.overlay_box = document.createElement('div');
Cheat_Menu.overlay_box.id = "cheat_menu";

Cheat_Menu.sidebar = document.createElement('div');
Cheat_Menu.sidebar.id = "cheat_menu_sidebar";

Cheat_Menu.content = document.createElement('div');
Cheat_Menu.content.id = "cheat_menu_content";

Cheat_Menu.overlay_box.appendChild(Cheat_Menu.sidebar);
Cheat_Menu.overlay_box.appendChild(Cheat_Menu.content);

// For backwards compatibility with functions expecting Cheat_Menu.overlay
// We will point it to content so old code doesn't crash, but we will rewrite the renderers.
Cheat_Menu.overlay = Cheat_Menu.content;

// Attach other css for styling
Cheat_Menu.style_css = document.createElement("link");
Cheat_Menu.style_css.type = "text/css";
Cheat_Menu.style_css.rel = "stylesheet";
Cheat_Menu.style_css.href = "js/plugins/Cheat_Menu.css";
document.head.appendChild(Cheat_Menu.style_css);

// keep menu in correct location
Cheat_Menu.position_menu = function (event) {
	// reset margins
	Cheat_Menu.overlay_box.style.marginLeft = "0px";
	Cheat_Menu.overlay_box.style.marginTop = "0px";

	//middle of screen
	if (Cheat_Menu.position == 0) {
		Cheat_Menu.overlay_box.style.left = "50%";
		Cheat_Menu.overlay_box.style.top = "50%";
		Cheat_Menu.overlay_box.style.right = "";
		Cheat_Menu.overlay_box.style.bottom = "";
		Cheat_Menu.overlay_box.style.transform = "translate(-50%, -50%)";
	}
	// top left corner
	else if (Cheat_Menu.position == 1) {
		Cheat_Menu.overlay_box.style.left = "5px";
		Cheat_Menu.overlay_box.style.top = "5px";
		Cheat_Menu.overlay_box.style.right = "";
		Cheat_Menu.overlay_box.style.bottom = "";
		Cheat_Menu.overlay_box.style.transform = "none";
	}
	// top right corner
	else if (Cheat_Menu.position == 2) {
		Cheat_Menu.overlay_box.style.left = "";
		Cheat_Menu.overlay_box.style.top = "5px";
		Cheat_Menu.overlay_box.style.right = "5px";
		Cheat_Menu.overlay_box.style.bottom = "";
		Cheat_Menu.overlay_box.style.transform = "none";
	}
	// bottom right corner
	else if (Cheat_Menu.position == 3) {
		Cheat_Menu.overlay_box.style.left = "";
		Cheat_Menu.overlay_box.style.top = "";
		Cheat_Menu.overlay_box.style.right = "5px";
		Cheat_Menu.overlay_box.style.bottom = "5px";
		Cheat_Menu.overlay_box.style.transform = "none";
	}
	// bottom left corner
	else if (Cheat_Menu.position == 4) {
		Cheat_Menu.overlay_box.style.left = "5px";
		Cheat_Menu.overlay_box.style.top = "";
		Cheat_Menu.overlay_box.style.right = "";
		Cheat_Menu.overlay_box.style.bottom = "5px";
		Cheat_Menu.overlay_box.style.transform = "none";
	}
};

/////////////////////////////////////////////////
// Menu item types
/////////////////////////////////////////////////

// insert row with buttons to scroll left and right for some context
//	text: string 
//	key1,key2: ignored, kept for compatibility
//	scroll_handler: single function that handles the left and right scroll arguments should be (direction, event)
//  apply_handler: optional function for an "Apply" button
Cheat_Menu.append_scroll_selector = function (text, key1, key2, scroll_handler, apply_handler) {
	var row = document.createElement('div');
	row.className = "cheat_row";

	var btnLeft = document.createElement('button');
	btnLeft.className = "cheat_btn";
	btnLeft.innerHTML = "←";
	btnLeft.addEventListener('mousedown', scroll_handler.bind(null, "left"));

	var centerText = document.createElement('div');
	centerText.className = "cheat_value";
	centerText.innerHTML = text;
	centerText.style.flex = "1";
	centerText.style.margin = "0 10px";

	var btnRight = document.createElement('button');
	btnRight.className = "cheat_btn";
	btnRight.innerHTML = "→";
	btnRight.addEventListener('mousedown', scroll_handler.bind(null, "right"));

	row.appendChild(btnLeft);
	row.appendChild(centerText);
	row.appendChild(btnRight);

	if (apply_handler) {
		var btnApply = document.createElement('button');
		btnApply.className = "cheat_btn";
		btnApply.innerHTML = "Apply";
		btnApply.style.marginLeft = "10px";
		btnApply.addEventListener('mousedown', apply_handler);
		row.appendChild(btnApply);
	}

	Cheat_Menu.content.appendChild(row);
};

// Insert Add/Remove specific row
Cheat_Menu.append_add_remove = function (text, amount, onApply) {
	var row = document.createElement('div');
	row.className = "cheat_row";

	var label = document.createElement('div');
	label.className = "cheat_label";
	label.innerHTML = text;

	var controls = document.createElement('div');
	controls.className = "cheat_controls";

	var btnRemove = document.createElement('button');
	btnRemove.className = "cheat_btn";
	btnRemove.innerHTML = "- " + amount;
	btnRemove.addEventListener('mousedown', function () { onApply("left"); });

	var btnAdd = document.createElement('button');
	btnAdd.className = "cheat_btn";
	btnAdd.innerHTML = "+ " + amount;
	btnAdd.addEventListener('mousedown', function () { onApply("right"); });

	controls.appendChild(btnRemove);
	controls.appendChild(btnAdd);

	row.appendChild(label);
	row.appendChild(controls);

	Cheat_Menu.content.appendChild(row);
};

// Insert a title row
//	title: string
Cheat_Menu.append_title = function (title) {
	var title_div = document.createElement('div');
	title_div.className = "cheat_menu_title";
	title_div.innerHTML = title;
	Cheat_Menu.content.appendChild(title_div);
};

// Insert a desciption row
//	text: string
Cheat_Menu.append_description = function (text) {
	var desc_div = document.createElement('div');
	desc_div.className = "cheat_label";
	desc_div.style.textAlign = "center";
	desc_div.style.marginBottom = "10px";
	desc_div.innerHTML = text;
	Cheat_Menu.content.appendChild(desc_div);
};

// Append a cheat with some handler to activate
//	cheat_text: string
//	status_text: string 
//	key: ignored, kept for compatibility
//	click_handler: function
Cheat_Menu.append_cheat = function (cheat_text, status_text, key, click_handler) {
	var row = document.createElement('div');
	row.className = "cheat_row";

	var label = document.createElement('div');
	label.className = "cheat_label";
	label.innerHTML = cheat_text;

	var btn = document.createElement('button');
	btn.className = "cheat_btn";
	btn.innerHTML = status_text;
	btn.addEventListener('mousedown', click_handler);

	row.appendChild(label);
	row.appendChild(btn);

	Cheat_Menu.content.appendChild(row);
};

// Append searchable list
Cheat_Menu.append_searchable_list = function (dataArray, selectedIdx, onSelectCallback, getNameFunc, isGrid, getValueFunc) {
	var container = document.createElement('div');
	container.className = "cheat_search_container";

	var searchInput = document.createElement('input');
	searchInput.className = "cheat_search_input";
	searchInput.type = "text";
	searchInput.placeholder = "Search...";

	var listDiv = document.createElement('ul');
	listDiv.className = "cheat_list" + (isGrid ? " grid" : "");

	var renderList = function (filterText) {
		listDiv.innerHTML = "";
		filterText = filterText.toLowerCase();
		for (var i = 1; i < dataArray.length; i++) {
			if (!dataArray[i]) continue;

			var name = getNameFunc ? getNameFunc(dataArray[i], i) : (dataArray[i].name || dataArray[i]);
			if (typeof name !== "string") name = String(name);

			if (name && name.toLowerCase().indexOf(filterText) !== -1) {
				var li = document.createElement('li');
				li.className = "cheat_list_item";
				if (i === selectedIdx) li.className += " selected";
				li.innerHTML = i + ": " + name;

				if (getValueFunc) {
					var valDiv = document.createElement('div');
					valDiv.className = "cheat_list_item_val";
					valDiv.innerHTML = "Value: " + getValueFunc(i);
					li.appendChild(valDiv);
				}

				li.addEventListener('mousedown', (function (idx) {
					return function () {
						onSelectCallback(idx);
					};
				})(i));
				listDiv.appendChild(li);
			}
		}
	};

	searchInput.addEventListener('input', function (e) {
		renderList(e.target.value);
	});

	searchInput.addEventListener('keydown', function (e) {
		e.stopPropagation();
	});

	searchInput.addEventListener('keyup', function (e) {
		e.stopPropagation();
	});

	searchInput.addEventListener('keypress', function (e) {
		e.stopPropagation();
	});

	searchInput.addEventListener('mousedown', function (e) {
		e.stopPropagation();
	});

	searchInput.addEventListener('touchstart', function (e) {
		e.stopPropagation();
	}, { passive: true });

	searchInput.addEventListener('focus', function (e) {
		e.stopPropagation();
	});

	searchInput.addEventListener('click', function (e) {
		e.stopPropagation();
	});

	searchInput.addEventListener('blur', function () {
		setTimeout(function () {
			if (document.activeElement !== searchInput) {
				searchInput.focus();
			}
		}, 50);
	});

	renderList("");

	container.appendChild(searchInput);
	container.appendChild(listDiv);
	Cheat_Menu.content.appendChild(container);

	setTimeout(function () {
		searchInput.setAttribute('autocomplete', 'off');
		searchInput.setAttribute('autocorrect', 'off');
		searchInput.setAttribute('autocapitalize', 'off');
		searchInput.setAttribute('spellcheck', 'false');
	}, 0);
};

// Open a modal to set a value
Cheat_Menu.open_value_modal = function (titleText, currentValue, onSave) {
	var bg = document.createElement('div');
	bg.className = "cheat_modal_bg";

	var modal = document.createElement('div');
	modal.className = "cheat_modal";

	var title = document.createElement('div');
	title.className = "cheat_modal_title";
	title.innerHTML = titleText;

	var input = document.createElement('input');
	input.className = "cheat_search_input";
	input.type = "number";
	input.value = currentValue;
	input.addEventListener('keydown', function (e) { e.stopPropagation(); });

	var btnRow = document.createElement('div');
	btnRow.className = "cheat_modal_buttons";

	var btnCancel = document.createElement('button');
	btnCancel.className = "cheat_btn";
	btnCancel.innerHTML = "Cancel";
	btnCancel.addEventListener('mousedown', function () {
		bg.remove();
	});

	var btnSave = document.createElement('button');
	btnSave.className = "cheat_btn";
	btnSave.innerHTML = "Save";
	btnSave.addEventListener('mousedown', function () {
		onSave(Number(input.value));
		bg.remove();
	});

	btnRow.appendChild(btnCancel);
	btnRow.appendChild(btnSave);

	modal.appendChild(title);
	modal.appendChild(input);
	modal.appendChild(btnRow);
	bg.appendChild(modal);

	bg.addEventListener('mousedown', function (e) {
		if (e.target === bg) bg.remove();
		e.stopPropagation();
	});

	Cheat_Menu.overlay_box.appendChild(bg);
	input.focus();
};

/////////////////////////////////////////////////////////////
// Various functions to settup each page of the cheat menu
/////////////////////////////////////////////////////////////


// Left and right scrollers for handling switching between menus
Cheat_Menu.scroll_cheat = function (direction, event) {
	if (direction == "left") {
		Cheat_Menu.cheat_selected--;
		if (Cheat_Menu.cheat_selected < 0) {
			Cheat_Menu.cheat_selected = Cheat_Menu.menus.length - 1;
		}
	}
	else {
		Cheat_Menu.cheat_selected++;
		if (Cheat_Menu.cheat_selected > Cheat_Menu.menus.length - 1) {
			Cheat_Menu.cheat_selected = 0;
		}
	}

	SoundManager.playSystemSound(0);
	Cheat_Menu.update_menu();
};

// Menu title with scroll options to go between menu, should be first
//	append on each menu
Cheat_Menu.append_cheat_title = function (cheat_name) {
	Cheat_Menu.append_title(cheat_name);
};

// Left and right scrollers for handling switching selected actors
Cheat_Menu.scroll_actor = function (direction, event) {
	if (direction == "left") {
		Cheat_Menu.cheat_selected_actor--;
		if (Cheat_Menu.cheat_selected_actor < 0) {
			Cheat_Menu.cheat_selected_actor = $gameActors._data.length - 1;
		}
	}
	else {
		Cheat_Menu.cheat_selected_actor++;
		if (Cheat_Menu.cheat_selected_actor >= $gameActors._data.length) {
			Cheat_Menu.cheat_selected_actor = 0;
		}
	}

	SoundManager.playSystemSound(0);
	Cheat_Menu.update_menu();
};

// Append actor selection to the menu
Cheat_Menu.append_actor_selection = function (key1, key2) {
	Cheat_Menu.append_title("Actor");

	var actor_name;

	if ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor]._name) {
		actor_name = "<font color='#0088ff'>" + $gameActors._data[Cheat_Menu.cheat_selected_actor]._name + "</font>";
	}
	else {
		actor_name = "<font color='#ff0000'>NULL</font>";
	}

	Cheat_Menu.append_scroll_selector(actor_name, key1, key2, Cheat_Menu.scroll_actor);
};

// Hanler for the god_mode cheat
Cheat_Menu.god_mode_toggle = function (event) {
	if ($gameActors._data[Cheat_Menu.cheat_selected_actor]) {
		if (!($gameActors._data[Cheat_Menu.cheat_selected_actor].god_mode)) {
			Cheat_Menu.god_mode($gameActors._data[Cheat_Menu.cheat_selected_actor]);
			SoundManager.playSystemSound(1);
		}
		else {
			Cheat_Menu.god_mode_off($gameActors._data[Cheat_Menu.cheat_selected_actor]);
			SoundManager.playSystemSound(2);
		}
		Cheat_Menu.update_menu();
	}
};

// Append the god_mode cheat to the menu
Cheat_Menu.append_godmode_status = function () {
	var status_text;
	if ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor].god_mode) {
		status_text = "<font color='#00ff00'>on</font>";
	}
	else {
		status_text = "<font color='#ff0000'>off</font>";
	}

	Cheat_Menu.append_cheat("Status:", status_text, 6, Cheat_Menu.god_mode_toggle);
};

// handler for the enemy hp to 0 cheat alive only
Cheat_Menu.enemy_hp_cheat_1 = function () {
	Cheat_Menu.set_enemy_hp(0, true);
	SoundManager.playSystemSound(1);
};

// handler for the enemy hp to 1 cheat alive only
Cheat_Menu.enemy_hp_cheat_2 = function () {
	Cheat_Menu.set_enemy_hp(1, true);
	SoundManager.playSystemSound(1);
};

// handler for the enemy hp to 0 cheat all
Cheat_Menu.enemy_hp_cheat_3 = function () {
	Cheat_Menu.set_enemy_hp(0, false);
	SoundManager.playSystemSound(1);
};

// handler for the enemy hp to 1 cheat all
Cheat_Menu.enemy_hp_cheat_4 = function () {
	Cheat_Menu.set_enemy_hp(1, false);
	SoundManager.playSystemSound(1);
};

// Append the enemy hp cheats to the menu
Cheat_Menu.append_enemy_cheats = function (key1, key2, key3, key4) {
	Cheat_Menu.append_title("Alive");
	Cheat_Menu.append_cheat("Enemy HP to 0", "Activate", key1, Cheat_Menu.enemy_hp_cheat_1);
	Cheat_Menu.append_cheat("Enemy HP to 1", "Activate", key2, Cheat_Menu.enemy_hp_cheat_2);
	Cheat_Menu.append_title("All");
	Cheat_Menu.append_cheat("Enemy HP to 0", "Activate", key3, Cheat_Menu.enemy_hp_cheat_3);
	Cheat_Menu.append_cheat("Enemy HP to 1", "Activate", key4, Cheat_Menu.enemy_hp_cheat_4);
};

// handler for the party hp cheat to 0 alive only
Cheat_Menu.party_hp_cheat_1 = function () {
	Cheat_Menu.set_party_hp(0, true);
	SoundManager.playSystemSound(1);
};

// handler for the party hp cheat to 1 alive only
Cheat_Menu.party_hp_cheat_2 = function () {
	Cheat_Menu.set_party_hp(1, true);
	SoundManager.playSystemSound(1);
};

// handler for the party hp cheat to full alive only
Cheat_Menu.party_hp_cheat_3 = function () {
	Cheat_Menu.recover_party_hp(true);
	SoundManager.playSystemSound(1);
};

// handler for the party hp cheat to 0 all
Cheat_Menu.party_hp_cheat_4 = function () {
	Cheat_Menu.set_party_hp(1, false);
	SoundManager.playSystemSound(1);
};

// handler for the party hp cheat to 1 all
Cheat_Menu.party_hp_cheat_5 = function () {
	Cheat_Menu.set_party_hp(0, false);
	SoundManager.playSystemSound(1);
};

// handler for the party hp cheat full all
Cheat_Menu.party_hp_cheat_6 = function () {
	Cheat_Menu.recover_party_hp(false);
	SoundManager.playSystemSound(1);
};


// append the party hp cheats
Cheat_Menu.append_hp_cheats = function (key1, key2, key3, key4, key5, key6) {
	Cheat_Menu.append_title("Alive");
	Cheat_Menu.append_cheat("Party HP to 0", "Activate", key1, Cheat_Menu.party_hp_cheat_1);
	Cheat_Menu.append_cheat("Party HP to 1", "Activate", key2, Cheat_Menu.party_hp_cheat_2);
	Cheat_Menu.append_cheat("Party Full HP", "Activate", key3, Cheat_Menu.party_hp_cheat_3);
	Cheat_Menu.append_title("All");
	Cheat_Menu.append_cheat("Party HP to 0", "Activate", key4, Cheat_Menu.party_hp_cheat_4);
	Cheat_Menu.append_cheat("Party HP to 1", "Activate", key5, Cheat_Menu.party_hp_cheat_5);
	Cheat_Menu.append_cheat("Party Full HP", "Activate", key6, Cheat_Menu.party_hp_cheat_6);
};

// handler for the party mp cheat to 0 alive only
Cheat_Menu.party_mp_cheat_1 = function () {
	Cheat_Menu.set_party_mp(0, true);
	SoundManager.playSystemSound(1);
};

// handler for the party mp cheat to 1 alive only
Cheat_Menu.party_mp_cheat_2 = function () {
	Cheat_Menu.set_party_mp(1, true);
	SoundManager.playSystemSound(1);
};

// handler for the party mp cheat to full alive only
Cheat_Menu.party_mp_cheat_3 = function () {
	Cheat_Menu.recover_party_mp(true);
	SoundManager.playSystemSound(1);
};

// handler for the party mp cheat to 0 all
Cheat_Menu.party_mp_cheat_4 = function () {
	Cheat_Menu.set_party_mp(1, false);
	SoundManager.playSystemSound(1);
};

// handler for the party mp cheat to 1 all
Cheat_Menu.party_mp_cheat_5 = function () {
	Cheat_Menu.set_party_mp(0, false);
	SoundManager.playSystemSound(1);
};

// handler for the party mp cheat full all
Cheat_Menu.party_mp_cheat_6 = function () {
	Cheat_Menu.recover_party_mp(false);
	SoundManager.playSystemSound(1);
};


// append the party mp cheats
Cheat_Menu.append_mp_cheats = function (key1, key2, key3, key4, key5, key6) {
	Cheat_Menu.append_title("Alive");
	Cheat_Menu.append_cheat("Party MP to 0", "Activate", key1, Cheat_Menu.party_mp_cheat_1);
	Cheat_Menu.append_cheat("Party MP to 1", "Activate", key2, Cheat_Menu.party_mp_cheat_2);
	Cheat_Menu.append_cheat("Party Full MP", "Activate", key3, Cheat_Menu.party_mp_cheat_3);
	Cheat_Menu.append_title("All");
	Cheat_Menu.append_cheat("Party MP to 0", "Activate", key4, Cheat_Menu.party_mp_cheat_4);
	Cheat_Menu.append_cheat("Party MP to 1", "Activate", key5, Cheat_Menu.party_mp_cheat_5);
	Cheat_Menu.append_cheat("Party Full MP", "Activate", key6, Cheat_Menu.party_mp_cheat_6);
};

// handler for the party tp cheat to 0 alive only
Cheat_Menu.party_tp_cheat_1 = function () {
	Cheat_Menu.set_party_tp(0, true);
	SoundManager.playSystemSound(1);
};

// handler for the party tp cheat to 1 alive only
Cheat_Menu.party_tp_cheat_2 = function () {
	Cheat_Menu.set_party_tp(1, true);
	SoundManager.playSystemSound(1);
};

// handler for the party tp cheat to full alive only
Cheat_Menu.party_tp_cheat_3 = function () {
	Cheat_Menu.recover_party_tp(true);
	SoundManager.playSystemSound(1);
};

// handler for the party tp cheat to 0 all
Cheat_Menu.party_tp_cheat_4 = function () {
	Cheat_Menu.set_party_tp(1, false);
	SoundManager.playSystemSound(1);
};

// handler for the party tp cheat to 1 all
Cheat_Menu.party_tp_cheat_5 = function () {
	Cheat_Menu.set_party_tp(0, false);
	SoundManager.playSystemSound(1);
};

// handler for the party tp cheat full all
Cheat_Menu.party_tp_cheat_6 = function () {
	Cheat_Menu.recover_party_tp(false);
	SoundManager.playSystemSound(1);
};


// append the party tp cheats
Cheat_Menu.append_tp_cheats = function (key1, key2, key3, key4, key5, key6) {
	Cheat_Menu.append_title("Alive");
	Cheat_Menu.append_cheat("Party TP to 0", "Activate", key1, Cheat_Menu.party_tp_cheat_1);
	Cheat_Menu.append_cheat("Party TP to 1", "Activate", key2, Cheat_Menu.party_tp_cheat_2);
	Cheat_Menu.append_cheat("Party Full TP", "Activate", key3, Cheat_Menu.party_tp_cheat_3);
	Cheat_Menu.append_title("All");
	Cheat_Menu.append_cheat("Party TP to 0", "Activate", key4, Cheat_Menu.party_tp_cheat_4);
	Cheat_Menu.append_cheat("Party TP to 1", "Activate", key5, Cheat_Menu.party_tp_cheat_5);
	Cheat_Menu.append_cheat("Party Full TP", "Activate", key6, Cheat_Menu.party_tp_cheat_6);
};

// handler for the toggle no clip cheat
Cheat_Menu.toggle_no_clip_status = function (event) {
	$gamePlayer._through = !($gamePlayer._through);
	Cheat_Menu.update_menu();
	if ($gamePlayer._through) {
		SoundManager.playSystemSound(1);
	}
	else {
		SoundManager.playSystemSound(2);
	}
};

// appen the no clip cheat
Cheat_Menu.append_no_clip_status = function (key1) {
	var status_text;
	if ($gamePlayer._through) {
		status_text = "<font color='#00ff00'>on</font>";
	}
	else {
		status_text = "<font color='#ff0000'>off</font>";
	}

	Cheat_Menu.append_cheat("Status:", status_text, key1, Cheat_Menu.toggle_no_clip_status);
};

// Left and right scrollers for handling switching amount to modify numerical cheats
Cheat_Menu.scroll_amount = function (direction, event) {
	if (direction == "left") {
		Cheat_Menu.amount_index--;
		if (Cheat_Menu.amount_index < 0) {
			Cheat_Menu.amount_index = 0;
		}
		SoundManager.playSystemSound(2);
	}
	else {
		Cheat_Menu.amount_index++;
		if (Cheat_Menu.amount_index >= Cheat_Menu.amounts.length) {
			Cheat_Menu.amount_index = Cheat_Menu.amounts.length - 1;
		}
		SoundManager.playSystemSound(1);
	}

	Cheat_Menu.update_menu();
};

// append the amount selection to the menu
Cheat_Menu.append_amount_selection = function (key1, key2) {
	Cheat_Menu.append_title("Amount");

	var current_amount = "<font color='#0088ff'>" + Cheat_Menu.amounts[Cheat_Menu.amount_index] + "</font>";
	Cheat_Menu.append_scroll_selector(current_amount, key1, key2, Cheat_Menu.scroll_amount);
};

// Left and right scrollers for handling switching amount to modify for the movement cheat
Cheat_Menu.scroll_move_amount = function (direction, event) {
	if (direction == "left") {
		Cheat_Menu.move_amount_index--;
		if (Cheat_Menu.move_amount_index < 0) {
			Cheat_Menu.move_amount_index = 0;
		}
		SoundManager.playSystemSound(2);
	}
	else {
		Cheat_Menu.move_amount_index++;
		if (Cheat_Menu.move_amount_index >= Cheat_Menu.move_amounts.length) {
			Cheat_Menu.move_amount_index = Cheat_Menu.move_amounts.length - 1;
		}
		SoundManager.playSystemSound(1);
	}

	Cheat_Menu.update_menu();
};

// append the movement speed amount to the menu
Cheat_Menu.append_move_amount_selection = function (key1, key2) {
	Cheat_Menu.append_title("Amount");

	var current_amount = "<font color='#0088ff'>" + Cheat_Menu.move_amounts[Cheat_Menu.move_amount_index] + "</font>";
	Cheat_Menu.append_scroll_selector(current_amount, key1, key2, Cheat_Menu.scroll_move_amount);
};

// handlers for the exp cheat
Cheat_Menu.apply_current_exp = function (direction, event) {
	var amount = Cheat_Menu.amounts[Cheat_Menu.amount_index];
	if (direction == "left") {
		amount = -amount;
		SoundManager.playSystemSound(2);
	}
	else {
		SoundManager.playSystemSound(1);
	}
	Cheat_Menu.give_exp($gameActors._data[Cheat_Menu.cheat_selected_actor], amount);
	Cheat_Menu.update_menu();
};

// append the exp cheat to the menu
Cheat_Menu.append_exp_cheat = function (key1, key2) {
	var current_exp = "NULL";
	if ($gameActors._data[Cheat_Menu.cheat_selected_actor]) {
		current_exp = $gameActors._data[Cheat_Menu.cheat_selected_actor].currentExp();
	}
	Cheat_Menu.append_title("EXP");
	Cheat_Menu.append_scroll_selector(current_exp, key1, key2, Cheat_Menu.apply_current_exp);
};

// Left and right scrollers for handling switching between stats for the selected character
Cheat_Menu.scroll_stat = function (direction, event) {
	if ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus) {
		if (direction == "left") {
			Cheat_Menu.stat_selection--;
			if (Cheat_Menu.stat_selection < 0) {
				Cheat_Menu.stat_selection = $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus.length - 1;
			}
		}
		else {
			Cheat_Menu.stat_selection++;
			if (Cheat_Menu.stat_selection >= $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus.length) {
				Cheat_Menu.stat_selection = 0;
			}
		}
	}
	else {
		Cheat_Menu.stat_selection = 0;
	}
	SoundManager.playSystemSound(0);
	Cheat_Menu.update_menu();
};

// handlers for the stat cheat
Cheat_Menu.apply_current_stat = function (direction, event) {
	var amount = Cheat_Menu.amounts[Cheat_Menu.amount_index];
	if (direction == "left") {
		amount = -amount;
		SoundManager.playSystemSound(2);
	}
	else {
		SoundManager.playSystemSound(1);
	}
	Cheat_Menu.give_stat($gameActors._data[Cheat_Menu.cheat_selected_actor], Cheat_Menu.stat_selection, amount);
	Cheat_Menu.update_menu();
};


// append the stat selection to the menu
Cheat_Menu.append_stat_selection = function (key1, key2, key3, key4) {
	Cheat_Menu.append_title("Stat");

	var stat_string = "";

	var stat_string = "";
	if ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus) {
		if (Cheat_Menu.stat_selection >= $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus.length) {
			Cheat_Menu.stat_selection = 0;
		}
		stat_string += $dataSystem.terms.params[Cheat_Menu.stat_selection];
	}

	Cheat_Menu.append_scroll_selector(stat_string, key1, key2, Cheat_Menu.scroll_stat);
	var current_value = "NULL";
	if ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus) {
		current_value = $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus[Cheat_Menu.stat_selection];
	}
	Cheat_Menu.append_scroll_selector(current_value, key3, key4, Cheat_Menu.apply_current_stat);
};

// handlers for the gold cheat
Cheat_Menu.apply_current_gold = function (direction, event) {
	var amount = Cheat_Menu.amounts[Cheat_Menu.amount_index];
	if (direction == "left") {
		amount = -amount;
		SoundManager.playSystemSound(2);
	}
	else {
		SoundManager.playSystemSound(1);
	}
	Cheat_Menu.give_gold(amount);
	Cheat_Menu.update_menu();
};

// append the gold cheat to the menu
Cheat_Menu.append_gold_status = function (key1, key2) {
	Cheat_Menu.append_title("Gold");
	Cheat_Menu.append_add_remove("Owned: " + $gameParty._gold, Cheat_Menu.amounts[Cheat_Menu.amount_index], Cheat_Menu.apply_current_gold);
};

// handler for the movement speed cheat
Cheat_Menu.apply_speed_change = function (direction, event) {
	var amount = Cheat_Menu.move_amounts[Cheat_Menu.move_amount_index];
	if (direction == "left") {
		amount = -amount;
		SoundManager.playSystemSound(2);
	}
	else {
		SoundManager.playSystemSound(1);
	}
	Cheat_Menu.change_player_speed(amount);
	Cheat_Menu.update_menu();
};

Cheat_Menu.apply_speed_lock_toggle = function () {
	Cheat_Menu.toggle_lock_player_speed();
	if (Cheat_Menu.speed_unlocked) {
		SoundManager.playSystemSound(2);
	}
	else {
		SoundManager.playSystemSound(1);
	}
	Cheat_Menu.update_menu();
};

// append the movement speed to the menu
Cheat_Menu.append_speed_status = function (key1, key2, key3) {
	Cheat_Menu.append_title("Current Speed");
	Cheat_Menu.append_scroll_selector($gamePlayer._moveSpeed, key1, key2, Cheat_Menu.apply_speed_change);
	var status_text;
	if (!Cheat_Menu.speed_unlocked) {
		status_text = "<font color='#00ff00'>false</font>";
	}
	else {
		status_text = "<font color='#ff0000'>true</font>";
	}
	Cheat_Menu.append_cheat("Speed Unlocked", status_text, key3, Cheat_Menu.apply_speed_lock_toggle);
};

// Left and right scrollers for handling switching between items selected
Cheat_Menu.scroll_item = function (direction, event) {
	if (direction == "left") {
		Cheat_Menu.item_selection--;
		if (Cheat_Menu.item_selection < 0) {
			Cheat_Menu.item_selection = $dataItems.length - 1;
		}
	}
	else {
		Cheat_Menu.item_selection++;
		if (Cheat_Menu.item_selection >= $dataItems.length) {
			Cheat_Menu.item_selection = 0;
		}
	}
	SoundManager.playSystemSound(0);
	Cheat_Menu.update_menu();
};

// handlers for the item cheat
Cheat_Menu.apply_current_item = function (direction, event) {
	var amount = Cheat_Menu.amounts[Cheat_Menu.amount_index];
	if (direction == "left") {
		amount = -amount;
		SoundManager.playSystemSound(2);
	}
	else {
		SoundManager.playSystemSound(1);
	}
	Cheat_Menu.give_item(Cheat_Menu.item_selection, amount);
	Cheat_Menu.update_menu();
};

// append the item cheat to the menu
Cheat_Menu.append_item_selection = function (key1, key2, key3, key4) {
	Cheat_Menu.append_searchable_list($dataItems, Cheat_Menu.item_selection, function (idx) {
		Cheat_Menu.item_selection = idx;
		SoundManager.playSystemSound(0);
		Cheat_Menu.update_menu();
	});

	var current_item_amount = 0;
	if ($gameParty._items[Cheat_Menu.item_selection] != undefined) {
		current_item_amount = $gameParty._items[Cheat_Menu.item_selection];
	}
	Cheat_Menu.append_add_remove("Owned: " + current_item_amount, Cheat_Menu.amounts[Cheat_Menu.amount_index], Cheat_Menu.apply_current_item);
};

// Left and right scrollers for handling switching between weapon selected
Cheat_Menu.scroll_weapon = function (direction, event) {
	if (direction == "left") {
		Cheat_Menu.weapon_selection--;
		if (Cheat_Menu.weapon_selection < 0) {
			Cheat_Menu.weapon_selection = $dataWeapons.length - 1;
		}
	}
	else {
		Cheat_Menu.weapon_selection++;
		if (Cheat_Menu.weapon_selection >= $dataWeapons.length) {
			Cheat_Menu.weapon_selection = 0;
		}
	}
	SoundManager.playSystemSound(0);

	Cheat_Menu.update_menu();
};

// handlers for the weapon cheat
Cheat_Menu.apply_current_weapon = function (direction, event) {
	var amount = Cheat_Menu.amounts[Cheat_Menu.amount_index];
	if (direction == "left") {
		amount = -amount;
		SoundManager.playSystemSound(2);
	}
	else {
		SoundManager.playSystemSound(1);
	}
	Cheat_Menu.give_weapon(Cheat_Menu.weapon_selection, amount);
	Cheat_Menu.update_menu();
};

// append the weapon cheat to the menu
Cheat_Menu.append_weapon_selection = function (key1, key2, key3, key4) {
	Cheat_Menu.append_searchable_list($dataWeapons, Cheat_Menu.weapon_selection, function (idx) {
		Cheat_Menu.weapon_selection = idx;
		SoundManager.playSystemSound(0);
		Cheat_Menu.update_menu();
	});

	var current_weapon_amount = 0;
	if ($gameParty._weapons[Cheat_Menu.weapon_selection] != undefined) {
		current_weapon_amount = $gameParty._weapons[Cheat_Menu.weapon_selection];
	}
	Cheat_Menu.append_add_remove("Owned: " + current_weapon_amount, Cheat_Menu.amounts[Cheat_Menu.amount_index], Cheat_Menu.apply_current_weapon);
};

// Left and right scrollers for handling switching between armor selected
Cheat_Menu.scroll_armor = function (direction, event) {
	if (direction == "left") {
		Cheat_Menu.armor_selection--;
		if (Cheat_Menu.armor_selection < 0) {
			Cheat_Menu.armor_selection = $dataArmors.length - 1;
		}
	}
	else {
		Cheat_Menu.armor_selection++;
		if (Cheat_Menu.armor_selection >= $dataArmors.length) {
			Cheat_Menu.armor_selection = 0;
		}
	}
	SoundManager.playSystemSound(0);

	Cheat_Menu.update_menu();
};

// handler for the armor cheat
Cheat_Menu.apply_current_armor = function (direction, event) {
	var amount = Cheat_Menu.amounts[Cheat_Menu.amount_index];
	if (direction == "left") {
		amount = -amount;
		SoundManager.playSystemSound(2);
	}
	else {
		SoundManager.playSystemSound(1);
	}
	Cheat_Menu.give_armor(Cheat_Menu.armor_selection, amount);
	Cheat_Menu.update_menu();
};

// append the armor cheat to the menu
Cheat_Menu.append_armor_selection = function (key1, key2, key3, key4) {
	Cheat_Menu.append_searchable_list($dataArmors, Cheat_Menu.armor_selection, function (idx) {
		Cheat_Menu.armor_selection = idx;
		SoundManager.playSystemSound(0);
		Cheat_Menu.update_menu();
	});

	var current_armor_amount = 0;
	if ($gameParty._armors[Cheat_Menu.armor_selection] != undefined) {
		current_armor_amount = $gameParty._armors[Cheat_Menu.armor_selection];
	}
	Cheat_Menu.append_add_remove("Owned: " + current_armor_amount, Cheat_Menu.amounts[Cheat_Menu.amount_index], Cheat_Menu.apply_current_armor);
};

// handler for the clear actor state cheat
Cheat_Menu.clear_current_actor_states = function () {
	Cheat_Menu.clear_actor_states($gameActors._data[Cheat_Menu.cheat_selected_actor]);
	SoundManager.playSystemSound(1);
	Cheat_Menu.update_menu();
};

// handler for the party state clear cheat
Cheat_Menu.party_clear_states_cheat = function () {
	Cheat_Menu.clear_party_states();
	SoundManager.playSystemSound(1);
};

// append the party hp cheats
Cheat_Menu.append_party_state = function (key1) {
	Cheat_Menu.append_cheat("Clear Party States", "Activate", key1, Cheat_Menu.party_clear_states_cheat);
};

// append the clear actor state cheat to the menu
Cheat_Menu.append_current_state = function (key1) {
	Cheat_Menu.append_title("Current State");
	var number_states = 0;

	if ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor]._states && $gameActors._data[Cheat_Menu.cheat_selected_actor]._states.length >= 0) {
		number_states = $gameActors._data[Cheat_Menu.cheat_selected_actor]._states.length;
	}
	else {
		number_states = null;
	}

	Cheat_Menu.append_cheat("Number Effects:", number_states, key1, Cheat_Menu.clear_current_actor_states);
};

// Left and right scrollers for handling switching between selected variable
Cheat_Menu.scroll_variable = function (direction, event) {
	if (direction == "left") {
		Cheat_Menu.variable_selection--;
		if (Cheat_Menu.variable_selection < 0) {
			Cheat_Menu.variable_selection = $dataSystem.variables.length - 1;
		}
	}
	else {
		Cheat_Menu.variable_selection++;
		if (Cheat_Menu.variable_selection >= $dataSystem.variables.length) {
			Cheat_Menu.variable_selection = 0;
		}
	}
	SoundManager.playSystemSound(0);
	Cheat_Menu.update_menu();
};

// handlers for the setting the current variable
Cheat_Menu.apply_current_variable = function (direction, event) {
	var amount = Cheat_Menu.amounts[Cheat_Menu.amount_index];
	if (direction == "left") {
		amount = -amount;
		SoundManager.playSystemSound(2);
	}
	else {
		SoundManager.playSystemSound(1);
	}
	Cheat_Menu.set_variable(Cheat_Menu.variable_selection, amount);
	Cheat_Menu.update_menu();
};

// append the variable cheat to the menu
Cheat_Menu.append_variable_selection = function (key1, key2, key3, key4) {
	Cheat_Menu.append_searchable_list($dataSystem.variables, Cheat_Menu.variable_selection, function (idx) {
		Cheat_Menu.variable_selection = idx;
		SoundManager.playSystemSound(0);
		Cheat_Menu.update_menu();

		var current_val = $gameVariables.value(idx) || 0;
		var title = idx + ": " + ($dataSystem.variables[idx] || ("Variable " + idx));
		Cheat_Menu.open_value_modal(title, current_val, function (newVal) {
			Cheat_Menu.set_variable(idx, newVal);
			SoundManager.playSystemSound(1);
			Cheat_Menu.update_menu();
		});

	}, function (item, idx) { return item || "Variable " + idx; }, true, function (idx) {
		return $gameVariables.value(idx);
	});
};

// Left and right scrollers for handling switching between selected switch
Cheat_Menu.scroll_switch = function (direction, event) {
	if (direction == "left") {
		Cheat_Menu.switch_selection--;
		if (Cheat_Menu.switch_selection < 0) {
			Cheat_Menu.switch_selection = $dataSystem.switches.length - 1;
		}
	}
	else {
		Cheat_Menu.switch_selection++;
		if (Cheat_Menu.switch_selection >= $dataSystem.switches.length) {
			Cheat_Menu.switch_selection = 0;
		}
	}
	SoundManager.playSystemSound(0);
	Cheat_Menu.update_menu();
};

// handler for the toggling the current switch
Cheat_Menu.toggle_current_switch = function (event) {
	Cheat_Menu.toggle_switch(Cheat_Menu.switch_selection);
	if ($gameSwitches.value(Cheat_Menu.switch_selection)) {
		SoundManager.playSystemSound(1);
	}
	else {
		SoundManager.playSystemSound(2);
	}
	Cheat_Menu.update_menu();
};

// append the switch cheat to the menu
Cheat_Menu.append_switch_selection = function (key1, key2, key3) {
	Cheat_Menu.append_searchable_list($dataSystem.switches, Cheat_Menu.switch_selection, function (idx) {
		Cheat_Menu.switch_selection = idx;
		SoundManager.playSystemSound(0);
		Cheat_Menu.update_menu();
	}, function (item, idx) { return item || "Switch " + idx; }, true, function (idx) {
		return $gameSwitches.value(idx) ? "ON" : "OFF";
	});

	var current_switch_value = 'NULL';
	if ($gameSwitches.value(Cheat_Menu.switch_selection) != undefined) {
		current_switch_value = $gameSwitches.value(Cheat_Menu.switch_selection) ? "ON" : "OFF";
	}
	Cheat_Menu.append_cheat("Value: " + current_switch_value, "Toggle", key3, Cheat_Menu.toggle_current_switch);
};

// handler for saving positions
Cheat_Menu.save_position = function (pos_num, event) {
	Cheat_Menu.saved_positions[pos_num].m = $gameMap.mapId();
	Cheat_Menu.saved_positions[pos_num].x = $gamePlayer.x;
	Cheat_Menu.saved_positions[pos_num].y = $gamePlayer.y;

	SoundManager.playSystemSound(1);
	Cheat_Menu.update_menu();
};

// handler for loading/recalling positions
Cheat_Menu.recall_position = function (pos_num, event) {
	if (Cheat_Menu.saved_positions[pos_num].m != -1) {
		Cheat_Menu.teleport(Cheat_Menu.saved_positions[pos_num].m, Cheat_Menu.saved_positions[pos_num].x, Cheat_Menu.saved_positions[pos_num].y);
		SoundManager.playSystemSound(1);
	}
	else {
		SoundManager.playSystemSound(2);
	}
	Cheat_Menu.update_menu();
};

// append the save/recall cheat to the menu
Cheat_Menu.append_save_recall = function (key1, key2, key3, key4, key5, key6) {

	Cheat_Menu.append_title("Current Position: ");

	if ($dataMapInfos[$gameMap.mapId()] && $dataMapInfos[$gameMap.mapId()].name) {
		var current_map = "" + $gameMap.mapId() + ": " + $dataMapInfos[$gameMap.mapId()].name;
		Cheat_Menu.append_description(current_map);

		var map_pos = "(" + $gamePlayer.x + ", " + $gamePlayer.y + ")";
		Cheat_Menu.append_description(map_pos);
	}
	else {
		Cheat_Menu.append_description("NULL");
	}

	var cur_key = 1;
	for (var i = 0; i < Cheat_Menu.saved_positions.length; i++) {
		Cheat_Menu.append_title("Position " + (i + 1));

		var map_text;
		var pos_text;
		if (Cheat_Menu.saved_positions[i].m != -1) {
			map_text = "" + Cheat_Menu.saved_positions[i].m + ": ";
			if ($dataMapInfos[Cheat_Menu.saved_positions[i].m].name) {
				map_text += $dataMapInfos[Cheat_Menu.saved_positions[i].m].name;
			}
			else {
				map_text += "NULL";
			}
			pos_text = "(" + Cheat_Menu.saved_positions[i].x + ", " + Cheat_Menu.saved_positions[i].y + ")";
		}
		else {
			map_text = "NULL";
			pos_text = "NULL"
		}

		Cheat_Menu.append_cheat("Save:", map_text, eval("key" + cur_key), Cheat_Menu.save_position.bind(null, i));
		cur_key++;

		Cheat_Menu.append_cheat("Recall:", pos_text, eval("key" + cur_key), Cheat_Menu.recall_position.bind(null, i));
		cur_key++;
	}
};

// Left and right scrollers for handling switching between target teleport map
Cheat_Menu.scroll_map_teleport_selection = function (direction, event) {
	if (direction == "left") {
		Cheat_Menu.teleport_location.m--;
		if (Cheat_Menu.teleport_location.m < 1) {
			Cheat_Menu.teleport_location.m = $dataMapInfos.length - 1;
		}
	}
	else {
		Cheat_Menu.teleport_location.m++;
		if (Cheat_Menu.teleport_location.m >= $dataMapInfos.length) {
			Cheat_Menu.teleport_location.m = 1;
		}
	}

	SoundManager.playSystemSound(0);
	Cheat_Menu.update_menu();
};

// Left and right scrollers for handling switching between target teleport x coord
Cheat_Menu.scroll_x_teleport_selection = function (direction, event) {
	if (direction == "left") {
		Cheat_Menu.teleport_location.x--;
		if (Cheat_Menu.teleport_location.x < 0) {
			Cheat_Menu.teleport_location.x = 255;
		}
	}
	else {
		Cheat_Menu.teleport_location.x++;
		if (Cheat_Menu.teleport_location.x > 255) {
			Cheat_Menu.teleport_location.x = 0;
		}
	}

	SoundManager.playSystemSound(0);
	Cheat_Menu.update_menu();
};

// Left and right scrollers for handling switching between target teleport y coord
Cheat_Menu.scroll_y_teleport_selection = function (direction, event) {
	if (direction == "left") {
		Cheat_Menu.teleport_location.y--;
		if (Cheat_Menu.teleport_location.y < 0) {
			Cheat_Menu.teleport_location.y = 255;
		}
	}
	else {
		Cheat_Menu.teleport_location.y++;
		if (Cheat_Menu.teleport_location.y > 255) {
			Cheat_Menu.teleport_location.y = 0;
		}
	}

	SoundManager.playSystemSound(0);
	Cheat_Menu.update_menu();
};

// handler for teleporting to targed map and location
Cheat_Menu.teleport_current_location = function (event) {
	Cheat_Menu.teleport(Cheat_Menu.teleport_location.m, Cheat_Menu.teleport_location.x, Cheat_Menu.teleport_location.y);
	SoundManager.playSystemSound(1);
	Cheat_Menu.update_menu();
};

// append the teleport cheat to the menu
Cheat_Menu.append_teleport = function (key1, key2, key3, key4, key5, key6, key7) {
	var current_map = "" + Cheat_Menu.teleport_location.m + ": ";

	if ($dataMapInfos[Cheat_Menu.teleport_location.m] && $dataMapInfos[Cheat_Menu.teleport_location.m].name) {
		current_map += $dataMapInfos[Cheat_Menu.teleport_location.m].name;
	}
	else {
		current_map += "NULL";
	}

	Cheat_Menu.append_scroll_selector(current_map, key1, key2, Cheat_Menu.scroll_map_teleport_selection);

	Cheat_Menu.append_scroll_selector("X: " + Cheat_Menu.teleport_location.x, key3, key4, Cheat_Menu.scroll_x_teleport_selection);

	Cheat_Menu.append_scroll_selector("Y: " + Cheat_Menu.teleport_location.y, key5, key6, Cheat_Menu.scroll_y_teleport_selection);

	Cheat_Menu.append_cheat("Teleport", "Activate", key7, Cheat_Menu.teleport_current_location);
};


//////////////////////////////////////////////////////////////////////////////////
// Final Functions for building each Menu and function list for updating the menu
//////////////////////////////////////////////////////////////////////////////////
// Check if already defined (allows game specific extensions to be loaded in any order)
if (typeof Cheat_Menu.menus == "undefined") { Cheat_Menu.menus = []; }

// One menu added for each cheat/page of the Cheat_Menu
//	appended in reverse order at the front so they will
//	appear first no matter the plugin load order for any
//	extension plugins

Cheat_Menu.menus.splice(0, 0, function () {
	Cheat_Menu.append_cheat_title("General");

	var positions = ["Center", "Top Left", "Top Right", "Bottom Right", "Bottom Left"];
	Cheat_Menu.append_scroll_selector("Position: " + positions[Cheat_Menu.position], null, null, function (dir) {
		if (dir === "left") {
			Cheat_Menu.position--;
			if (Cheat_Menu.position < 0) Cheat_Menu.position = 4;
		} else {
			Cheat_Menu.position++;
			if (Cheat_Menu.position > 4) Cheat_Menu.position = 0;
		}
		SoundManager.playSystemSound(0);
		Cheat_Menu.update_menu();
	});

	if (!Cheat_Menu.fontSize) Cheat_Menu.fontSize = 14;
	Cheat_Menu.append_scroll_selector("Font Size: " + Cheat_Menu.fontSize + "px", null, null, function (dir) {
		if (dir === "left") Cheat_Menu.fontSize = Math.max(8, Cheat_Menu.fontSize - 1);
		else Cheat_Menu.fontSize = Math.min(24, Cheat_Menu.fontSize + 1);
		Cheat_Menu.overlay_box.style.fontSize = Cheat_Menu.fontSize + "px";
		SoundManager.playSystemSound(0);
		Cheat_Menu.update_menu();
	});

	Cheat_Menu.append_cheat("Close Menu", "Close", null, function () {
		Cheat_Menu.close_menu();
	});
});

Cheat_Menu.menus.splice(0, 0, function () {
	Cheat_Menu.append_cheat_title("Teleport");
	Cheat_Menu.append_teleport(4, 5, 6, 7, 8, 9, 0);
});

Cheat_Menu.menus.splice(0, 0, function () {
	Cheat_Menu.append_cheat_title("Save and Recall");
	Cheat_Menu.append_save_recall(4, 5, 6, 7, 8, 9);
});

Cheat_Menu.menus.splice(0, 0, function () {
	Cheat_Menu.append_cheat_title("Switches");
	Cheat_Menu.append_switch_selection(4, 5, 6);
});

Cheat_Menu.menus.splice(0, 0, function () {
	Cheat_Menu.append_cheat_title("Variables");
	Cheat_Menu.append_amount_selection(4, 5);
	Cheat_Menu.append_variable_selection(6, 7, 8, 9);
});

Cheat_Menu.menus.splice(0, 0, function () {
	Cheat_Menu.append_cheat_title("Clear States");
	Cheat_Menu.append_party_state(4);
	Cheat_Menu.append_actor_selection(5, 6);
	Cheat_Menu.append_current_state(7);
});

Cheat_Menu.menus.splice(0, 0, function () {
	Cheat_Menu.append_cheat_title("Speed");
	Cheat_Menu.append_move_amount_selection(4, 5);
	Cheat_Menu.append_speed_status(6, 7, 8);
});

Cheat_Menu.menus.splice(0, 0, function () {
	Cheat_Menu.append_cheat_title("Armors");
	Cheat_Menu.append_amount_selection(4, 5);
	Cheat_Menu.append_armor_selection(6, 7, 8, 9);
});

Cheat_Menu.menus.splice(0, 0, function () {
	Cheat_Menu.append_cheat_title("Weapons");
	Cheat_Menu.append_amount_selection(4, 5);
	Cheat_Menu.append_weapon_selection(6, 7, 8, 9);
});

Cheat_Menu.menus.splice(0, 0, function () {
	Cheat_Menu.append_cheat_title("Items");
	Cheat_Menu.append_amount_selection(4, 5);
	Cheat_Menu.append_item_selection(6, 7, 8, 9);
});

Cheat_Menu.menus.splice(0, 0, function () {
	Cheat_Menu.append_cheat_title("Gold");
	Cheat_Menu.append_amount_selection(4, 5);
	Cheat_Menu.append_gold_status(6, 7);
});

Cheat_Menu.menus.splice(0, 0, function () {
	Cheat_Menu.append_cheat_title("Stats");
	Cheat_Menu.append_actor_selection(4, 5);
	Cheat_Menu.append_amount_selection(6, 7);
	Cheat_Menu.append_stat_selection(8, 9, 0, '-');
});

Cheat_Menu.menus.splice(0, 0, function () {
	Cheat_Menu.append_cheat_title("Give Exp");
	Cheat_Menu.append_actor_selection(4, 5);
	Cheat_Menu.append_amount_selection(6, 7);
	Cheat_Menu.append_exp_cheat(8, 9);
});

Cheat_Menu.menus.splice(0, 0, function () {
	Cheat_Menu.append_cheat_title("Party TP");

	Cheat_Menu.append_tp_cheats(4, 5, 6, 7, 8, 9);
});

Cheat_Menu.menus.splice(0, 0, function () {
	Cheat_Menu.append_cheat_title("Party MP");

	Cheat_Menu.append_mp_cheats(4, 5, 6, 7, 8, 9);
});

Cheat_Menu.menus.splice(0, 0, function () {
	Cheat_Menu.append_cheat_title("Party HP");

	Cheat_Menu.append_hp_cheats(4, 5, 6, 7, 8, 9);
});

Cheat_Menu.menus.splice(0, 0, function () {
	Cheat_Menu.append_cheat_title("Enemy HP");

	Cheat_Menu.append_enemy_cheats(4, 5, 6, 7);
});

Cheat_Menu.menus.splice(0, 0, function () {
	Cheat_Menu.append_cheat_title("No Clip");

	Cheat_Menu.append_no_clip_status(4);
});

Cheat_Menu.menus.splice(0, 0, function () {
	Cheat_Menu.append_cheat_title("God Mode");
	Cheat_Menu.append_actor_selection(4, 5);

	Cheat_Menu.append_godmode_status();
});


// update whats being displayed in menu
Cheat_Menu.update_menu = function () {
	// clear menu
	Cheat_Menu.sidebar.innerHTML = "";
	Cheat_Menu.content.innerHTML = "";
	// clear key listeners
	Cheat_Menu.key_listeners = {};

	// Build Sidebar
	for (var i = 0; i < Cheat_Menu.menus.length; i++) {
		var menuFuncStr = Cheat_Menu.menus[i].toString();
		var titleMatch = menuFuncStr.match(/append_cheat_title\(\s*['"]([^'"]+)['"]\s*\)/);
		var title = titleMatch ? titleMatch[1] : "Menu " + i;

		var btn = document.createElement('button');
		btn.className = "sidebar_btn";
		if (i === Cheat_Menu.cheat_selected) {
			btn.className += " active";
		}
		btn.innerHTML = title;
		btn.addEventListener('mousedown', (function (idx) {
			return function (e) {
				Cheat_Menu.cheat_selected = idx;
				SoundManager.playSystemSound(0);
				Cheat_Menu.update_menu();
			};
		})(i));
		Cheat_Menu.sidebar.appendChild(btn);
	}

	Cheat_Menu.menus[Cheat_Menu.cheat_selected]();

	Cheat_Menu.position_menu();
};

// listener to reposition menu
window.addEventListener("resize", Cheat_Menu.position_menu);


// prevent clicking from passing through
var stopProp = function (event) { event.stopPropagation(); };
Cheat_Menu.overlay_box.addEventListener("mousedown", stopProp);
Cheat_Menu.overlay_box.addEventListener("wheel", stopProp, { passive: true });
Cheat_Menu.overlay_box.addEventListener("touchstart", stopProp, { passive: true });
Cheat_Menu.overlay_box.addEventListener("touchmove", stopProp, { passive: true });



/////////////////////////////////////////////////
// Cheat Menu Key Listener
/////////////////////////////////////////////////

// Key codes
if (typeof Cheat_Menu.keyCodes == "undefined") { Cheat_Menu.keyCodes = {}; }

Cheat_Menu.keyCodes.KEYCODE_0 = { keyCode: 48, key_listener: 0 };
Cheat_Menu.keyCodes.KEYCODE_1 = { keyCode: 49, key_listener: 1 };
Cheat_Menu.keyCodes.KEYCODE_2 = { keyCode: 50, key_listener: 2 };
Cheat_Menu.keyCodes.KEYCODE_3 = { keyCode: 51, key_listener: 3 };
Cheat_Menu.keyCodes.KEYCODE_4 = { keyCode: 52, key_listener: 4 };
Cheat_Menu.keyCodes.KEYCODE_5 = { keyCode: 53, key_listener: 5 };
Cheat_Menu.keyCodes.KEYCODE_6 = { keyCode: 54, key_listener: 6 };
Cheat_Menu.keyCodes.KEYCODE_7 = { keyCode: 55, key_listener: 7 };
Cheat_Menu.keyCodes.KEYCODE_8 = { keyCode: 56, key_listener: 8 };
Cheat_Menu.keyCodes.KEYCODE_9 = { keyCode: 57, key_listener: 9 };
Cheat_Menu.keyCodes.KEYCODE_MINUS = { keyCode: 189, key_listener: '-' };
Cheat_Menu.keyCodes.KEYCODE_EQUAL = { keyCode: 18, key_listener: '=' };

Cheat_Menu.keyCodes.KEYCODE_TILDE = { keyCode: 192, key_listener: '`' };

Cheat_Menu.key_listeners = {};

window.addEventListener("keydown", function (event) {
	if (!event.ctrlKey && !event.altKey && (event.keyCode === 119) && $gameTemp && !$gameTemp.isPlaytest()) {
		// open debug menu
		event.stopPropagation();
		event.preventDefault();
		require('nw.gui').Window.get().showDevTools();
	}
	else if (!event.altKey && !event.ctrlKey && !event.shiftKey && (event.keyCode === 120) && $gameTemp && !$gameTemp.isPlaytest()) {
		// trick the game into thinking its a playtest so it will open the switch/variable debug menu
		$gameTemp._isPlaytest = true;
		setTimeout(function () {
			// back to not being playtest
			$gameTemp._isPlaytest = false;
		}, 100);
	}
	else if (Cheat_Menu.overlay_openable && !event.altKey && !event.ctrlKey && !event.shiftKey) {
		// open and close menu
		if (event.keyCode == Cheat_Menu.keyCodes.KEYCODE_1.keyCode) {
			if (!Cheat_Menu.initialized) {
				for (var i = 0; i < $gameActors._data.length; i++) {
					if ($gameActors._data[i]) {
						$gameActors._data[i].god_mode = false;
						if ($gameActors._data[i].god_mode_interval) {
							clearInterval($gameActors._data[i].god_mode_interval);
						}
					}
				}

				// reset to inital values
				for (var name in Cheat_Menu.initial_values) {
					Cheat_Menu[name] = JSON.parse(JSON.stringify(Cheat_Menu.initial_values[name]));
				}
				// load saved values if they exist
				if ($gameSystem.Cheat_Menu) {
					for (var name in $gameSystem.Cheat_Menu) {
						Cheat_Menu[name] = Cheat_Menu.clone_save_value($gameSystem.Cheat_Menu[name]);
					}
				}

				// if speed is locked then initialize it so effect is active
				if (Cheat_Menu.speed_unlocked == false) {
					Cheat_Menu.initialize_speed_lock();
				}

				// only do this once per load or new game
				Cheat_Menu.initialized = true;
			}

			if (!Cheat_Menu.cheat_menu_open) {
				Cheat_Menu.cheat_menu_open = true;
				document.body.appendChild(Cheat_Menu.overlay_box);
				if (!Cheat_Menu.fontSize) Cheat_Menu.fontSize = 14;
				Cheat_Menu.overlay_box.style.fontSize = Cheat_Menu.fontSize + "px";
				Cheat_Menu.overlay_box.style.display = "flex";
				Cheat_Menu.update_menu();
				SoundManager.playSystemSound(1);
			}
			// close menu
			else {
				Cheat_Menu.close_menu();
			}
		}

		// navigate and activate cheats
		else if (Cheat_Menu.cheat_menu_open) {
			// move menu position
			if (event.keyCode == Cheat_Menu.keyCodes.KEYCODE_TILDE.keyCode) {
				Cheat_Menu.position++;
				if (Cheat_Menu.position > 4) {
					Cheat_Menu.position = 0;
				}
				Cheat_Menu.update_menu();
			}

			else {
				for (var keyCode in Cheat_Menu.keyCodes) {
					if (Cheat_Menu.key_listeners[Cheat_Menu.keyCodes[keyCode].key_listener] && event.keyCode == Cheat_Menu.keyCodes[keyCode].keyCode) {
						Cheat_Menu.key_listeners[Cheat_Menu.keyCodes[keyCode].key_listener](event);
					}
				}
			}
		}
	}
});



/////////////////////////////////////////////////
// Load Hook
/////////////////////////////////////////////////

// close the menu and set for initialization on first open
//	timer to provide periodic updates if the menu is open
Cheat_Menu.initialize = function () {
	Cheat_Menu.overlay_openable = true;
	Cheat_Menu.initialized = false;
	Cheat_Menu.cheat_menu_open = false;
	Cheat_Menu.speed_initialized = false;
	Cheat_Menu.overlay_box.remove();


	// periodic update
	clearInterval(Cheat_Menu.menu_update_timer);
	Cheat_Menu.menu_update_timer = setInterval(function () {
		if (Cheat_Menu.cheat_menu_open) {
			Cheat_Menu.update_menu();
		}
	}, 1000);
};

Cheat_Menu.clone_save_value = function (value) {
	if (value === undefined || value === null) return value;
	if (typeof value !== "object") return value;
	return JSON.parse(JSON.stringify(value));
};

// add hook for loading a game
DataManager.default_loadGame = DataManager.loadGame;
DataManager.loadGame = function (savefileId) {
	Cheat_Menu.initialize();

	return DataManager.default_loadGame(savefileId);
};

// add hook for new game
DataManager.default_setupNewGame = DataManager.setupNewGame;
DataManager.setupNewGame = function () {
	Cheat_Menu.initialize();

	DataManager.default_setupNewGame();
};

// add hook for saving values (just added into $gameSystem to be saved)
DataManager.default_saveGame = DataManager.saveGame;
DataManager.saveGame = function (savefileId) {
	// save values that are in intial values
	$gameSystem.Cheat_Menu = {};
	for (var name in Cheat_Menu.initial_values) {
		if (Cheat_Menu[name] !== undefined) {
			$gameSystem.Cheat_Menu[name] = Cheat_Menu.clone_save_value(Cheat_Menu[name]);
		}
	}

	return DataManager.default_saveGame(savefileId);
};

// ==========================================
// UI OVERRIDES & IMPROVEMENTS (V7)
// ==========================================

Cheat_Menu.menu_scale = 60;
Cheat_Menu.sub_tab_selected = 0;

// --- 1. Menu State Management & Close Button ---
Cheat_Menu.close_menu = function () {
	if (Cheat_Menu.overlay_box) {
		Cheat_Menu.overlay_box.style.display = "none";
		Cheat_Menu.overlay_box.remove();
	}
	Cheat_Menu.cheat_menu_open = false;
	Cheat_Menu.render_quick_hud();
	SoundManager.playSystemSound(2);
};

// Global observer to catch native hotkeys closing the menu (Escape, Right Click)
document.addEventListener('keydown', function () { setTimeout(Cheat_Menu.check_menu_state, 50); });
document.addEventListener('mousedown', function () { setTimeout(Cheat_Menu.check_menu_state, 50); });

Cheat_Menu.check_menu_state = function () {
	var isActuallyOpen = Cheat_Menu.overlay_box && document.body.contains(Cheat_Menu.overlay_box) && Cheat_Menu.overlay_box.style.display !== "none";
	if (Cheat_Menu.cheat_menu_open && !isActuallyOpen) {
		Cheat_Menu.cheat_menu_open = false;
		Cheat_Menu.render_quick_hud();
	}
};

// --- 2. Amount Control Bottom Bar & Settings Rows ---
Cheat_Menu.append_amount_selection = function () { };

Cheat_Menu.append_bottom_bar_controls = function (labelText, onZero, onApply) {
	var row = document.createElement('div'); row.className = "cheat_bottom_bar";
	var leftGroup = document.createElement('div'); leftGroup.className = "cheat_amount_group";
	var label = document.createElement('div'); label.className = "cheat_label"; label.innerHTML = labelText;
	var amtSelector = document.createElement('div'); amtSelector.className = "cheat_controls";

	var btnL = document.createElement('button'); btnL.className = "cheat_btn"; btnL.innerHTML = "◄";
	btnL.addEventListener('mousedown', function (e) { e.preventDefault(); Cheat_Menu.scroll_amount("left"); });
	var val = document.createElement('div'); val.className = "cheat_value"; val.innerHTML = Cheat_Menu.amounts[Cheat_Menu.amount_index];
	var btnR = document.createElement('button'); btnR.className = "cheat_btn"; btnR.innerHTML = "►";
	btnR.addEventListener('mousedown', function (e) { e.preventDefault(); Cheat_Menu.scroll_amount("right"); });

	amtSelector.appendChild(btnL); amtSelector.appendChild(val); amtSelector.appendChild(btnR);
	leftGroup.appendChild(label); leftGroup.appendChild(amtSelector);

	var actions = document.createElement('div'); actions.className = "cheat_controls";
	var btnZero = document.createElement('button'); btnZero.className = "cheat_btn"; btnZero.innerHTML = "0";
	btnZero.addEventListener('mousedown', function (e) { e.preventDefault(); onZero(); });
	var btnMinus = document.createElement('button'); btnMinus.className = "cheat_btn"; btnMinus.innerHTML = "- " + Cheat_Menu.amounts[Cheat_Menu.amount_index];
	btnMinus.addEventListener('mousedown', function (e) { e.preventDefault(); onApply("left"); });
	var btnPlus = document.createElement('button'); btnPlus.className = "cheat_btn"; btnPlus.innerHTML = "+ " + Cheat_Menu.amounts[Cheat_Menu.amount_index];
	btnPlus.addEventListener('mousedown', function (e) { e.preventDefault(); onApply("right"); });

	actions.appendChild(btnZero); actions.appendChild(btnMinus); actions.appendChild(btnPlus);
	row.appendChild(leftGroup); row.appendChild(actions); Cheat_Menu.content.appendChild(row);
};

Cheat_Menu.append_setting_row = function (label, valueText, onLeft, onRight) {
	var row = document.createElement('div'); row.className = "cheat_setting_row";
	var labelDiv = document.createElement('div'); labelDiv.className = "cheat_label"; labelDiv.innerHTML = label;
	var controls = document.createElement('div'); controls.className = "cheat_controls";
	var btnLeft = document.createElement('button'); btnLeft.className = "cheat_btn"; btnLeft.innerHTML = "◄";
	if (onLeft) btnLeft.addEventListener('mousedown', function (e) { e.preventDefault(); onLeft(); }); else btnLeft.style.visibility = "hidden";
	var valDiv = document.createElement('div'); valDiv.className = "cheat_value"; valDiv.innerHTML = valueText;
	var btnRight = document.createElement('button'); btnRight.className = "cheat_btn"; btnRight.innerHTML = "►";
	if (onRight) btnRight.addEventListener('mousedown', function (e) { e.preventDefault(); onRight(); }); else btnRight.style.visibility = "hidden";
	controls.appendChild(btnLeft); controls.appendChild(valDiv); controls.appendChild(btnRight);
	row.appendChild(labelDiv); row.appendChild(controls); Cheat_Menu.content.appendChild(row);
};

// --- 3. Override Content Rendering for Unified Bar ---
Cheat_Menu.append_item_selection = function () {
	Cheat_Menu.append_searchable_list($dataItems, Cheat_Menu.item_selection, function (idx) { Cheat_Menu.item_selection = idx; SoundManager.playSystemSound(0); Cheat_Menu.update_menu(); }, function (item) { return item ? item.name : "NULL"; }, true, function (idx) { return "x" + ($gameParty._items[idx] || 0); });
	var qty = $gameParty._items[Cheat_Menu.item_selection] || 0;
	Cheat_Menu.append_bottom_bar_controls("Owned: " + qty, function () { Cheat_Menu.give_item(Cheat_Menu.item_selection, -qty); Cheat_Menu.update_menu(); SoundManager.playSystemSound(1); }, Cheat_Menu.apply_current_item);
};

Cheat_Menu.append_weapon_selection = function () {
	Cheat_Menu.append_searchable_list($dataWeapons, Cheat_Menu.weapon_selection, function (idx) { Cheat_Menu.weapon_selection = idx; SoundManager.playSystemSound(0); Cheat_Menu.update_menu(); }, function (item) { return item ? item.name : "NULL"; }, true, function (idx) { return "x" + ($gameParty._weapons[idx] || 0); });
	var qty = $gameParty._weapons[Cheat_Menu.weapon_selection] || 0;
	Cheat_Menu.append_bottom_bar_controls("Owned: " + qty, function () { Cheat_Menu.give_weapon(Cheat_Menu.weapon_selection, -qty); Cheat_Menu.update_menu(); SoundManager.playSystemSound(1); }, Cheat_Menu.apply_current_weapon);
};

Cheat_Menu.append_armor_selection = function () {
	Cheat_Menu.append_searchable_list($dataArmors, Cheat_Menu.armor_selection, function (idx) { Cheat_Menu.armor_selection = idx; SoundManager.playSystemSound(0); Cheat_Menu.update_menu(); }, function (item) { return item ? item.name : "NULL"; }, true, function (idx) { return "x" + ($gameParty._armors[idx] || 0); });
	var qty = $gameParty._armors[Cheat_Menu.armor_selection] || 0;
	Cheat_Menu.append_bottom_bar_controls("Owned: " + qty, function () { Cheat_Menu.give_armor(Cheat_Menu.armor_selection, -qty); Cheat_Menu.update_menu(); SoundManager.playSystemSound(1); }, Cheat_Menu.apply_current_armor);
};

Cheat_Menu.append_gold_status = function () {
	var qty = $gameParty._gold;
	Cheat_Menu.append_bottom_bar_controls("Gold: " + qty, function () { Cheat_Menu.give_gold(-qty); Cheat_Menu.update_menu(); SoundManager.playSystemSound(1); }, Cheat_Menu.apply_current_gold);
};

Cheat_Menu.append_exp_cheat = function () {
	var qty = $gameActors._data[Cheat_Menu.cheat_selected_actor] ? $gameActors._data[Cheat_Menu.cheat_selected_actor].currentExp() : 0;
	Cheat_Menu.append_bottom_bar_controls("EXP: " + qty, function () { if ($gameActors._data[Cheat_Menu.cheat_selected_actor]) { Cheat_Menu.give_exp($gameActors._data[Cheat_Menu.cheat_selected_actor], -qty); Cheat_Menu.update_menu(); SoundManager.playSystemSound(1); } }, Cheat_Menu.apply_current_exp);
};

Cheat_Menu.append_variable_selection = function () {
	Cheat_Menu.append_searchable_list($dataSystem.variables, Cheat_Menu.variable_selection, function (idx) { Cheat_Menu.variable_selection = idx; SoundManager.playSystemSound(0); Cheat_Menu.update_menu(); }, function (item, idx) { return item || "Variable " + idx; }, true, function (idx) { return $gameVariables.value(idx) || 0; });
	var qty = $gameVariables.value(Cheat_Menu.variable_selection) || 0;
	Cheat_Menu.append_bottom_bar_controls("Value: " + qty, function () { Cheat_Menu.set_variable(Cheat_Menu.variable_selection, -qty); Cheat_Menu.update_menu(); SoundManager.playSystemSound(1); }, Cheat_Menu.apply_current_variable);
};

Cheat_Menu.append_stat_selection = function () {
	var stat_string = "";
	if ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus) {
		if (Cheat_Menu.stat_selection >= $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus.length) Cheat_Menu.stat_selection = 0;
		stat_string += $dataSystem.terms.params[Cheat_Menu.stat_selection];
	}
	var row = document.createElement('div'); row.className = "cheat_row";
	var btnL = document.createElement('button'); btnL.className = "cheat_btn"; btnL.innerHTML = "◄ Stat";
	btnL.addEventListener('mousedown', function (e) { e.preventDefault(); Cheat_Menu.scroll_stat("left"); });
	var statLbl = document.createElement('div'); statLbl.className = "cheat_value"; statLbl.innerHTML = stat_string; statLbl.style.flex = "1";
	var btnR = document.createElement('button'); btnR.className = "cheat_btn"; btnR.innerHTML = "Stat ►";
	btnR.addEventListener('mousedown', function (e) { e.preventDefault(); Cheat_Menu.scroll_stat("right"); });
	row.appendChild(btnL); row.appendChild(statLbl); row.appendChild(btnR); Cheat_Menu.content.appendChild(row);

	var qty = ($gameActors._data[Cheat_Menu.cheat_selected_actor] && $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus) ? $gameActors._data[Cheat_Menu.cheat_selected_actor]._paramPlus[Cheat_Menu.stat_selection] : 0;
	Cheat_Menu.append_bottom_bar_controls("Bonus: " + qty, function () { Cheat_Menu.give_stat($gameActors._data[Cheat_Menu.cheat_selected_actor], Cheat_Menu.stat_selection, -qty); Cheat_Menu.update_menu(); SoundManager.playSystemSound(1); }, Cheat_Menu.apply_current_stat);
};

// --- 4. Quick Action HUD Engine ---
Cheat_Menu.hud_config = { enabled: false, position: 'Top', opacity: 40, fontSize: 12, active: ['party_full_hp', 'enemy_hp_0', 'toggle_noclip', 'open_inv', 'open_vars'] };
Cheat_Menu.hud_actions = {
	'open_inv': { title: 'Inventory', fn: function () { Cheat_Menu.open_tab_by_name('Inventory'); } },
	'open_vars': { title: 'Vars & Switches', fn: function () { Cheat_Menu.open_tab_by_name('Variables & Switches'); } },
	'open_combat': { title: 'Combat Menu', fn: function () { Cheat_Menu.open_tab_by_name('Combat & Vitals'); } },
	'toggle_noclip': { title: 'No Clip', fn: function () { $gamePlayer._through = !$gamePlayer._through; SoundManager.playSystemSound($gamePlayer._through ? 1 : 2); } },
	'toggle_godmode': { title: 'God Mode', fn: function () { var actor = $gameActors._data[Cheat_Menu.cheat_selected_actor]; if (actor) { if (actor.god_mode) { Cheat_Menu.god_mode_off(actor); SoundManager.playSystemSound(2); } else { Cheat_Menu.god_mode(actor); SoundManager.playSystemSound(1); } } } },
	'party_full_hp': { title: 'Party Full HP', fn: function () { Cheat_Menu.recover_party_hp(true); SoundManager.playSystemSound(1); } },
	'party_full_mp': { title: 'Party Full MP', fn: function () { Cheat_Menu.recover_party_mp(true); SoundManager.playSystemSound(1); } },
	'party_full_tp': { title: 'Party Full TP', fn: function () { Cheat_Menu.recover_party_tp(true); SoundManager.playSystemSound(1); } },
	'party_hp_0': { title: 'Party HP 0', fn: function () { Cheat_Menu.set_party_hp(0, true); SoundManager.playSystemSound(1); } },
	'party_hp_1': { title: 'Party HP 1', fn: function () { Cheat_Menu.set_party_hp(1, true); SoundManager.playSystemSound(1); } },
	'enemy_hp_0': { title: 'Enemy HP 0 (Alive)', fn: function () { Cheat_Menu.set_enemy_hp(0, true); SoundManager.playSystemSound(1); } },
	'enemy_hp_1': { title: 'Enemy HP 1 (Alive)', fn: function () { Cheat_Menu.set_enemy_hp(1, true); SoundManager.playSystemSound(1); } },
	'enemy_hp_0_all': { title: 'Enemy HP 0 (All)', fn: function () { Cheat_Menu.set_enemy_hp(0, false); SoundManager.playSystemSound(1); } },
	'enemy_hp_1_all': { title: 'Enemy HP 1 (All)', fn: function () { Cheat_Menu.set_enemy_hp(1, false); SoundManager.playSystemSound(1); } },
	'clear_party_states': { title: 'Clear States', fn: function () { Cheat_Menu.clear_party_states(); SoundManager.playSystemSound(1); } }
};

Cheat_Menu.open_tab_by_name = function (name) {
	var names = Cheat_Menu.get_menu_names(); var idx = names.indexOf(name);
	if (idx !== -1) {
		Cheat_Menu.cheat_selected = idx; Cheat_Menu.sub_tab_selected = 0;
		if (!Cheat_Menu.cheat_menu_open) {
			document.body.appendChild(Cheat_Menu.overlay_box);
		}
		Cheat_Menu.overlay_box.style.display = "flex"; Cheat_Menu.cheat_menu_open = true;
		SoundManager.playSystemSound(1); Cheat_Menu.update_menu();
	}
};

Cheat_Menu.render_quick_hud = function () {
	if (!Cheat_Menu.quick_hud_el) {
		Cheat_Menu.quick_hud_el = document.createElement('div');
		Cheat_Menu.quick_hud_el.id = 'cheat_quick_hud';
		document.body.appendChild(Cheat_Menu.quick_hud_el);

		Cheat_Menu.quick_hud_el.addEventListener('touchstart', function (e) {
			e.stopPropagation();
		}, { passive: false });

		Cheat_Menu.quick_hud_el.addEventListener('touchend', function (e) {
			e.stopPropagation();
		}, { passive: false });

		Cheat_Menu.quick_hud_el.addEventListener('mousedown', function (e) {
			e.stopPropagation();
		}, false);
	}

	Cheat_Menu.quick_hud_el.innerHTML = "";
	Cheat_Menu.quick_hud_el.className = Cheat_Menu.hud_config.position.toLowerCase();

	var isEditingHUD = Cheat_Menu.cheat_menu_open &&
		Cheat_Menu.get_menu_names()[Cheat_Menu.cheat_selected] === "Quick Actions HUD";

	if (!Cheat_Menu.hud_config.enabled || (Cheat_Menu.cheat_menu_open && !isEditingHUD)) {
		Cheat_Menu.quick_hud_el.style.display = 'none';
		return;
	}

	Cheat_Menu.quick_hud_el.style.display = 'flex';

	for (var i = 0; i < Cheat_Menu.hud_config.active.length; i++) {
		let key = Cheat_Menu.hud_config.active[i];
		let action = Cheat_Menu.hud_actions[key];
		if (!action) continue;

		let btn = document.createElement('button');
		btn.className = 'cheat_hud_btn';
		btn.type = 'button';
		btn.style.fontSize = Cheat_Menu.hud_config.fontSize + "px";
		btn.style.opacity = Cheat_Menu.hud_config.opacity / 100;
		btn.innerHTML = "<span>" + action.title + "</span>";

		let runAction = function (e) {
			e.stopPropagation();
			e.preventDefault();
			action.fn();
		};

		let stopOnly = function (e) {
			e.stopPropagation();
			e.preventDefault();
		};

		btn.addEventListener('mousedown', runAction, false);
		btn.addEventListener('touchstart', runAction, { passive: false });
		btn.addEventListener('touchend', stopOnly, { passive: false });
		btn.addEventListener('click', stopOnly, false);

		Cheat_Menu.quick_hud_el.appendChild(btn);
	}
};

// --- 5. Hover Toggle Button & Settings Injection ---
Cheat_Menu.btn_config = { enabled: true, opacity: 30, size: 40, posIndex: 1 };
Cheat_Menu.btn_positions = ["Bottom Center", "Bottom Right", "Bottom Left", "Top Right", "Top Left"];

Cheat_Menu.render_hover_button = function () {
	if (!Cheat_Menu.hover_btn) {
		Cheat_Menu.hover_btn = document.createElement('div');
		Cheat_Menu.hover_btn.id = "cheat_hover_btn";
		Cheat_Menu.hover_btn.innerHTML = "★";

		Cheat_Menu.hover_btn.addEventListener('mousedown', function (e) {
			e.stopPropagation();
			e.preventDefault();
			if (Cheat_Menu.cheat_menu_open) { Cheat_Menu.close_menu(); }
			else {
				if (!Cheat_Menu.cheat_menu_open) {
					document.body.appendChild(Cheat_Menu.overlay_box);
				}
				Cheat_Menu.overlay_box.style.display = "flex"; Cheat_Menu.cheat_menu_open = true;
				SoundManager.playSystemSound(1); Cheat_Menu.update_menu(); Cheat_Menu.render_quick_hud();
			}
		});
		document.body.appendChild(Cheat_Menu.hover_btn);
	}
	if (!Cheat_Menu.btn_config.enabled) { Cheat_Menu.hover_btn.style.display = "none"; return; }
	Cheat_Menu.hover_btn.style.display = "flex"; Cheat_Menu.hover_btn.style.opacity = Cheat_Menu.btn_config.opacity / 100;
	Cheat_Menu.hover_btn.style.width = Cheat_Menu.btn_config.size + "px"; Cheat_Menu.hover_btn.style.height = Cheat_Menu.btn_config.size + "px"; Cheat_Menu.hover_btn.style.fontSize = (Cheat_Menu.btn_config.size * 0.5) + "px";
	Cheat_Menu.hover_btn.style.left = ""; Cheat_Menu.hover_btn.style.right = ""; Cheat_Menu.hover_btn.style.top = ""; Cheat_Menu.hover_btn.style.bottom = ""; Cheat_Menu.hover_btn.style.transform = "";
	switch (Cheat_Menu.btn_config.posIndex) {
		case 0: Cheat_Menu.hover_btn.style.bottom = "15px"; Cheat_Menu.hover_btn.style.left = "50%"; Cheat_Menu.hover_btn.style.transform = "translateX(-50%)"; break;
		case 1: Cheat_Menu.hover_btn.style.bottom = "15px"; Cheat_Menu.hover_btn.style.right = "15px"; break;
		case 2: Cheat_Menu.hover_btn.style.bottom = "15px"; Cheat_Menu.hover_btn.style.left = "15px"; break;
		case 3: Cheat_Menu.hover_btn.style.top = "15px"; Cheat_Menu.hover_btn.style.right = "15px"; break;
		case 4: Cheat_Menu.hover_btn.style.top = "15px"; Cheat_Menu.hover_btn.style.left = "15px"; break;
	}
};

Cheat_Menu.inject_ui_settings = function () {
	Cheat_Menu.menus.push(function () {
		Cheat_Menu.append_cheat_title("Interface");
		Cheat_Menu.append_setting_row("Menu Scale Size", Cheat_Menu.menu_scale + "%", function () { Cheat_Menu.menu_scale = Math.max(30, Cheat_Menu.menu_scale - 5); Cheat_Menu.update_menu(); }, function () { Cheat_Menu.menu_scale = Math.min(100, Cheat_Menu.menu_scale + 5); Cheat_Menu.update_menu(); });
		Cheat_Menu.append_setting_row("Hover Toggle Button", Cheat_Menu.btn_config.enabled ? "ON" : "OFF", null, function () { Cheat_Menu.btn_config.enabled = !Cheat_Menu.btn_config.enabled; Cheat_Menu.update_menu(); });
		if (Cheat_Menu.btn_config.enabled) {
			Cheat_Menu.append_setting_row("Toggle Button Position", Cheat_Menu.btn_positions[Cheat_Menu.btn_config.posIndex], function () { Cheat_Menu.btn_config.posIndex = (Cheat_Menu.btn_config.posIndex - 1 + Cheat_Menu.btn_positions.length) % Cheat_Menu.btn_positions.length; Cheat_Menu.update_menu(); }, function () { Cheat_Menu.btn_config.posIndex = (Cheat_Menu.btn_config.posIndex + 1) % Cheat_Menu.btn_positions.length; Cheat_Menu.update_menu(); });
			Cheat_Menu.append_setting_row("Toggle Button Opacity", Cheat_Menu.btn_config.opacity + "%", function () { Cheat_Menu.btn_config.opacity = Math.max(10, Cheat_Menu.btn_config.opacity - 10); Cheat_Menu.update_menu(); }, function () { Cheat_Menu.btn_config.opacity = Math.min(100, Cheat_Menu.btn_config.opacity + 10); Cheat_Menu.update_menu(); });
		}
	});

	Cheat_Menu.menus.push(function () {
		Cheat_Menu.append_cheat_title("Quick Actions HUD");
		Cheat_Menu.append_setting_row("Enable Taskbar HUD", Cheat_Menu.hud_config.enabled ? "ON" : "OFF", null, function () { Cheat_Menu.hud_config.enabled = !Cheat_Menu.hud_config.enabled; Cheat_Menu.update_menu(); });
		if (Cheat_Menu.hud_config.enabled) {
			Cheat_Menu.append_setting_row("Taskbar Position", Cheat_Menu.hud_config.position, null, function () { Cheat_Menu.hud_config.position = Cheat_Menu.hud_config.position === 'Top' ? 'Bottom' : 'Top'; Cheat_Menu.update_menu(); });
			Cheat_Menu.append_setting_row("HUD Opacity", Cheat_Menu.hud_config.opacity + "%", function () { Cheat_Menu.hud_config.opacity = Math.max(0, Cheat_Menu.hud_config.opacity - 10); Cheat_Menu.update_menu(); }, function () { Cheat_Menu.hud_config.opacity = Math.min(100, Cheat_Menu.hud_config.opacity + 10); Cheat_Menu.update_menu(); });
			Cheat_Menu.append_setting_row("HUD Font Size", Cheat_Menu.hud_config.fontSize + "px", function () { Cheat_Menu.hud_config.fontSize = Math.max(8, Cheat_Menu.hud_config.fontSize - 1); Cheat_Menu.update_menu(); }, function () { Cheat_Menu.hud_config.fontSize = Math.min(24, Cheat_Menu.hud_config.fontSize + 1); Cheat_Menu.update_menu(); });

			Cheat_Menu.append_title("Active HUD Buttons");
			var grid = document.createElement('div'); grid.className = "cheat_settings_grid";
			var keys = Object.keys(Cheat_Menu.hud_actions);
			for (var i = 0; i < keys.length; i++) {
				let k = keys[i]; let isActive = Cheat_Menu.hud_config.active.indexOf(k) !== -1;
				var btn = document.createElement('button'); btn.className = "cheat_btn" + (isActive ? " active" : "");
				btn.style.width = "100%"; btn.style.padding = "8px 4px"; btn.style.backgroundColor = isActive ? "rgba(0, 136, 255, 0.3)" : ""; btn.style.borderColor = isActive ? "#00aaff" : ""; btn.innerHTML = Cheat_Menu.hud_actions[k].title;
				btn.addEventListener('mousedown', function (e) { e.preventDefault(); if (isActive) Cheat_Menu.hud_config.active.splice(Cheat_Menu.hud_config.active.indexOf(k), 1); else Cheat_Menu.hud_config.active.push(k); Cheat_Menu.update_menu(); });
				grid.appendChild(btn);
			} Cheat_Menu.content.appendChild(grid);
		}
	});
};

// --- 6. Grouping, Scrolling & Core Overrides ---
Cheat_Menu.group_menus_by_umbrella = function () {
	var rawNames = [];
	var real_append = Cheat_Menu.append_cheat_title;
	Cheat_Menu.append_cheat_title = function (name) {
		rawNames.push(name);
	};

	var old_content = Cheat_Menu.content;
	Cheat_Menu.content = document.createElement('div');

	for (var i = 0; i < Cheat_Menu.menus.length; i++) {
		var len = rawNames.length;
		Cheat_Menu.menus[i]();
		if (rawNames.length === len) rawNames.push("Menu " + (i + 1));
	}

	Cheat_Menu.append_cheat_title = real_append;
	Cheat_Menu.content = old_content;

	var rawMenus = Cheat_Menu.menus.slice();
	var newMenus = [];
	var newNames = [];

	var groups = {
		"Inventory": {
			keys: ["item", "weapon", "armor"],
			items: []
		},
		"Combat & Vitals": {
			keys: ["hp", "mp", "tp", "enemy", "party", "god mode", "god"],
			items: []
		},
		"Progression": {
			keys: ["exp", "stat", "gold"],
			items: []
		},
		"Variables & Switches": {
			keys: ["variable", "switch"],
			items: []
		},
		"Movement": {
			keys: ["no clip", "speed"],
			items: []
		},
		"Navigation": {
			keys: ["save and recall", "teleport"],
			items: []
		},
		"Settings": {
			keys: ["settings", "interface", "quick actions hud", "general"],
			items: []
		}
	};

	var isMatch = function (name, keys) {
		var lower = name.toLowerCase();
		for (var k = 0; k < keys.length; k++) {
			if (lower.indexOf(keys[k]) !== -1) return true;
		}
		return false;
	};

	var uncategorized = [];
	for (var i = 0; i < rawNames.length; i++) {
		var n = rawNames[i];
		var fn = rawMenus[i];

		if (isMatch(n, groups["Inventory"].keys)) {
			groups["Inventory"].items.push({ name: n, fn: fn });
		} else if (isMatch(n, groups["Combat & Vitals"].keys)) {
			groups["Combat & Vitals"].items.push({ name: n, fn: fn });
		} else if (isMatch(n, groups["Progression"].keys)) {
			groups["Progression"].items.push({ name: n, fn: fn });
		} else if (isMatch(n, groups["Variables & Switches"].keys)) {
			groups["Variables & Switches"].items.push({ name: n, fn: fn });
		} else if (isMatch(n, groups["Movement"].keys)) {
			groups["Movement"].items.push({ name: n, fn: fn });
		} else if (isMatch(n, groups["Navigation"].keys)) {
			groups["Navigation"].items.push({ name: n, fn: fn });
		} else if (isMatch(n, groups["Settings"].keys)) {
			groups["Settings"].items.push({ name: n, fn: fn });
		} else {
			uncategorized.push({ name: n, fn: fn });
		}
	}

	var createUmbrella = function (title, items) {
		if (items.length === 0) return;

		newMenus.push(function () {
			var nav = document.createElement('div');
			nav.className = "cheat_sub_nav";

			if (Cheat_Menu.sub_tab_selected >= items.length) {
				Cheat_Menu.sub_tab_selected = 0;
			}

			for (var j = 0; j < items.length; j++) {
				let btn = document.createElement('button');
				btn.className = "cheat_sub_tab" + (Cheat_Menu.sub_tab_selected === j ? " active" : "");
				btn.innerHTML = items[j].name;
				let idx = j;

				btn.addEventListener('mousedown', function (e) {
					e.preventDefault();
					if (Cheat_Menu.sub_tab_selected !== idx) {
						Cheat_Menu.sub_tab_selected = idx;
						Cheat_Menu.list_state = { search: "", scroll: 0 };
						SoundManager.playSystemSound(0);
						Cheat_Menu.update_menu();
					}
				});

				nav.appendChild(btn);
			}

			Cheat_Menu.content.appendChild(nav);

			var old_append = Cheat_Menu.append_cheat_title;
			Cheat_Menu.append_cheat_title = function () { };
			items[Cheat_Menu.sub_tab_selected].fn();
			Cheat_Menu.append_cheat_title = old_append;
		});

		newNames.push(title);
	};

	createUmbrella("Inventory", groups["Inventory"].items);
	createUmbrella("Combat & Vitals", groups["Combat & Vitals"].items);
	createUmbrella("Progression", groups["Progression"].items);
	createUmbrella("Variables & Switches", groups["Variables & Switches"].items);
	createUmbrella("Movement", groups["Movement"].items);
	createUmbrella("Navigation", groups["Navigation"].items);
	createUmbrella("Settings", groups["Settings"].items);

	for (var k = 0; k < uncategorized.length; k++) {
		newMenus.push(uncategorized[k].fn);
		newNames.push(uncategorized[k].name);
	}

	Cheat_Menu.menus = newMenus;
	Cheat_Menu.menu_names = newNames;

	if (Cheat_Menu.cheat_selected >= Cheat_Menu.menus.length) {
		Cheat_Menu.cheat_selected = 0;
	}

	Cheat_Menu.get_menu_names = function () {
		return Cheat_Menu.menu_names;
	};
};

Cheat_Menu._is_centered = false;
var _Cheat_Menu_update_menu = Cheat_Menu.update_menu;
Cheat_Menu.update_menu = function () {
	if (!Cheat_Menu._menus_grouped && Cheat_Menu.menus.length > 0) {
		Cheat_Menu.inject_ui_settings();
		Cheat_Menu.group_menus_by_umbrella();
		Cheat_Menu._menus_grouped = true;
	}


	if (!Cheat_Menu.menus || Cheat_Menu.menus.length === 0) return;
	if (!Cheat_Menu.menu_names || Cheat_Menu.menu_names.length === 0) return;
	if (Cheat_Menu.cheat_selected < 0 ||
		Cheat_Menu.cheat_selected >= Cheat_Menu.menus.length) {
		Cheat_Menu.cheat_selected = 0;
	}


	// Inject Close Button into the main menu container once
	var cm = document.getElementById('cheat_menu');
	if (cm && !document.getElementById('cheat_menu_close')) {
		var closeBtn = document.createElement('button');
		closeBtn.id = "cheat_menu_close"; closeBtn.innerHTML = "✖";
		closeBtn.addEventListener('mousedown', function (e) { e.preventDefault(); e.stopPropagation(); Cheat_Menu.close_menu(); });
		cm.appendChild(closeBtn);
	}

	if (!Cheat_Menu._is_centered && Cheat_Menu.overlay_box && Cheat_Menu.overlay_box.style.display !== "none") {
		Cheat_Menu.overlay_box.style.left = "50%"; Cheat_Menu.overlay_box.style.top = "50%"; Cheat_Menu.overlay_box.style.transform = "translate(-50%, -50%)"; Cheat_Menu._is_centered = true;
	}

	_Cheat_Menu_update_menu.apply(this, arguments);
	var names = Cheat_Menu.get_menu_names(); Cheat_Menu.sidebar.innerHTML = "";
	for (var i = 0; i < names.length; i++) {
		let btn = document.createElement('button'); btn.className = "sidebar_btn" + (Cheat_Menu.cheat_selected === i ? " active" : ""); btn.innerHTML = names[i]; let idx = i;
		btn.addEventListener('mousedown', function (e) { e.preventDefault(); if (Cheat_Menu.cheat_selected !== idx) { Cheat_Menu.cheat_selected = idx; Cheat_Menu.sub_tab_selected = 0; Cheat_Menu.list_state = { search: "", scroll: 0 }; SoundManager.playSystemSound(0); Cheat_Menu.update_menu(); } }); Cheat_Menu.sidebar.appendChild(btn);
	}
	Cheat_Menu.render_hover_button(); Cheat_Menu.render_quick_hud(); Cheat_Menu.update_menu_size();
};

Cheat_Menu.append_cheat_title = function (cheat_name) { Cheat_Menu.append_title(cheat_name); };
Cheat_Menu.list_state = { search: "", scroll: 0 };
Cheat_Menu.append_searchable_list = function (dataArray, selectedIdx, onSelectCallback, getNameFunc, isGrid, getValueFunc) {
	var container = document.createElement('div'); container.className = "cheat_search_container";
	var searchInput = document.createElement('input'); searchInput.className = "cheat_search_input"; searchInput.type = "text"; searchInput.placeholder = "Search..."; searchInput.value = Cheat_Menu.list_state.search;
	var listDiv = document.createElement('ul'); listDiv.className = "cheat_list" + (isGrid ? " grid" : "");
	var renderList = function (filterText) {
		listDiv.innerHTML = ""; filterText = filterText.toLowerCase(); var fragment = document.createDocumentFragment();
		for (var i = 1; i < dataArray.length; i++) {
			if (!dataArray[i]) continue; var name = getNameFunc ? getNameFunc(dataArray[i], i) : (dataArray[i].name || dataArray[i]); if (typeof name !== "string") name = String(name);
			if (name && name.toLowerCase().indexOf(filterText) !== -1) {
				var li = document.createElement('li'); li.className = "cheat_list_item" + (i === selectedIdx ? " selected" : "");
				var nameSpan = document.createElement('span'); nameSpan.innerHTML = i + ": " + name; li.appendChild(nameSpan);
				if (getValueFunc) { var valDiv = document.createElement('div'); valDiv.className = "cheat_list_item_val"; valDiv.innerHTML = getValueFunc(i); li.appendChild(valDiv); }
				li.addEventListener('mousedown', (function (idx) { return function (e) { e.preventDefault(); onSelectCallback(idx); }; })(i)); fragment.appendChild(li);
			}
		} listDiv.appendChild(fragment);
	};
	searchInput.addEventListener('input', function (e) { Cheat_Menu.list_state.search = e.target.value; Cheat_Menu.list_state.scroll = 0; renderList(e.target.value); });
	searchInput.addEventListener('keydown', function (e) { e.stopPropagation(); });
	listDiv.onscroll = function () { Cheat_Menu.list_state.scroll = listDiv.scrollTop; };
	renderList(Cheat_Menu.list_state.search); container.appendChild(searchInput); container.appendChild(listDiv); Cheat_Menu.content.appendChild(container);
	requestAnimationFrame(function () { listDiv.scrollTop = Cheat_Menu.list_state.scroll; });
};

Cheat_Menu.update_menu_size = function () { Cheat_Menu.overlay_box.style.width = Cheat_Menu.menu_scale + "vw"; Cheat_Menu.overlay_box.style.height = Cheat_Menu.menu_scale + "vh"; };
var _Cheat_Menu_position_menu = Cheat_Menu.position_menu; Cheat_Menu.position_menu = function (event) { _Cheat_Menu_position_menu.apply(this, arguments); Cheat_Menu.update_menu_size(); };

// ── DRAG-TO-SCROLL (JoiPlay compatible) ──────────────────────────────
Cheat_Menu.initDragScroll = function (el) {
	if (!el || el._dragScrollBound) return; // prevent double-binding
	el._dragScrollBound = true;

	var startY = 0;
	var startX = 0;
	var scrollTopStart = 0;
	var scrollLeftStart = 0;
	var isDragging = false;
	var DRAG_THRESHOLD = 5; // px — ignore micro-taps
	var hasMoved = false;

	function getClientY(e) {
		return e.touches ? e.touches[0].clientY : e.clientY;
	}
	function getClientX(e) {
		return e.touches ? e.touches[0].clientX : e.clientX;
	}

	function onStart(e) {
		isDragging = true;
		hasMoved = false;
		startY = getClientY(e);
		startX = getClientX(e);
		scrollTopStart = el.scrollTop;
		scrollLeftStart = el.scrollLeft;
		el.style.cursor = 'grabbing';
		el.style.userSelect = 'none';
	}

	function onMove(e) {
		if (!isDragging) return;
		var dy = getClientY(e) - startY;
		var dx = getClientX(e) - startX;
		if (!hasMoved && Math.abs(dy) < DRAG_THRESHOLD && Math.abs(dx) < DRAG_THRESHOLD) return;
		hasMoved = true;
		el.scrollTop = scrollTopStart - dy;
		el.scrollLeft = scrollLeftStart - dx;
		// Prevent the RPG Maker canvas from intercepting the move
		e.stopPropagation();
	}

	function onEnd() {
		isDragging = false;
		hasMoved = false;
		el.style.cursor = '';
		el.style.userSelect = '';
	}

	// Mouse events (JoiPlay synthetic) + Touch events (native fallback)
	el.addEventListener('mousedown', onStart, { passive: false });
	el.addEventListener('touchstart', onStart, { passive: true });
	window.addEventListener('mousemove', onMove, { passive: false });
	window.addEventListener('touchmove', onMove, { passive: false });
	window.addEventListener('mouseup', onEnd);
	window.addEventListener('mouseleave', onEnd);
	window.addEventListener('touchend', onEnd);
};

Cheat_Menu.scroll_button_step = 120;

Cheat_Menu.scroll_box_by = function (el, amount) {
	if (!el) return;
	el.scrollTop += amount;
};

Cheat_Menu.ensure_fixed_content_scroll_buttons = function () {
	if (!Cheat_Menu.overlay_box || !Cheat_Menu.content) return;

	var upBtn = Cheat_Menu.overlay_box.querySelector('.cheat_fixed_content_scroll.up');
	var downBtn = Cheat_Menu.overlay_box.querySelector('.cheat_fixed_content_scroll.down');

	if (!upBtn) {
		upBtn = document.createElement('button');
		upBtn.className = 'cheat_fixed_content_scroll up';
		upBtn.type = 'button';
		upBtn.innerHTML = '↑';
		Cheat_Menu.overlay_box.appendChild(upBtn);
	}

	if (!downBtn) {
		downBtn = document.createElement('button');
		downBtn.className = 'cheat_fixed_content_scroll down';
		downBtn.type = 'button';
		downBtn.innerHTML = '↓';
		Cheat_Menu.overlay_box.appendChild(downBtn);
	}

	var bindButton = function (btn, amount) {
		if (btn._cheatBound) return;
		btn._cheatBound = true;

		var holdTimer = null;

		var step = function (e) {
			if (e) {
				e.preventDefault();
				e.stopPropagation();
			}
			Cheat_Menu.scroll_box_by(Cheat_Menu.content, amount);
			Cheat_Menu.refresh_fixed_content_scroll_buttons();
		};

		var start = function (e) {
			step(e);
			if (holdTimer) clearInterval(holdTimer);
			holdTimer = setInterval(function () {
				Cheat_Menu.scroll_box_by(Cheat_Menu.content, amount);
				Cheat_Menu.refresh_fixed_content_scroll_buttons();
			}, 120);
		};

		var stop = function () {
			if (holdTimer) {
				clearInterval(holdTimer);
				holdTimer = null;
			}
		};

		btn.addEventListener('mousedown', start, false);
		btn.addEventListener('touchstart', start, { passive: false });
		btn.addEventListener('mouseup', stop, false);
		btn.addEventListener('mouseleave', stop, false);
		btn.addEventListener('touchend', stop, false);
		btn.addEventListener('touchcancel', stop, false);
	};

	bindButton(upBtn, -Cheat_Menu.scroll_button_step);
	bindButton(downBtn, Cheat_Menu.scroll_button_step);

	if (!Cheat_Menu.content._fixedScrollBound) {
		Cheat_Menu.content._fixedScrollBound = true;

		Cheat_Menu.content.addEventListener('scroll', function () {
			Cheat_Menu.refresh_fixed_content_scroll_buttons();
		}, { passive: true });

		window.addEventListener('resize', function () {
			Cheat_Menu.refresh_fixed_content_scroll_buttons();
		});
	}
};

Cheat_Menu.refresh_fixed_content_scroll_buttons = function () {
	if (!Cheat_Menu.overlay_box || !Cheat_Menu.content) return;

	var upBtn = Cheat_Menu.overlay_box.querySelector('.cheat_fixed_content_scroll.up');
	var downBtn = Cheat_Menu.overlay_box.querySelector('.cheat_fixed_content_scroll.down');
	if (!upBtn || !downBtn) return;

	var maxScroll = Math.max(0, Cheat_Menu.content.scrollHeight - Cheat_Menu.content.clientHeight);
	var hasOverflow = maxScroll > 4;

	if (!hasOverflow) {
		upBtn.style.display = 'none';
		downBtn.style.display = 'none';
		return;
	}

	upBtn.style.display = Cheat_Menu.content.scrollTop > 4 ? 'flex' : 'none';
	downBtn.style.display = Cheat_Menu.content.scrollTop < maxScroll - 4 ? 'flex' : 'none';
};

Cheat_Menu.update_scroll_arrow_visibility = function (host, scroller) {
	if (!host || !scroller) return;

	var upBtn = host.querySelector(':scope > .cheat_scroll_arrow.up');
	var downBtn = host.querySelector(':scope > .cheat_scroll_arrow.down');
	if (!upBtn || !downBtn) return;

	var maxScroll = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
	var hasOverflow = maxScroll > 4;

	if (!hasOverflow) {
		upBtn.style.display = 'none';
		downBtn.style.display = 'none';
		return;
	}

	upBtn.style.display = (scroller.scrollTop > 4) ? 'flex' : 'none';
	downBtn.style.display = (scroller.scrollTop < maxScroll - 4) ? 'flex' : 'none';
};

Cheat_Menu.attach_scroll_arrows = function (host, scroller, step) {
	if (!host || !scroller) return;

	var oldBtns = host.querySelectorAll(':scope > .cheat_scroll_arrow');
	for (var i = 0; i < oldBtns.length; i++) {
		oldBtns[i].remove();
	}

	var upBtn = document.createElement('button');
	upBtn.className = 'cheat_scroll_arrow up';
	upBtn.type = 'button';
	upBtn.innerHTML = '↑';

	var downBtn = document.createElement('button');
	downBtn.className = 'cheat_scroll_arrow down';
	downBtn.type = 'button';
	downBtn.innerHTML = '↓';

	var bindScroll = function (btn, amount) {
		var holdTimer = null;

		var stepOnce = function (e) {
			if (e) {
				e.preventDefault();
				e.stopPropagation();
			}
			scroller.scrollTop += amount;
			Cheat_Menu.update_scroll_arrow_visibility(host, scroller);
		};

		var start = function (e) {
			stepOnce(e);
			if (holdTimer) clearInterval(holdTimer);
			holdTimer = setInterval(function () {
				scroller.scrollTop += amount;
				Cheat_Menu.update_scroll_arrow_visibility(host, scroller);
			}, 120);
		};

		var stop = function () {
			if (holdTimer) {
				clearInterval(holdTimer);
				holdTimer = null;
			}
		};

		btn.addEventListener('mousedown', start, false);
		btn.addEventListener('touchstart', start, { passive: false });
		btn.addEventListener('mouseup', stop, false);
		btn.addEventListener('mouseleave', stop, false);
		btn.addEventListener('touchend', stop, false);
		btn.addEventListener('touchcancel', stop, false);
	};

	bindScroll(upBtn, -step);
	bindScroll(downBtn, step);

	host.appendChild(upBtn);
	host.appendChild(downBtn);

	if (!scroller._cheatScrollArrowBound) {
		scroller._cheatScrollArrowBound = true;

		scroller.addEventListener('scroll', function () {
			Cheat_Menu.update_scroll_arrow_visibility(host, scroller);
		}, { passive: true });

		window.addEventListener('resize', function () {
			Cheat_Menu.update_scroll_arrow_visibility(host, scroller);
		});
	}

	requestAnimationFrame(function () {
		Cheat_Menu.update_scroll_arrow_visibility(host, scroller);
	});
};

// Attach drag-scroll to all scrollable containers after each menu render
var _origUpdatemenu = Cheat_Menu.update_menu;
Cheat_Menu.update_menu = function () {
	_origUpdatemenu.apply(this, arguments);

	requestAnimationFrame(function () {
		Cheat_Menu.initDragScroll(Cheat_Menu.sidebar);
		Cheat_Menu.initDragScroll(Cheat_Menu.content);
		Cheat_Menu.attach_scroll_arrows(Cheat_Menu.overlay_box, Cheat_Menu.content, 120);

		var searchContainers = document.querySelectorAll('.cheat_search_container');
		for (var i = 0; i < searchContainers.length; i++) {
			var list = searchContainers[i].querySelector('.cheat_list');
			if (list) {
				Cheat_Menu.initDragScroll(list);
				Cheat_Menu.attach_scroll_arrows(searchContainers[i], list, 90);
			}
		}
	});
};
// ─────────────────────────────────────────────────────────────────────

window.addEventListener('load', function () { setTimeout(Cheat_Menu.render_hover_button, 1000); });