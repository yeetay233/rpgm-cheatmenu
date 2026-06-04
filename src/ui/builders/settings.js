// ============================================================
// Cheat Menu - Settings & Bottom Bar Builders
// ============================================================

Cheat_Menu.append_bottom_bar_controls = function (labelText, onZero, onApply) {
    var row = document.createElement('div');
    row.className = "cheat_bottom_bar";

    var leftGroup = document.createElement('div');
    leftGroup.className = "cheat_amount_group";

    var label = document.createElement('div');
    label.className = "cheat_label";
    label.innerHTML = labelText;

    var amtSelector = document.createElement('div');
    amtSelector.className = "cheat_controls";

    var btnL = document.createElement('button');
    btnL.className = "cheat_btn";
    btnL.innerHTML = "◄";
    btnL.addEventListener('mousedown', function (e) {
        e.preventDefault();
        Cheat_Menu.scroll_amount("left");
    });

    var val = document.createElement('div');
    val.className = "cheat_value";
    val.innerHTML = Cheat_Menu.amounts[Cheat_Menu.amount_index];

    var btnR = document.createElement('button');
    btnR.className = "cheat_btn";
    btnR.innerHTML = "►";
    btnR.addEventListener('mousedown', function (e) {
        e.preventDefault();
        Cheat_Menu.scroll_amount("right");
    });

    amtSelector.appendChild(btnL);
    amtSelector.appendChild(val);
    amtSelector.appendChild(btnR);

    leftGroup.appendChild(label);
    leftGroup.appendChild(amtSelector);

    var actions = document.createElement('div');
    actions.className = "cheat_controls";

    var btnZero = document.createElement('button');
    btnZero.className = "cheat_btn";
    btnZero.innerHTML = "0";
    btnZero.addEventListener('mousedown', function (e) {
        e.preventDefault();
        onZero();
    });

    var btnMinus = document.createElement('button');
    btnMinus.className = "cheat_btn";
    btnMinus.innerHTML = "- " + Cheat_Menu.amounts[Cheat_Menu.amount_index];
    btnMinus.addEventListener('mousedown', function (e) {
        e.preventDefault();
        onApply("left");
    });

    var btnPlus = document.createElement('button');
    btnPlus.className = "cheat_btn";
    btnPlus.innerHTML = "+ " + Cheat_Menu.amounts[Cheat_Menu.amount_index];
    btnPlus.addEventListener('mousedown', function (e) {
        e.preventDefault();
        onApply("right");
    });

    actions.appendChild(btnZero);
    actions.appendChild(btnMinus);
    actions.appendChild(btnPlus);

    row.appendChild(leftGroup);
    row.appendChild(actions);
    Cheat_Menu.content.appendChild(row);
};

Cheat_Menu.append_setting_row = function (label, valueText, onLeft, onRight) {
    var row = document.createElement('div');
    row.className = "cheat_setting_row";

    var labelDiv = document.createElement('div');
    labelDiv.className = "cheat_label";
    labelDiv.innerHTML = label;

    var controls = document.createElement('div');
    controls.className = "cheat_controls";

    var btnLeft = document.createElement('button');
    btnLeft.className = "cheat_btn";
    btnLeft.innerHTML = "◄";
    if (onLeft) {
        btnLeft.addEventListener('mousedown', function (e) {
            e.preventDefault();
            onLeft();
        });
    } else {
        btnLeft.style.visibility = "hidden";
    }

    var valDiv = document.createElement('div');
    valDiv.className = "cheat_value";
    valDiv.innerHTML = valueText;

    var btnRight = document.createElement('button');
    btnRight.className = "cheat_btn";
    btnRight.innerHTML = "►";
    if (onRight) {
        btnRight.addEventListener('mousedown', function (e) {
            e.preventDefault();
            onRight();
        });
    } else {
        btnRight.style.visibility = "hidden";
    }

    controls.appendChild(btnLeft);
    controls.appendChild(valDiv);
    controls.appendChild(btnRight);

    row.appendChild(labelDiv);
    row.appendChild(controls);
    Cheat_Menu.content.appendChild(row);
};