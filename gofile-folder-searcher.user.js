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
		searchPopup: `
            <div class="min-h-full space-y-6">
                <!-- Header with Current Location -->
                <div class="flex items-center space-x-3 pb-4 border-b border-gray-600">
                    <i class="fas fa-folder text-yellow-400 text-2xl"></i>
                    <div>
                        <span class="text-gray-400 text-sm">Searching in:</span>
                        <h2 class="text-lg font-bold text-white">${
							location.href.match(/\/([^\/]+)$/)[1]
						}</h2>
                    </div>
                </div>

                <!-- Information Box -->
                <div class="bg-blue-900 bg-opacity-20 border border-blue-800 rounded-lg p-4">
                    <div class="flex space-x-3">
                        <i class="fas fa-info-circle text-blue-400 text-xl mt-1"></i>
                        <div class="space-y-2">
                            <p class="text-gray-300 text-sm">
                                Search recursively through all files and folders within the current directory.
                                You can search by:
                            </p>
                            <ul class="text-sm text-gray-300 space-y-1 ml-4">
                                <li class="flex items-center space-x-2">
                                    <i class="fas fa-dot-circle text-xs text-blue-400"></i>
                                    <span>File or folder names</span>
                                </li>
                                <li class="flex items-center space-x-2">
                                    <i class="fas fa-dot-circle text-xs text-blue-400"></i>
                                    <span>Tags (if available)</span>
                                </li>
                            </ul>
                            <div class="flex items-center space-x-2 text-xs text-gray-400 mt-2">
                                <i class="fas fa-code-branch"></i>
                                <p>More search criteria coming soon</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Search Form -->
                <form id="popup_searchForm" class="space-y-4">
                    <div class="space-y-2">
                        <label for="popup_searchInput" class="block text-sm font-medium text-gray-300">
                            Search Term
                        </label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i class="fas fa-search text-gray-400"></i>
                            </div>
                            <input 
                                type="text" 
                                id="popup_searchInput" 
                                name="searchInput" 
                                placeholder="Enter text to search..." 
                                required
                                class="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg border border-gray-600 
                                    text-white placeholder-gray-400
                                    focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                                    transition duration-200 ease-in-out"
                            >
                        </div>
                    </div>

                    <div class="flex space-x-3 pt-4">
                        <button type="submit" 
                            class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg
                                transition duration-200 ease-in-out inline-flex items-center justify-center">
                            <i class="fas fa-search mr-2"></i>
                            Start Search
                        </button>
                    </div>
                </form>

                <!-- Loading State (Initially Hidden) -->
                <div id="searchLoading" class="hidden">
                    <div class="flex items-center justify-center space-x-3 text-gray-400">
                        <i class="fas fa-circle-notch fa-spin"></i>
                        <span>Searching...</span>
                    </div>
                </div>
            </div>
            `,
		buttons: `
            <div id="filemanager_extension" class="flex items-center justify-end">
                <div class="flex items-center space-x-2 relative">
                    <span id="filemanager_extension_searchedfolders"></span>
                    <button id="filemanager_extension_search" class="bg-gray-600 text-white px-2 py-1 rounded shadow hover:bg-gray-700 flex items-center text-sm">
                        <i class="fa fa-search-plus mr-1"></i>
                        <span class="hidden lg:inline">Search</span>
                    </button>
                    <button id="filemanager_extension_fetch" class="bg-gray-600 text-white px-2 py-1 rounded shadow hover:bg-gray-700 flex items-center text-sm">
                        <i class="fas fa-file-import mr-1"></i>
                        <span class="hidden lg:inline">Fetch folder content</span>
                    </button>
                </div>
            </div>
            `,
	};

	const configs = {};
	const utils = {
		log(message) {
			console.log(`[EXT] ${message}`);
		},
	};

	const init = {
		addGui() {
			//add button
			const mainButtonNode = document.getElementById("filemanager_mainbuttons");
			mainButtonNode.insertAdjacentHTML("afterend", gui.buttons);

			//add events
			document.addEventListener("click", (event) => {
				let eventTarget = event.target;
				if (eventTarget.closest("#filemanager_extension_search")) {
					utils.log("search button");
					//global.js function
					window.createPopup({
						title: "Search All Folder Content",
						content: gui.searchPopup,
					});
				}
				if (eventTarget.closest("#filemanager_extension_fetch")) {
					utils.log("fetch button");
				}
			});
		},
		setObserver() {
			const fileListNode = document.getElementById("index_main");

			if (fileListNode) {
				const observer = new MutationObserver((mutationsList) => {
					for (const mutation of mutationsList) {
						if (mutation.type === "childList") {
							mutation.addedNodes.forEach((node) => {
								if (node.id === "filemanager") {
									init.addGui();
								}
							});
						}
					}
				});

				const config = {childList: true, subtree: false};
				observer.observe(fileListNode, config);
			} else {
				utils.log("index_main not found");
			}
		},
	};
	init.setObserver();
})();
