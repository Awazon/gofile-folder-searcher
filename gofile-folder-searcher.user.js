// ==UserScript==
// @name         gofile folder searcher
// @namespace    https://github.com/Awazon
// @version      1
// @description  Search the contents of a folder
// @match        https://gofile.io/d/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gofile.io
// @grant        none
// ==/UserScript==

(() => {
    const gui = {
        buttons: `
        <div id="filemanager_extensionbuttons" class="flex items-center justify-end">
            <div class="flex items-center space-x-2 relative">
                <button id="filemanager_extensionbuttons_search" class="bg-gray-600 text-white px-2 py-1 rounded shadow hover:bg-gray-700 flex items-center text-sm">
                    <i class="fa fa-search-plus mr-1"></i>
                    <span class="hidden lg:inline">Search</span>
                </button>
                <button id="filemanager_extensionbuttons_fetch" class="bg-gray-600 text-white px-2 py-1 rounded shadow hover:bg-gray-700 flex items-center text-sm">
                    <i class="fas fa-file-import mr-1"></i>
                    <span class="hidden lg:inline">Fetch folder content</span>
                </button>
            </div>
        </div>
        `,
    }

    const configs = {

    }
    const utils = {
        log(message) {
            console.log(`[EXT] ${message}`);
        }
    }

    const init = {
        addButtons() {
            const mainButtonNode = document.getElementById('filemanager_mainbuttons');
            mainButtonNode.insertAdjacentHTML('afterend', gui.buttons)
        },
        setObserver() {
            const fileListNode = document.getElementById('index_main');

            if (fileListNode) {
                const observer = new MutationObserver((mutationsList) => {
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'childList') {
                            mutation.addedNodes.forEach((node) => {
                                if (node.id === 'filemanager') {
                                    init.addButtons()
                                }
                            });
                        }
                    }
                });

                const config = { childList: true, subtree: false };
                observer.observe(fileListNode, config);
            } else {
                utils.log('index_main not found');
            }
        },
    }
    init.setObserver()
})();
