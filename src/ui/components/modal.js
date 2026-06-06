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

    var cancelFn1 = function () { bg.remove(); };
    var saveFn1 = function () { onSave(Number(input.value)); bg.remove(); };
    var btnCancel = document.createElement('button');
    btnCancel.className = "cheat_btn";
    btnCancel.innerHTML = "Cancel";
    btnCancel.addEventListener('mousedown', cancelFn1);
    btnCancel.addEventListener('touchstart', cancelFn1, { passive: false });

    var btnSave = document.createElement('button');
    btnSave.className = "cheat_btn";
    btnSave.innerHTML = "Save";
    btnSave.addEventListener('mousedown', saveFn1);
    btnSave.addEventListener('touchstart', saveFn1, { passive: false });

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

    var cancelFn2 = function () { bg.remove(); };
    var saveFn2 = function () { onSave(input.value); bg.remove(); };
    var btnCancel = document.createElement('button');
    btnCancel.className = "cheat_btn";
    btnCancel.innerHTML = "Cancel";
    btnCancel.addEventListener('mousedown', cancelFn2);
    btnCancel.addEventListener('touchstart', cancelFn2, { passive: false });

    var btnSave = document.createElement('button');
    btnSave.className = "cheat_btn";
    btnSave.innerHTML = "Save";
    btnSave.addEventListener('mousedown', saveFn2);
    btnSave.addEventListener('touchstart', saveFn2, { passive: false });

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

    var cancelFn3 = function () { bg.remove(); };
    var confirmFn = function () { onConfirm(); bg.remove(); };
    var btnCancel = document.createElement('button');
    btnCancel.className = "cheat_btn";
    btnCancel.innerHTML = "Cancel";
    btnCancel.addEventListener('mousedown', cancelFn3);
    btnCancel.addEventListener('touchstart', cancelFn3, { passive: false });

    var btnConfirm = document.createElement('button');
    btnConfirm.className = "cheat_btn";
    btnConfirm.innerHTML = "Confirm";
    btnConfirm.style.borderColor = "#44cc55";
    btnConfirm.style.color = "#44cc55";
    btnConfirm.addEventListener('mousedown', confirmFn);
    btnConfirm.addEventListener('touchstart', confirmFn, { passive: false });

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