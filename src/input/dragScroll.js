// ============================================================
// Cheat Menu - Drag-to-Scroll (JoiPlay / Touch Compatible)
// ============================================================

Cheat_Menu.initDragScroll = function (el) {
    if (!el || el._dragScrollBound) return;
    el._dragScrollBound = true;

    var startY = 0;
    var startX = 0;
    var scrollTopStart = 0;
    var scrollLeftStart = 0;
    var isDragging = false;
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
        if (!hasMoved && Math.abs(dy) < Cheat_Menu.DRAG_THRESHOLD && Math.abs(dx) < Cheat_Menu.DRAG_THRESHOLD) return;
        hasMoved = true;
        el.scrollTop = scrollTopStart - dy;
        el.scrollLeft = scrollLeftStart - dx;
        e.stopPropagation();
    }

    function onEnd() {
        isDragging = false;
        hasMoved = false;
        el.style.cursor = '';
        el.style.userSelect = '';
    }

    el.addEventListener('mousedown', onStart, { passive: false });
    el.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('mousemove', onMove, { passive: false });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('mouseleave', onEnd);
    window.addEventListener('touchend', onEnd);
};

// Scroll arrows (for containers with overflow)
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