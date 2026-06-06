// ============================================================
// Cheat Menu - Scroll Up/Down Buttons
//
// Sidebar / lists : scroll-column on the right side
// Content         : sticky in-flow ▲/▼ (takes 24px at edges)
// Only appear when there's content to scroll to.
// ============================================================

function _scbStep() { return Cheat_Menu.scroll_button_step || 120; }

function _scbToggle(upBtn, downBtn, target) {
    var sh = target.scrollHeight;
    var ch = target.clientHeight;
    var atTop = target.scrollTop <= 8;
    var atBottom = (target.scrollTop + ch >= sh - 8);
    upBtn.style.opacity = atTop ? '0' : '1';
    upBtn.style.pointerEvents = atTop ? 'none' : '';
    downBtn.style.opacity = atBottom ? '0' : '1';
    downBtn.style.pointerEvents = atBottom ? 'none' : '';
}

function _scbMakeColBtn(dir, target) {
    var b = document.createElement('button');
    b.className = 'cheat_scroll_col_btn scb_' + dir;
    b.setAttribute('aria-label', dir === 'up' ? 'Scroll up' : 'Scroll down');
    b.innerHTML = dir === 'up' ? '▲' : '▼';
    function handler(e) {
        e.stopPropagation();
        e.preventDefault();
        var step = _scbStep();
        if (dir === 'up') {
            target.scrollTop = Math.max(0, target.scrollTop - step);
        } else {
            target.scrollTop = Math.min(Math.max(0, target.scrollHeight - target.clientHeight), target.scrollTop + step);
        }
    }
    b.addEventListener('mousedown', handler);
    b.addEventListener('touchstart', handler, { passive: false });
    return b;
}

// Column registry — for resize refresh
var _scbCols = [];

function _scbRefresh() {
    for (var i = _scbCols.length - 1; i >= 0; i--) {
        var c = _scbCols[i];
        if (c.col !== undefined && (!c.col || !c.col.parentNode)) {
            _scbCols.splice(i, 1);
            continue;
        }
        _scbToggle(c.up, c.down, c.target);
    }
}

var _scbResizeTimer;
window.addEventListener('resize', function () {
    clearTimeout(_scbResizeTimer);
    _scbResizeTimer = setTimeout(_scbRefresh, 100);
});

// ============================================================
// Sidebar — column scroll on the right
// ============================================================

Cheat_Menu.add_sidebar_scroll_buttons = function (container) {
    if (!container) return;
    if (container._sbScrollAdded) {
        if (container.querySelector('.cheat_scroll_column')) return;
        container._sbScrollAdded = false;
    }
    container._sbScrollAdded = true;

    var contentDiv = document.createElement('div');
    contentDiv.className = 'cheat_sb_content';
    while (container.firstChild) {
        contentDiv.appendChild(container.firstChild);
    }

    var col = document.createElement('div');
    col.className = 'cheat_scroll_column';

    var upBtn = _scbMakeColBtn('up', contentDiv);
    var downBtn = _scbMakeColBtn('down', contentDiv);
    col.appendChild(upBtn);
    col.appendChild(downBtn);

    container.classList.add('cheat_sb_row');
    container.appendChild(contentDiv);
    container.appendChild(col);

    _scbCols.push({ col: col, up: upBtn, down: downBtn, target: contentDiv });

    function toggle() { _scbToggle(upBtn, downBtn, contentDiv); }
    contentDiv.addEventListener('scroll', toggle, { passive: true });
    requestAnimationFrame(toggle);
};

// ============================================================
// Lists — column scroll on the right
// ============================================================

Cheat_Menu.add_list_scroll_buttons = function (list) {
    if (!list) return;
    if (list._listScbAdded) {
        if (list.parentNode && list.parentNode.classList.contains('cheat_list_wrapper')) return;
        list._listScbAdded = false;
    }
    list._listScbAdded = true;

    var wrapper = document.createElement('div');
    wrapper.className = 'cheat_list_wrapper';

    var col = document.createElement('div');
    col.className = 'cheat_scroll_column';

    var upBtn = _scbMakeColBtn('up', list);
    var downBtn = _scbMakeColBtn('down', list);
    col.appendChild(upBtn);
    col.appendChild(downBtn);

    list.parentNode.insertBefore(wrapper, list);
    wrapper.appendChild(list);
    wrapper.appendChild(col);

    _scbCols.push({ col: col, up: upBtn, down: downBtn, target: list });

    function toggle() { _scbToggle(upBtn, downBtn, list); }
    list.addEventListener('scroll', toggle, { passive: true });
    requestAnimationFrame(toggle);
};

// ============================================================
// Content — sticky in-flow buttons
// ============================================================

Cheat_Menu.add_scroll_buttons = function (container) {
    if (!container) return;
    if (container._scbAdded) {
        if (container.firstChild && container.firstChild.classList.contains('cheat_scroll_btn')) return;
        container._scbAdded = false;
    }
    container._scbAdded = true;

    var upBtn = document.createElement('button');
    upBtn.className = 'cheat_scroll_btn scb_up';
    upBtn.setAttribute('aria-label', 'Scroll up');
    upBtn.innerHTML = '▲';

    var downBtn = document.createElement('button');
    downBtn.className = 'cheat_scroll_btn scb_down';
    downBtn.setAttribute('aria-label', 'Scroll down');
    downBtn.innerHTML = '▼';

    upBtn.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        e.preventDefault();
        container.scrollTop = Math.max(0, container.scrollTop - _scbStep());
    });
    upBtn.addEventListener('touchstart', function (e) {
        e.stopPropagation();
        e.preventDefault();
        container.scrollTop = Math.max(0, container.scrollTop - _scbStep());
    }, { passive: false });
    downBtn.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var maxScroll = Math.max(0, container.scrollHeight - container.clientHeight);
        container.scrollTop = Math.min(maxScroll, container.scrollTop + _scbStep());
    });
    downBtn.addEventListener('touchstart', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var maxScroll = Math.max(0, container.scrollHeight - container.clientHeight);
        container.scrollTop = Math.min(maxScroll, container.scrollTop + _scbStep());
    }, { passive: false });

    container.insertBefore(upBtn, container.firstChild);
    container.appendChild(downBtn);

    function toggle() { _scbToggle(upBtn, downBtn, container); }
    container.addEventListener('scroll', toggle, { passive: true });
    requestAnimationFrame(toggle);

    _scbCols.push({ col: undefined, up: upBtn, down: downBtn, target: container });
};

// Public refresh — re-evaluate all scroll button visibility
Cheat_Menu.refresh_scroll_buttons = _scbRefresh;
