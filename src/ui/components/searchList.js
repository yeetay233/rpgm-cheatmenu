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

    var renderList = function (filterText) {
        listDiv.innerHTML = "";
        filterText = filterText.toLowerCase();

        for (var i = 1; i < dataArray.length; i++) {
            if (!dataArray[i]) continue;

            var name = getNameFunc ? getNameFunc(dataArray[i], i) : (dataArray[i].name || dataArray[i]);
            if (typeof name !== "string") name = String(name);

            if (name && name.toLowerCase().indexOf(filterText) !== -1) {
                var li = document.createElement('li');
                li.className = "cheat_list_item";
                if (i === selectedIdx) li.className += " selected";

                var labelSpan = document.createElement('span');
                labelSpan.className = "cheat_list_item_label";
                labelSpan.innerHTML = i + ": " + name;
                li.appendChild(labelSpan);

                if (getValueFunc) {
                    var valDiv = document.createElement('div');
                    valDiv.className = "cheat_list_item_val";
                    valDiv.innerHTML = getValueFunc(i);
                    li.appendChild(valDiv);
                }

                li.addEventListener('mousedown', (function (idx) {
                    return function (e) {
                        e.preventDefault();
                        onSelectCallback(idx);
                    };
                })(i));
                listDiv.appendChild(li);
            }
        }
    };

    searchInput.addEventListener('input', function (e) {
        Cheat_Menu.list_state.search = e.target.value;
        Cheat_Menu.list_state.scroll = 0;
        renderList(e.target.value);
    });

    searchInput.addEventListener('keydown', function (e) { e.stopPropagation(); });

    listDiv.onscroll = function () {
        Cheat_Menu.list_state.scroll = listDiv.scrollTop;
    };

    renderList(Cheat_Menu.list_state.search);

    container.appendChild(searchInput);
    container.appendChild(listDiv);
    Cheat_Menu.content.appendChild(container);

    requestAnimationFrame(function () {
        listDiv.scrollTop = Cheat_Menu.list_state.scroll;
    });
};