// ============================================================
// Cheat Menu - Hover Toggle Button Component
// ============================================================

Cheat_Menu.render_hover_button = function () {
    if (!Cheat_Menu.hover_btn) {
        Cheat_Menu.hover_btn = document.createElement('div');
        Cheat_Menu.hover_btn.id = "cheat_hover_btn";
        Cheat_Menu.hover_btn.innerHTML = "★";

        Cheat_Menu.addEvent(Cheat_Menu.hover_btn, function (e) {
            if (Cheat_Menu.cheat_menu_open) {
                Cheat_Menu.close_menu();
            } else {
                Cheat_Menu.open_menu();
                Cheat_Menu.render_quick_hud();
            }
        });

        Cheat_Menu.hover_btn.addEventListener('touchstart', function (e) {
            e.stopPropagation();
        }, { passive: true });
        Cheat_Menu.hover_btn.addEventListener('mousedown', function (e) {
            e.stopPropagation();
        });
        Cheat_Menu.hover_btn.addEventListener('click', function (e) {
            e.stopPropagation();
        });

        document.body.appendChild(Cheat_Menu.hover_btn);
    }

    if (!Cheat_Menu.btn_config.enabled) {
        Cheat_Menu.hover_btn.style.display = "none";
        return;
    }

    Cheat_Menu.hover_btn.style.display = "flex";
    Cheat_Menu.hover_btn.style.opacity = Cheat_Menu.btn_config.opacity / 100;
    Cheat_Menu.hover_btn.style.width = Cheat_Menu.btn_config.size + "px";
    Cheat_Menu.hover_btn.style.height = Cheat_Menu.btn_config.size + "px";
    Cheat_Menu.hover_btn.style.fontSize = (Cheat_Menu.btn_config.size * 0.5) + "px";
    Cheat_Menu.hover_btn.style.touchAction = "none";

    Cheat_Menu.hover_btn.style.left = "";
    Cheat_Menu.hover_btn.style.right = "";
    Cheat_Menu.hover_btn.style.top = "";
    Cheat_Menu.hover_btn.style.bottom = "";
    Cheat_Menu.hover_btn.style.transform = "";

    switch (Cheat_Menu.btn_config.posIndex) {
        case 0:
            Cheat_Menu.hover_btn.style.bottom = "15px";
            Cheat_Menu.hover_btn.style.left = "50%";
            Cheat_Menu.hover_btn.style.transform = "translateX(-50%)";
            break;
        case 1:
            Cheat_Menu.hover_btn.style.bottom = "15px";
            Cheat_Menu.hover_btn.style.right = "15px";
            break;
        case 2:
            Cheat_Menu.hover_btn.style.bottom = "15px";
            Cheat_Menu.hover_btn.style.left = "15px";
            break;
        case 3:
            Cheat_Menu.hover_btn.style.top = "15px";
            Cheat_Menu.hover_btn.style.right = "15px";
            break;
        case 4:
            Cheat_Menu.hover_btn.style.top = "15px";
            Cheat_Menu.hover_btn.style.left = "15px";
            break;
    }
};
