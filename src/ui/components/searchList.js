// ============================================================
// Cheat Menu - Searchable List Component
// ============================================================

var PIN_EMPTY = '<svg class="cpin" viewBox="0 0 16 16" width="11" height="11"><path d="M3 1 L13 1 L13 15 L8 11 L3 15 Z" fill="none" stroke="#888" stroke-width="1.5" stroke-linejoin="round"/></svg>';
var PIN_FILLED = '<svg class="cpin cpinned" viewBox="0 0 16 16" width="11" height="11"><path d="M3 1 L13 1 L13 15 L8 11 L3 15 Z" fill="#44cc55" stroke="none" stroke-linejoin="round"/></svg>';

var VIRTUAL_ITEM_HEIGHT = 28;
var VIRTUAL_BUFFER = 40;
var VIRTUAL_THRESHOLD = 80;

Cheat_Menu.append_searchable_list = function (dataArray, selectedIdx, onSelectCallback, getNameFunc, isGrid, getValueFunc, verticalLayout, extraClass, listType) {
    var container = document.createElement('div');
    container.className = "cheat_search_container";

    var searchInput = document.createElement('input');
    searchInput.className = "cheat_search_input";
    searchInput.type = "text";
    searchInput.placeholder = "Search...";
    searchInput.value = Cheat_Menu.list_state.search;

    var listDiv = document.createElement('ul');
    var listClass = "cheat_list";
    if (isGrid) listClass += " grid";
    if (verticalLayout) listClass += " vertical";
    if (extraClass) listClass += " " + extraClass;
    listDiv.className = listClass;
    listDiv.tabIndex = -1;

    var focusedIndex = 0;
    var _rendering = false;
    var _debounceTimer = null;

    var getPinnedKey = function () {
        if (listType === 'items') return 'pinned_items';
        if (listType === 'weapons') return 'pinned_weapons';
        if (listType === 'armors') return 'pinned_armors';
        if (listType === 'variables') return 'pinned_variables';
        if (listType === 'switches') return 'pinned_switches';
        if (listType === 'teleport') return 'pinned_teleport_maps';
        return null;
    };

    function buildItemElement(item, virtualIndex) {
        var li = document.createElement('li');
        li.className = "cheat_list_item";
        if (item.idx === selectedIdx) {
            li.className += " selected";
            focusedIndex = virtualIndex;
        }
        li.dataset.listIndex = virtualIndex;

        var pinnedKey = getPinnedKey();
        if (pinnedKey) {
            var pinBtn = document.createElement('span');
            pinBtn.className = "cheat_pin_btn";
            var isPinned = Cheat_Menu[pinnedKey].indexOf(item.idx) !== -1;
            pinBtn.innerHTML = isPinned ? PIN_FILLED : PIN_EMPTY;
            (function (idx, btn) {
                pinBtn.addEventListener('mousedown', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var arr = Cheat_Menu[pinnedKey];
                    var pos = arr.indexOf(idx);
                    if (pos === -1) {
                        arr.push(idx);
                        btn.innerHTML = PIN_FILLED;
                    } else {
                        arr.splice(pos, 1);
                        btn.innerHTML = PIN_EMPTY;
                    }
                    Cheat_Menu.save_values();
                });
                pinBtn.addEventListener('touchstart', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var arr = Cheat_Menu[pinnedKey];
                    var pos = arr.indexOf(idx);
                    if (pos === -1) {
                        arr.push(idx);
                        btn.innerHTML = PIN_FILLED;
                    } else {
                        arr.splice(pos, 1);
                        btn.innerHTML = PIN_EMPTY;
                    }
                    Cheat_Menu.save_values();
                }, { passive: false });
            })(item.idx, pinBtn);
            li.appendChild(pinBtn);
        }

        var labelSpan = document.createElement('span');
        labelSpan.className = "cheat_list_item_label";
        labelSpan.innerHTML = item.idx + ": " + item.name;
        li.appendChild(labelSpan);

        if (getValueFunc) {
            var valDiv = document.createElement('div');
            valDiv.className = "cheat_list_item_val";
            valDiv.innerHTML = getValueFunc(item.idx);
            li.appendChild(valDiv);
        }

        (function (idx) {
            Cheat_Menu.addEvent(li, function (e) {
                e.preventDefault();
                onSelectCallback(idx);
            });
        })(item.idx);
        return li;
    }

    function buildSpacer(height) {
        var s = document.createElement('li');
        s.style.height = height + "px";
        s.style.listStyle = "none";
        s.style.pointerEvents = "none";
        return s;
    }

    var renderList = function (filterText) {
        if (_rendering) return;
        _rendering = true;
        listDiv.innerHTML = "";
        filterText = filterText.toLowerCase();

        var visibleItems = [];
        for (var i = 1; i < dataArray.length; i++) {
            if (!dataArray[i]) continue;
            var name = getNameFunc ? getNameFunc(dataArray[i], i) : (dataArray[i].name || dataArray[i]);
            if (typeof name !== "string") name = String(name);
            if (name && name.toLowerCase().indexOf(filterText) !== -1) {
                visibleItems.push({ idx: i, name: name });
            }
        }

        var pinnedKey = getPinnedKey();
        if (pinnedKey && Cheat_Menu[pinnedKey] && Cheat_Menu[pinnedKey].length > 0) {
            var pinnedSet = {};
            for (var p = 0; p < Cheat_Menu[pinnedKey].length; p++) {
                pinnedSet[Cheat_Menu[pinnedKey][p]] = true;
            }
            var pinned = [];
            var unpinned = [];
            for (var v = 0; v < visibleItems.length; v++) {
                if (pinnedSet[visibleItems[v].idx]) {
                    pinned.push(visibleItems[v]);
                } else {
                    unpinned.push(visibleItems[v]);
                }
            }
            visibleItems = pinned.concat(unpinned);
        }

        if (visibleItems.length === 0) {
            var emptyLi = document.createElement('li');
            emptyLi.className = "cheat_list_item";
            emptyLi.style.justifyContent = "center";
            emptyLi.style.color = "#666";
            emptyLi.style.cursor = "default";
            emptyLi.innerHTML = "No results";
            listDiv.appendChild(emptyLi);
            _rendering = false;
            return;
        }

        searchInput.placeholder = "Search (" + visibleItems.length + " results)...";
        focusedIndex = -1;

        var itemHeight = isGrid ? 26 : VIRTUAL_ITEM_HEIGHT;

        if (visibleItems.length > VIRTUAL_THRESHOLD) {
            var scrollTop = listDiv.scrollTop || 0;
            var viewH = listDiv.clientHeight || 400;
            var visCount = Math.ceil(viewH / itemHeight);
            var start = Math.max(0, Math.floor(scrollTop / itemHeight) - VIRTUAL_BUFFER);
            var end = Math.min(visibleItems.length, Math.ceil((scrollTop + viewH) / itemHeight) + VIRTUAL_BUFFER);

            if (start > 0) {
                listDiv.appendChild(buildSpacer(start * itemHeight));
            }
            for (var vi = start; vi < end; vi++) {
                var li = buildItemElement(visibleItems[vi], vi);
                listDiv.appendChild(li);
            }
            if (end < visibleItems.length) {
                listDiv.appendChild(buildSpacer((visibleItems.length - end) * itemHeight));
            }
        } else {
            for (var vj = 0; vj < visibleItems.length; vj++) {
                var li2 = buildItemElement(visibleItems[vj], vj);
                listDiv.appendChild(li2);
            }
        }

        _rendering = false;
    };

    var scheduleRender = function (filterText) {
        if (_debounceTimer) clearTimeout(_debounceTimer);
        _debounceTimer = setTimeout(function () {
            _debounceTimer = null;
            renderList(filterText);
        }, 16);
    };

    searchInput.addEventListener('input', function (e) {
        Cheat_Menu.list_state.search = e.target.value;
        Cheat_Menu.list_state.scroll = 0;
        renderList(e.target.value);
    });

    searchInput.addEventListener('keydown', function (e) {
        e.stopPropagation();
        if (e.keyCode === 40) {
            e.preventDefault();
            var items = listDiv.querySelectorAll('.cheat_list_item');
            if (items.length === 0) return;
            focusedIndex = Math.min(focusedIndex + 1, items.length - 1);
            items[focusedIndex].scrollIntoView({ block: 'nearest' });
        } else if (e.keyCode === 38) {
            e.preventDefault();
            var items = listDiv.querySelectorAll('.cheat_list_item');
            if (items.length === 0) return;
            focusedIndex = Math.max(focusedIndex - 1, 0);
            items[focusedIndex].scrollIntoView({ block: 'nearest' });
        } else if (e.keyCode === 13) {
            e.preventDefault();
            var items = listDiv.querySelectorAll('.cheat_list_item');
            if (items.length > focusedIndex) {
                items[focusedIndex].click();
            }
        }
    });

    listDiv.onscroll = function () {
        Cheat_Menu.list_state.scroll = listDiv.scrollTop;
        scheduleRender(Cheat_Menu.list_state.search);
    };

    container.appendChild(searchInput);
    container.appendChild(listDiv);
    Cheat_Menu.content.appendChild(container);

    renderList(Cheat_Menu.list_state.search);
};
