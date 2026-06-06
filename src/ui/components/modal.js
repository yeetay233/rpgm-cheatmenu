// ============================================================
// Cheat Menu - Modal Component
// ============================================================

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
    input.addEventListener('keydown', function (e) {
        e.stopPropagation();
        if (e.keyCode === 13) {
            onSave(Number(input.value));
            bg.remove();
        } else if (e.keyCode === 27) {
            bg.remove();
        }
    });

    var btnRow = document.createElement('div');
    btnRow.className = "cheat_modal_buttons";

    var btnCancel = document.createElement('button');
    btnCancel.className = "cheat_btn";
    btnCancel.innerHTML = "Cancel";
    Cheat_Menu.addEvent(btnCancel, function () { bg.remove(); });

    var btnSave = document.createElement('button');
    btnSave.className = "cheat_btn";
    btnSave.innerHTML = "Save";
    Cheat_Menu.addEvent(btnSave, function () { onSave(Number(input.value)); bg.remove(); });

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
    input.select();
};

Cheat_Menu.open_text_modal = function (titleText, currentValue, onSave) {
    var bg = document.createElement('div');
    bg.className = "cheat_modal_bg";

    var modal = document.createElement('div');
    modal.className = "cheat_modal";

    var title = document.createElement('div');
    title.className = "cheat_modal_title";
    title.innerHTML = titleText;

    var input = document.createElement('input');
    input.className = "cheat_search_input";
    input.type = "text";
    input.value = currentValue;
    input.addEventListener('keydown', function (e) {
        e.stopPropagation();
        if (e.keyCode === 13) {
            onSave(input.value);
            bg.remove();
        } else if (e.keyCode === 27) {
            bg.remove();
        }
    });

    var btnRow = document.createElement('div');
    btnRow.className = "cheat_modal_buttons";

    var btnCancel = document.createElement('button');
    btnCancel.className = "cheat_btn";
    btnCancel.innerHTML = "Cancel";
    Cheat_Menu.addEvent(btnCancel, function () { bg.remove(); });

    var btnSave = document.createElement('button');
    btnSave.className = "cheat_btn";
    btnSave.innerHTML = "Save";
    Cheat_Menu.addEvent(btnSave, function () { onSave(input.value); bg.remove(); });

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
    input.select();
};

Cheat_Menu.open_confirm_modal = function (message, onConfirm) {
    var bg = document.createElement('div');
    bg.className = "cheat_modal_bg";

    var modal = document.createElement('div');
    modal.className = "cheat_modal";

    var msg = document.createElement('div');
    msg.className = "cheat_modal_title";
    msg.style.fontSize = "1em";
    msg.style.fontWeight = "normal";
    msg.style.color = "#ccc";
    msg.innerHTML = message;

    var btnRow = document.createElement('div');
    btnRow.className = "cheat_modal_buttons";

    var btnCancel = document.createElement('button');
    btnCancel.className = "cheat_btn";
    btnCancel.innerHTML = "Cancel";
    Cheat_Menu.addEvent(btnCancel, function () { bg.remove(); });

    var btnConfirm = document.createElement('button');
    btnConfirm.className = "cheat_btn";
    btnConfirm.innerHTML = "Confirm";
    btnConfirm.style.borderColor = "#44cc55";
    btnConfirm.style.color = "#44cc55";
    Cheat_Menu.addEvent(btnConfirm, function () { onConfirm(); bg.remove(); });

    btnRow.appendChild(btnCancel);
    btnRow.appendChild(btnConfirm);

    modal.appendChild(msg);
    modal.appendChild(btnRow);
    bg.appendChild(modal);

    bg.addEventListener('mousedown', function (e) {
        if (e.target === bg) bg.remove();
    });

    Cheat_Menu.overlay_box.appendChild(bg);
};
