// ============================================================
// Cheat Menu - Settings & Bottom Bar Builders
// ============================================================

// Compact amount display helper
Cheat_Menu.format_amount = function (n) {
    if (n >= 1000000) return (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "K";
    return "" + n;
};

Cheat_Menu.append_bottom_bar_controls = function (labelText, onZero, onApply) {
    var row = document.createElement('div');
    row.className = "cheat_modifier_row";

    // Left group: [Value: n] [+n] [-n] [RESET]
    var leftGroup = document.createElement('div');
    leftGroup.className = "modifier_group_left";

    var valLabel = document.createElement('span');
    valLabel.className = "cheat_modifier_value";
    valLabel.innerHTML = labelText;

    var amt = Cheat_Menu.amounts[Cheat_Menu.amount_index];
    var amtStr = Cheat_Menu.format_amount(amt);

    var btnPlus = document.createElement('button');
    btnPlus.className = "cheat_btn";
    btnPlus.innerHTML = "+" + amtStr;
    Cheat_Menu.addEvent(btnPlus, function (e) { e.preventDefault(); onApply("right"); });

    var btnMinus = document.createElement('button');
    btnMinus.className = "cheat_btn";
    btnMinus.innerHTML = "-" + amtStr;
    Cheat_Menu.addEvent(btnMinus, function (e) { e.preventDefault(); onApply("left"); });

    var btnReset = document.createElement('button');
    btnReset.className = "cheat_btn";
    btnReset.innerHTML = "RESET";
    Cheat_Menu.addEvent(btnReset, function (e) { e.preventDefault(); onZero(); });

    leftGroup.appendChild(valLabel);
    leftGroup.appendChild(btnPlus);
    leftGroup.appendChild(btnMinus);
    leftGroup.appendChild(btnReset);

    // Right group: [Step: n] [▲] [▼]
    var rightGroup = document.createElement('div');
    rightGroup.className = "modifier_group_right";

    var stepLabel = document.createElement('span');
    stepLabel.className = "cheat_modifier_step_label";
    stepLabel.innerHTML = "Step: " + Cheat_Menu.format_amount(amt);

    var btnStepUp = document.createElement('button');
    btnStepUp.className = "cheat_btn";
    btnStepUp.innerHTML = "▲";
    Cheat_Menu.addEvent(btnStepUp, function (e) { e.preventDefault(); Cheat_Menu.scroll_amount("right"); });

    var btnStepDown = document.createElement('button');
    btnStepDown.className = "cheat_btn";
    btnStepDown.innerHTML = "▼";
    Cheat_Menu.addEvent(btnStepDown, function (e) { e.preventDefault(); Cheat_Menu.scroll_amount("left"); });

    rightGroup.appendChild(stepLabel);
    rightGroup.appendChild(btnStepUp);
    rightGroup.appendChild(btnStepDown);

    row.appendChild(leftGroup);
    row.appendChild(rightGroup);
    Cheat_Menu.content.appendChild(row);
};

Cheat_Menu.append_setting_row = function (label, valueText, onLeft, onRight) {
    var row = document.createElement('div');
    row.className = "cheat_control_grid";

    var labelDiv = document.createElement('div');
    labelDiv.className = "cheat_control_label";
    labelDiv.innerHTML = label;

    var actions = document.createElement('div');
    actions.className = "cheat_control_actions";

    var btnRow = document.createElement('div');
    btnRow.className = "cheat_btn_row";

    var btnLeft = document.createElement('button');
    btnLeft.className = "cheat_btn";
    btnLeft.innerHTML = "◄";
    if (onLeft) {
        Cheat_Menu.addEvent(btnLeft, function (e) {
            e.preventDefault();
            onLeft();
        });
    } else {
        btnLeft.style.visibility = "hidden";
    }

    var valDiv = document.createElement('div');
    valDiv.className = "cheat_value";
    valDiv.innerHTML = valueText;
    valDiv.style.minWidth = "30px";

    var btnRight = document.createElement('button');
    btnRight.className = "cheat_btn";
    btnRight.innerHTML = "►";
    if (onRight) {
        Cheat_Menu.addEvent(btnRight, function (e) {
            e.preventDefault();
            onRight();
        });
    } else {
        btnRight.style.visibility = "hidden";
    }

    btnRow.appendChild(btnLeft);
    btnRow.appendChild(valDiv);
    btnRow.appendChild(btnRight);
    actions.appendChild(btnRow);

    row.appendChild(labelDiv);
    row.appendChild(actions);

    Cheat_Menu.content.appendChild(row);
};
