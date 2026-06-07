// ============================================================
// Cheat Menu - Savestate (disk-backed via hidden slot 99)
// ============================================================

(function () {
    // Suppress event-starting on the first frame after a savestate load so the
    // restored state isn't corrupted by autorun/parallel events that already ran
    // before the capture.  We patch setupStartingMapEvent (instead of
    // setupStartingEvent) because MV's Scene_Map.start() calls
    // setupStartingMapEvent directly, bypassing the wrapper.
    var _setupStartingMapEvent = Game_Map.prototype.setupStartingMapEvent;
    Game_Map.prototype.setupStartingMapEvent = function () {
        if (this._savestateSuppress) {
            this._savestateSuppress = false;
            return false;
        }
        return _setupStartingMapEvent.call(this);
    };

    // Detect engine: MZ uses async StorageManager with string saveNames,
    // MV uses sync StorageManager with numeric savefileIds.
    var _isMZ = typeof StorageManager._forageKeys !== "undefined";

    Cheat_Menu.capture_savestate = function () {
        if (!DataManager || !DataManager.makeSaveContents) return null;
        var scene = SceneManager._scene;
        if (!(scene instanceof Scene_Map)) return null;
        try {
            var contents = DataManager.makeSaveContents();
            // MZ's makeSaveContents excludes $gameTemp, $gameMessage,
            // $gameTroop; MV includes message/troop but not temp.  We stash
            // all three so _finishLoad can restore them on either engine.
            contents.temp = $gameTemp;
            contents.message = $gameMessage;
            contents.troop = $gameTroop;
            // Save menu tab state so load restores the correct umbrella tab
            if (typeof Cheat_Menu !== "undefined") {
                contents._cheatMenuTab = {
                    cheat_selected: Cheat_Menu.cheat_selected,
                    sub_tab_per_group: JSON.parse(JSON.stringify(Cheat_Menu.sub_tab_per_group)),
                    list_state: JSON.parse(JSON.stringify(Cheat_Menu.list_state)),
                    speed_unlocked: Cheat_Menu.speed_unlocked
                };
                // Save the currently playing BGM so we can replay it on load
                if (typeof AudioManager !== "undefined" && AudioManager.saveBgm) {
                    contents._cheatMenuBgm = AudioManager.saveBgm();
                }
            }
            return JsonEx.parse(JsonEx.stringify(contents));
        } catch (e) {
            return null;
        }
    };

    // Persist all savestates to localStorage so they survive page reload / game restart.
    // Persist all savestates to localStorage so they survive page reload / game restart.
    Cheat_Menu.persist_savestates = function () {
        try {
            var data = {
                _version: 2,
                savestates: Cheat_Menu.savestates,
                quick_savestate: Cheat_Menu.quick_savestate
            };
            var json = JsonEx.stringify(data);
            localStorage.setItem('Cheat_Menu_savestates', json);
        } catch (e) {
            // If we can't serialize (e.g. JsonEx not ready or data too large),
            // remove stale data so we don't load corrupted state next session.
            try { localStorage.removeItem('Cheat_Menu_savestates'); } catch (e2) {}
        }
    };

    // Restore savestates from localStorage (called during init).
    Cheat_Menu.restore_savestates = function () {
        try {
            var raw = localStorage.getItem('Cheat_Menu_savestates');
            if (!raw) return;
            var data = JsonEx.parse(raw);
            // Version check — discard data from old serialization format (pre-JsonEx)
            if (data._version !== 2) {
                localStorage.removeItem('Cheat_Menu_savestates');
                return;
            }
            if (data.savestates && data.savestates.length === 10) {
                // Validate that each non-null slot has engine-critical properties
                var valid = true;
                for (var i = 0; i < data.savestates.length; i++) {
                    var s = data.savestates[i];
                    if (s && (!s.map || !s.player || !s.system)) {
                        valid = false;
                        break;
                    }
                }
                if (valid) {
                    Cheat_Menu.savestates = data.savestates;
                }
            }
            if (data.quick_savestate !== undefined) {
                var q = data.quick_savestate;
                if (q && (!q.map || !q.player || !q.system)) {
                    Cheat_Menu.quick_savestate = null;
                } else {
                    Cheat_Menu.quick_savestate = q;
                }
            }
        } catch (e) {
            // Corrupt or unavailable data — keep defaults
            try { localStorage.removeItem('Cheat_Menu_savestates'); } catch (e2) {}
        }
    };

    // Write the savestate to hidden slot 99, then run the full engine save-load
    // pipeline (DataManager.loadGame) so all plugin onLoad hooks fire.
    Cheat_Menu.load_savestate = function (savestate) {
        if (!savestate) return;
        if (!savestate.map || !savestate.player || !savestate.system) return;
        if (!(SceneManager._scene instanceof Scene_Map)) {
            SoundManager.playSystemSound(2);
            return;
        }
        try {
            // Close the menu silently
            if (Cheat_Menu.overlay_box) {
                Cheat_Menu.overlay_box.style.display = "none";
                Cheat_Menu.overlay_box.remove();
            }
            Cheat_Menu.cheat_menu_open = false;

            if (_isMZ) {
                Cheat_Menu._mzSaveLoad(savestate);
            } else {
                Cheat_Menu._mvSaveLoad(savestate);
            }
        } catch (e) {
            if (typeof console !== "undefined" && console.error) {
                console.error("Cheat_Menu load_savestate error:", e);
            }
            SoundManager.playSystemSound(2);
        }
    };

    // --- MZ path (async) ---
    // StorageManager.saveObject(saveName, object) returns a Promise.
    // DataManager.loadGame(savefileId) returns a Promise.
    Cheat_Menu._mzSaveLoad = function (savestate) {
        var saveName = DataManager.makeSavename(99);
        StorageManager.saveObject(saveName, savestate)
            .then(function () {
                return DataManager.loadGame(99);
            })
            .then(function () {
                Cheat_Menu._finishLoad(savestate);
            })
            .catch(function (e) {
                if (typeof console !== "undefined" && console.error) {
                    console.error("Cheat_Menu MZ savestate error:", e);
                }
                SoundManager.playSystemSound(2);
            });
    };

    // --- MV path (synchronous) ---
    // The engine's loadGameWithoutRescue calls loadGlobalInfo() which loads
    // from StorageManager.load(0), then checks isThisGameFile(savefileId)
    // which requires globalInfo[savefileId] to exist.  We must write an
    // entry to the globalInfo store (slot 0) before calling loadGame.
    Cheat_Menu._mvSaveLoad = function (savestate) {
        try {
            var json = JsonEx.stringify(savestate);

            // 1. Write the savestate data to hidden slot 99.
            StorageManager.save(99, json);

            // 2. Register slot 99 in globalInfo so isThisGameFile accepts it.
            var globalInfo = DataManager.loadGlobalInfo() || [];
            globalInfo[99] = {
                globalId: DataManager._globalId,
                title: $dataSystem ? $dataSystem.gameTitle : "",
                characters: [],
                faces: [],
                playtime: "",
                timestamp: Date.now()
            };
            DataManager.saveGlobalInfo(globalInfo);

            // 3. Run the engine's sync load pipeline.
            DataManager.loadGame(99);
            Cheat_Menu._finishLoad(savestate);
        } catch (e) {
            if (typeof console !== "undefined" && console.error) {
                console.error("Cheat_Menu MV savestate error:", e);
            }
            SoundManager.playSystemSound(2);
        }
    };

    // Post-load restoration: extras that extractSaveContents doesn't cover,
    // mid-dialogue interpreter fix, autorun suppression, scene transition.
    Cheat_Menu._finishLoad = function (savestate) {
        try {
            // Restore objects that the engine's extractSaveContents skips.
            // MV: makeSaveContents includes message+troop but not temp.
            // MZ: makeSaveContents excludes all three but extractSaveContents in MZ
            //     restores message+temp internally.  Overriding $gameTemp in MZ can
            //     corrupt engine state the native menu depends on (e.g., _menuParentCommand).
            if (_isMZ) {
                // MZ — engine already restored $gameMessage/$gameTroop via its own
                // extractSaveContents.  Only restore $gameTemp on MV where it's missing.
                $gameMessage = savestate.message || new Game_Message();
                $gameTroop = savestate.troop || new Game_Troop();
            } else {
                $gameTemp = savestate.temp || new Game_Temp();
                $gameMessage = savestate.message || new Game_Message();
                $gameTroop = savestate.troop || new Game_Troop();
            }

            // --- Ensure $dataMap matches the restored map ---
            // After loadGame(99), $dataMap still points to the previous map's
            // data, so Game_Event.list() crashes on
            // $dataMap.events[savedEventId].pages.  Load the correct map data
            // synchronously before Scene_Map starts running events.
            var _mapId = $gameMap.mapId();
            if (_mapId > 0 && (!$dataMap || $dataMap.id !== _mapId)) {
                try {
                    var _fn = 'Map%1.json'.format(_mapId.padZero(3));
                    var _xhr = new XMLHttpRequest();
                    _xhr.open('GET', (DataManager._dataMapPath || 'data/') + _fn, false);
                    _xhr.overrideMimeType('text/plain');
                    _xhr.send(null);
                    if (_xhr.status === 200 || _xhr.status === 0) {
                        $dataMap = JsonEx.parse(_xhr.responseText);
                    }
                } catch (e) {
                    DataManager.loadMapData(_mapId);
                }
                // BGM is restored from savestate._cheatMenuBgm below,
                // so we skip $gameMap.autoplay() here.
            }

            // --- Mid-dialogue fix ---
            // After a mid-dialogue save the restored $gameMessage gets cleared
            // by Window_Message.newPage() on the first frame, making the
            // interpreter advance past the Show Text command.  We rewind the
            // interpreter to the preceding Show Text (101) command and clear the
            // restored message so it re-executes the dialogue fresh next frame.
            if ($gameMap && $gameMap._interpreter) {
                var interp = $gameMap._interpreter;
                if (interp._waitMode === "message") {
                    var list = interp._list;
                    var idx = interp._index;
                    if (list && idx > 0) {
                        var scanIdx = idx - 1;
                        while (
                            scanIdx > 0 &&
                            list[scanIdx] &&
                            list[scanIdx].code === 401
                        ) {
                            scanIdx--;
                        }
                        if (list[scanIdx] && list[scanIdx].code === 101) {
                            interp._index = scanIdx;
                            interp._waitMode = "";
                            if ($gameMessage && $gameMessage.clear) {
                                $gameMessage.clear();
                            }
                        }
                    }
                }
            }

            // Suppress autorun/parallel events on the first frame
            if ($gameMap) $gameMap._savestateSuppress = true;

            // Clear stale input from menu interaction
            if (Input.clear) Input.clear();

            // Clear any stale transfer (shouldn't be set, but be safe)
            if ($gamePlayer && $gamePlayer.isTransferring()) {
                $gamePlayer.clearTransferInfo();
            }

            // Clean up the temporary globalInfo entry for slot 99 so it
            // doesn't pollute the normal save screen.
            if (!_isMZ) {
                var oldGlobalInfo = DataManager.loadGlobalInfo();
                if (oldGlobalInfo && oldGlobalInfo[99]) {
                    delete oldGlobalInfo[99];
                    DataManager.saveGlobalInfo(oldGlobalInfo);
                }
            }

            // Restore the cheat menu tab that was active when this state was saved,
            // so reopening the menu goes directly to the expected umbrella group.
            if (savestate._cheatMenuTab) {
                if (typeof Cheat_Menu !== "undefined") {
                    Cheat_Menu.cheat_selected = savestate._cheatMenuTab.cheat_selected || 0;
                    Cheat_Menu.sub_tab_per_group = savestate._cheatMenuTab.sub_tab_per_group || {};
                    Cheat_Menu.list_state = savestate._cheatMenuTab.list_state || { search: "", scroll: 0 };
                    // Restore speed lock state so it survives savestate save/load cycle
                    if (savestate._cheatMenuTab.speed_unlocked !== undefined) {
                        Cheat_Menu.speed_unlocked = savestate._cheatMenuTab.speed_unlocked;
                    }
                }
            }

            // Restore the BGM that was playing at capture time (play from start).
            // This replaces $gameMap.autoplay() so the saved song is used
            // regardless of the map's assigned BGM.
            if (savestate._cheatMenuBgm && typeof AudioManager !== "undefined") {
                AudioManager.playBgm(savestate._cheatMenuBgm);
            }

            SoundManager.playLoad();
            try {
                SceneManager.goto(Scene_Map);
            } catch (e2) {
                if (typeof console !== "undefined" && console.warn) {
                    console.warn("Cheat_Menu scene transition error:", e2);
                }
            }
        } catch (e) {
            if (typeof console !== "undefined" && console.error) {
                console.error("Cheat_Menu _finishLoad error:", e);
            }
            SoundManager.playSystemSound(2);
        }
    };
})();
