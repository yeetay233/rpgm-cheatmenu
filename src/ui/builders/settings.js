// ============================================================
// Cheat Menu - Settings & Bottom Bar Builders
// ============================================================

Cheat_Menu.append_bottom_bar_controls = function (labelText, onZero, onApply) {
    var row = document.createElement('div');
    row.className = "cheat_bottom_bar";

    var label = document.createElement('div');
    label.className = "cheat_label";
    label.style.flex = "0 0 auto";
    label.style.fontSize = "0.85em";
    label.innerHTML = labelText;

    var amtSelector = document.createElement('div');
    amtSelector.className = "cheat_controls";

    var btnL = document.createElement('button');
    btnL.className = "cheat_btn";
    btnL.innerHTML = "◄";
    Cheat_Menu.addEvent(btnL, function (e) {
        e.preventDefault();
        Cheat_Menu.scroll_amount("left");
    });

    var val = document.createElement('div');
    val.className = "cheat_value";
    val.style.minWidth = "30px";
    val.innerHTML = Cheat_Menu.amounts[Cheat_Menu.amount_index];

    var btnR = document.createElement('button');
    btnR.className = "cheat_btn";
    btnR.innerHTML = "►";
    Cheat_Menu.addEvent(btnR, function (e) {
        e.preventDefault();
        Cheat_Menu.scroll_amount("right");
    });

    var btnCustom = document.createElement('button');
    btnCustom.className = "cheat_btn";
    btnCustom.innerHTML = "…";
    btnCustom.title = "Custom amount";
    Cheat_Menu.addEvent(btnCustom, function (e) {
        e.preventDefault();
        var customVal = Cheat_Menu.amounts[Cheat_Menu.amount_index];
        Cheat_Menu.open_value_modal("Custom Amount", customVal, function (newVal) {
            if (!isNaN(newVal) && newVal >= 0) {
                for (var i = 0; i < Cheat_Menu.amounts.length; i++) {
                    if (Cheat_Menu.amounts[i] >= newVal) {
                        Cheat_Menu.amount_index = i;
                        break;
                    }
                    Cheat_Menu.amount_index = Cheat_Menu.amounts.length - 1;
                }
                Cheat_Menu.update_menu();
            }
        });
    });

    amtSelector.appendChild(btnL);
    amtSelector.appendChild(val);
    amtSelector.appendChild(btnR);
    amtSelector.appendChild(btnCustom);

    var actions = document.createElement('div');
    actions.className = "cheat_controls";

    var btnZero = document.createElement('button');
    btnZero.className = "cheat_btn";
    btnZero.innerHTML = "0";
    btnZero.style.minWidth = "30px";
    Cheat_Menu.addEvent(btnZero, function (e) {
        e.preventDefault();
        onZero();
    });

    var btnMinus = document.createElement('button');
    btnMinus.className = "cheat_btn";
    btnMinus.innerHTML = "-" + Cheat_Menu.amounts[Cheat_Menu.amount_index];
    btnMinus.style.minWidth = "40px";
    Cheat_Menu.addEvent(btnMinus, function (e) {
        e.preventDefault();
        onApply("left");
    });

    var btnPlus = document.createElement('button');
    btnPlus.className = "cheat_btn";
    btnPlus.innerHTML = "+" + Cheat_Menu.amounts[Cheat_Menu.amount_index];
    btnPlus.style.minWidth = "40px";
    Cheat_Menu.addEvent(btnPlus, function (e) {
        e.preventDefault();
        onApply("right");
    });

    actions.appendChild(btnZero);
    actions.appendChild(btnMinus);
    actions.appendChild(btnPlus);

    row.appendChild(label);
    amtSelector.style.marginRight = "10px";
    row.appendChild(amtSelector);
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

    controls.appendChild(btnLeft);
    controls.appendChild(valDiv);
    controls.appendChild(btnRight);

    row.appendChild(labelDiv);
    row.appendChild(controls);
    Cheat_Menu.content.appendChild(row);
};
