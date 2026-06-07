// ============================================================
// Cheat Menu - UI Row Builders
// ============================================================

Cheat_Menu.addEvent = function (el, handler) {
    var sx = 0, sy = 0;
    el.addEventListener('mousedown', function (e) {
        sx = e.clientX;
        sy = e.clientY;
        e.preventDefault();
    });
    el.addEventListener('mouseup', function (e) {
        var dx = e.clientX - sx;
        var dy = e.clientY - sy;
        if (Math.abs(dx) < Cheat_Menu.DRAG_THRESHOLD && Math.abs(dy) < Cheat_Menu.DRAG_THRESHOLD) {
            handler(e);
        }
    });
    el.addEventListener('touchstart', function (e) {
        sx = e.changedTouches[0].clientX;
        sy = e.changedTouches[0].clientY;
    }, { passive: true });
    el.addEventListener('touchend', function (e) {
        var dx = e.changedTouches[0].clientX - sx;
        var dy = e.changedTouches[0].clientY - sy;
        if (Math.abs(dx) < Cheat_Menu.DRAG_THRESHOLD && Math.abs(dy) < Cheat_Menu.DRAG_THRESHOLD) {
            e.preventDefault();
            handler(e);
        }
    }, { passive: false });
};

Cheat_Menu.append_title = function (title) {
    var title_div = document.createElement('div');
    title_div.className = "cheat_menu_title";
    title_div.innerHTML = title;
    Cheat_Menu.content.appendChild(title_div);
};

// Page title registration (used by group_menus_by_umbrella to detect page names)
Cheat_Menu.append_cheat_title = function (name) {
    Cheat_Menu.append_title(name);
};

Cheat_Menu.append_description = function (text) {
    var desc_div = document.createElement('div');
    desc_div.className = "cheat_label";
    desc_div.style.textAlign = "center";
    desc_div.style.marginBottom = "10px";
    desc_div.innerHTML = text;
    Cheat_Menu.content.appendChild(desc_div);
};

// Standardized control row: label left, button right
Cheat_Menu.append_cheat = function (cheat_text, status_text, key, click_handler) {
    var row = document.createElement('div');
    row.className = "cheat_control_grid";

    var label = document.createElement('div');
    label.className = "cheat_control_label";
    label.innerHTML = cheat_text;

    var actions = document.createElement('div');
    actions.className = "cheat_control_actions";

    var btnRow = document.createElement('div');
    btnRow.className = "cheat_btn_row";

    var btn = document.createElement('button');
    btn.className = "cheat_btn";
    btn.innerHTML = status_text;
    Cheat_Menu.addEvent(btn, click_handler);

    btnRow.appendChild(btn);
    actions.appendChild(btnRow);

    row.appendChild(label);
    row.appendChild(actions);

    Cheat_Menu.content.appendChild(row);
};

// Scroll selector: ◄ value ► [+ Apply] — compact grid row
Cheat_Menu.append_scroll_selector = function (text, key1, key2, scroll_handler, apply_handler) {
    var row = document.createElement('div');
    row.className = "cheat_control_grid";

    var label = document.createElement('div');
    label.className = "cheat_control_label";
    label.innerHTML = text;

    var actions = document.createElement('div');
    actions.className = "cheat_control_actions";

    var btnRow = document.createElement('div');
    btnRow.className = "cheat_btn_row";

    var btnLeft = document.createElement('button');
    btnLeft.className = "cheat_btn";
    btnLeft.innerHTML = "◄";
    Cheat_Menu.addEvent(btnLeft, scroll_handler.bind(null, "left"));

    var centerText = document.createElement('div');
    centerText.className = "cheat_value";
    centerText.innerHTML = text.replace(/^.*?: /, '');
    centerText.style.minWidth = "28px";

    var btnRight = document.createElement('button');
    btnRight.className = "cheat_btn";
    btnRight.innerHTML = "►";
    Cheat_Menu.addEvent(btnRight, scroll_handler.bind(null, "right"));

    btnRow.appendChild(btnLeft);
    btnRow.appendChild(centerText);
    btnRow.appendChild(btnRight);

    if (apply_handler) {
        var btnApply = document.createElement('button');
        btnApply.className = "cheat_btn";
        btnApply.innerHTML = "Apply";
        Cheat_Menu.addEvent(btnApply, apply_handler);
        btnRow.appendChild(btnApply);
    }

    actions.appendChild(btnRow);
    row.appendChild(label);
    row.appendChild(actions);

    Cheat_Menu.content.appendChild(row);
};

Cheat_Menu.append_sub_header = function (text) {
    var el = document.createElement('div');
    el.className = "cheat_sub_header";
    el.innerHTML = text;
    Cheat_Menu.content.appendChild(el);
};

// Simple add/remove row: label left, [-amount] [+amount] right
Cheat_Menu.append_add_remove = function (text, amount, onApply) {
    var row = document.createElement('div');
    row.className = "cheat_control_grid";

    var label = document.createElement('div');
    label.className = "cheat_control_label";
    label.innerHTML = text;

    var actions = document.createElement('div');
    actions.className = "cheat_control_actions";

    var btnRow = document.createElement('div');
    btnRow.className = "cheat_btn_row";

    var btnRemove = document.createElement('button');
    btnRemove.className = "cheat_btn";
    btnRemove.innerHTML = "-" + amount;
    Cheat_Menu.addEvent(btnRemove, function () { onApply("left"); });

    var btnAdd = document.createElement('button');
    btnAdd.className = "cheat_btn";
    btnAdd.innerHTML = "+" + amount;
    Cheat_Menu.addEvent(btnAdd, function () { onApply("right"); });

    btnRow.appendChild(btnRemove);
    btnRow.appendChild(btnAdd);
    actions.appendChild(btnRow);

    row.appendChild(label);
    row.appendChild(actions);

    Cheat_Menu.content.appendChild(row);
};
