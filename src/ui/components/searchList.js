// ============================================================
// Cheat Menu - Searchable List Component
// ============================================================

Cheat_Menu.append_searchable_list = function (dataArray, selectedIdx, onSelectCallback, getNameFunc, isGrid, getValueFunc, verticalLayout, extraClass) {
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

    var renderList = function (filterText) {
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

        if (visibleItems.length === 0) {
            var emptyLi = document.createElement('li');
            emptyLi.className = "cheat_list_item";
            emptyLi.style.justifyContent = "center";
            emptyLi.style.color = "#666";
            emptyLi.style.cursor = "default";
            emptyLi.innerHTML = "No results";
            listDiv.appendChild(emptyLi);
            return;
        }

        searchInput.placeholder = "Search (" + visibleItems.length + " results)...";

        for (var v = 0; v < visibleItems.length; v++) {
            var item = visibleItems[v];
            var li = document.createElement('li');
            li.className = "cheat_list_item";
            if (item.idx === selectedIdx) {
                li.className += " selected";
                focusedIndex = v;
            }
            li.dataset.listIndex = v;

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
            listDiv.appendChild(li);
        }
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
    };

    renderList(Cheat_Menu.list_state.search);

    container.appendChild(searchInput);
    container.appendChild(listDiv);
    Cheat_Menu.content.appendChild(container);
};
