// ============================================================
// Cheat Menu - Overlay UI Component
// ============================================================

Cheat_Menu.overlay_box = document.createElement('div');
Cheat_Menu.overlay_box.id = "cheat_menu";

Cheat_Menu.sidebar = document.createElement('div');
Cheat_Menu.sidebar.id = "cheat_menu_sidebar";

Cheat_Menu.content = document.createElement('div');
Cheat_Menu.content.id = "cheat_menu_content";

Cheat_Menu.overlay_box.appendChild(Cheat_Menu.sidebar);
Cheat_Menu.overlay_box.appendChild(Cheat_Menu.content);

// Backwards compatibility
Cheat_Menu.overlay = Cheat_Menu.content;

// Inject CSS
Cheat_Menu.style_css = document.createElement("link");
Cheat_Menu.style_css.type = "text/css";
Cheat_Menu.style_css.rel = "stylesheet";
Cheat_Menu.style_css.href = "js/plugins/Cheat_Menu.css";
document.head.appendChild(Cheat_Menu.style_css);

// Prevent clicks/wheel from passing through to game canvas
var stopProp = function (event) { event.stopPropagation(); };
Cheat_Menu.overlay_box.addEventListener("mousedown", stopProp);
Cheat_Menu.overlay_box.addEventListener("wheel", stopProp, { passive: true });
Cheat_Menu.overlay_box.addEventListener("touchstart", stopProp, { passive: true });
Cheat_Menu.overlay_box.addEventListener("touchmove", stopProp, { passive: true });

// Position menu based on current position setting
Cheat_Menu.position_menu = function () {
    Cheat_Menu.overlay_box.style.marginLeft = "0px";
    Cheat_Menu.overlay_box.style.marginTop = "0px";

    switch (Cheat_Menu.position) {
        case 0: // Center
            Cheat_Menu.overlay_box.style.left = "50%";
            Cheat_Menu.overlay_box.style.top = "50%";
            Cheat_Menu.overlay_box.style.right = "";
            Cheat_Menu.overlay_box.style.bottom = "";
            Cheat_Menu.overlay_box.style.transform = "translate(-50%, -50%)";
            break;
        case 1: // Top Left
            Cheat_Menu.overlay_box.style.left = "5px";
            Cheat_Menu.overlay_box.style.top = "5px";
            Cheat_Menu.overlay_box.style.right = "";
            Cheat_Menu.overlay_box.style.bottom = "";
            Cheat_Menu.overlay_box.style.transform = "none";
            break;
        case 2: // Top Right
            Cheat_Menu.overlay_box.style.left = "";
            Cheat_Menu.overlay_box.style.top = "5px";
            Cheat_Menu.overlay_box.style.right = "5px";
            Cheat_Menu.overlay_box.style.bottom = "";
            Cheat_Menu.overlay_box.style.transform = "none";
            break;
        case 3: // Bottom Right
            Cheat_Menu.overlay_box.style.left = "";
            Cheat_Menu.overlay_box.style.top = "";
            Cheat_Menu.overlay_box.style.right = "5px";
            Cheat_Menu.overlay_box.style.bottom = "5px";
            Cheat_Menu.overlay_box.style.transform = "none";
            break;
        case 4: // Bottom Left
            Cheat_Menu.overlay_box.style.left = "5px";
            Cheat_Menu.overlay_box.style.top = "";
            Cheat_Menu.overlay_box.style.right = "";
            Cheat_Menu.overlay_box.style.bottom = "5px";
            Cheat_Menu.overlay_box.style.transform = "none";
            break;
    }
};

Cheat_Menu.update_menu_size = function () {
    Cheat_Menu.overlay_box.style.width = Cheat_Menu.menu_scale + "vw";
    Cheat_Menu.overlay_box.style.height = Cheat_Menu.menu_scale + "vh";
};

Cheat_Menu.close_menu = function () {
    if (Cheat_Menu.overlay_box) {
        Cheat_Menu.overlay_box.style.display = "none";
        Cheat_Menu.overlay_box.remove();
    }
    Cheat_Menu.cheat_menu_open = false;
    Cheat_Menu.render_quick_hud();
    SoundManager.playSystemSound(2);
};

Cheat_Menu.open_menu = function () {
    document.body.appendChild(Cheat_Menu.overlay_box);
    Cheat_Menu.overlay_box.style.display = "flex";
    if (!Cheat_Menu.fontSize) Cheat_Menu.fontSize = 14;
    Cheat_Menu.overlay_box.style.fontSize = Cheat_Menu.fontSize + "px";
    Cheat_Menu.cheat_menu_open = true;
    SoundManager.playSystemSound(1);
    Cheat_Menu.update_menu();

    // Inject close button
    var cm = document.getElementById('cheat_menu');
    if (cm && !document.getElementById('cheat_menu_close')) {
        var closeBtn = document.createElement('button');
        closeBtn.id = "cheat_menu_close";
        closeBtn.innerHTML = "✖";
        closeBtn.addEventListener('mousedown', function (e) {
            e.preventDefault();
            e.stopPropagation();
            Cheat_Menu.close_menu();
        });
        cm.appendChild(closeBtn);
    }
};