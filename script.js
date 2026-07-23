document.addEventListener("DOMContentLoaded", function() {
const themeValues = { hue: 220, saturation: 86, lightness: 48, alpha: 75 };
const ANIMATION_DURATION = 600;
const MENU_ANIMATION = 70;
let windowOffset = 0;
let selectedLanguage = 'en';

const updateTheme = () => {
	Object.keys(themeValues).forEach(x => {
		document.documentElement.style.setProperty(`--${x}`, themeValues[x]);
	});
};
updateTheme();

const powerOff = document.getElementById('powerOff');
const fullContainer = document.getElementById('fullContainer');
const startMenu = document.getElementById('startMenu');
const logoIndent = document.getElementById('logoIndent');

const focusWindow = (targetEl) => {
	document.querySelectorAll(".window").forEach(el => {
		el.style.zIndex = el === targetEl ? "3" : "2";
	});
};

const nextWindowPos = () => {
	windowOffset = (windowOffset + 20) % 100;
	return { top: (20 + windowOffset) + 'px', left: (20 + windowOffset) + 'px', zIndex: '3' };
};

const openWindow = (el) => {
    if (getComputedStyle(el).display !== "none") {
        focusWindow(el);
        return;
    }
    el.style.display = "block";
	requestAnimationFrame(() => {
    el.classList.remove("windowOpened");
    void el.offsetWidth;
    el.classList.add("windowOpened");
});

    if (!el.style.top || el.style.top === "0px") {
        Object.assign(el.style, nextWindowPos());
    } else {
        el.style.zIndex = "3";
    }
    focusWindow(el);
    setTimeout(() => {
        el.classList.remove("windowOpened");
    }, ANIMATION_DURATION);
};

const restoreWindow = (el) => {
	const tab = document.getElementById(el.id + 'Tab');
	if (tab) {
		el.style.display = "block";
		el.classList.add('windowOpened');
		el.style.zIndex = '3';
		focusWindow(el);
		setTimeout(() => {
			el.classList.remove('windowOpened');
			tab.remove();
		}, ANIMATION_DURATION);
	} else {
		openWindow(el);
	}
};

document.querySelectorAll(".title-bar").forEach(titleEl => {
	const windowEl = titleEl.closest(".window");
	if (windowEl) dragElement(titleEl, windowEl);
});

document.addEventListener("click", (e) => {
	const closeBtn = e.target.closest(".close");
	if (closeBtn) {
		closeBtn.closest(".window").style.display = "none";
		return;
	}

	const minBtn = e.target.closest(".minimize");
	if (minBtn) {
		const windowEl = minBtn.closest(".window");
		windowEl.classList.add('windowClosed');
		setTimeout(() => {
			windowEl.classList.remove('windowClosed');
			createTab(windowEl);
		}, ANIMATION_DURATION);
		return;
	}

	const maxBtn = e.target.closest(".maximize");
	if (maxBtn) {
		const windowEl = maxBtn.closest('.window');
		if (windowEl.classList.contains('windowFull')) {
			windowEl.classList.remove('windowFull');
			void windowEl.offsetWidth;
			windowEl.classList.add('windowReset');
			windowEl.style.top = windowEl.dataset.origTop || "20px";
			windowEl.style.left = windowEl.dataset.origLeft || "20px";
			windowEl.style.transitionDuration = `${ANIMATION_DURATION}ms`;
			
			const onEnd = (ev) => {
				if (ev.animationName === "fullScreenWindow") {
					windowEl.classList.remove("windowReset");
					windowEl.style.transitionDuration = '0ms';
					void windowEl.offsetWidth;
					windowEl.removeEventListener("animationend", onEnd);
				}
			};
			windowEl.addEventListener("animationend", onEnd);
		} else {
			windowEl.dataset.origTop = windowEl.style.top;
			windowEl.dataset.origLeft = windowEl.style.left;
			windowEl.classList.remove('windowReset');
			void windowEl.offsetWidth;
			windowEl.classList.add('windowFull');
			windowEl.style.transitionDuration = `${ANIMATION_DURATION}ms`;
			windowEl.style.top = 0;
			windowEl.style.left = 0;
			setTimeout(() => { windowEl.style.transitionDuration = '0ms'; }, ANIMATION_DURATION);
		}
		return;
	}

	const clickedWindow = e.target.closest(".window");
	if (clickedWindow) focusWindow(clickedWindow);
});

document.addEventListener("dblclick", (e) => {
	const app = e.target.closest(".app");
	if (!app) return;

	const targetId = app.dataset.target;
	if (!targetId) return;

	const el = document.getElementById(targetId);
	if (!el || (el.style.display !== "none" && el.style.display !== "")) return;

	const tab = targetId + 'Tab';
	if (document.getElementById(tab)) {
		el.style.display = "block";
		if (el.style.width === '100%' || el.style.height === '100%') {
			el.style.top = '0px';
			el.style.bottom = '0px';
		}
		el.classList.add('windowOpened');
		el.style.zIndex = '3';
		focusWindow(el);
		setTimeout(() => {
			el.classList.remove('windowOpened');
			document.getElementById(tab).remove();
		}, ANIMATION_DURATION);
	} else {
		if (el.style.width === '100%' || el.style.height === '100%') {
			el.style.top = '0px';
			el.style.bottom = '0px';
		}
		openWindow(el);
	}
});

function createTab(windowEl) {
	const id = windowEl.id;
	const windowTitle = windowEl.querySelector('.window-title').textContent.trim();
	const newEl = document.createElement("div");
	const span = document.createElement("span");
	
	newEl.classList.add("bottomTab");
	windowEl.style.display = "none";
	
	newEl.addEventListener('click', () => {
		windowEl.style.display = "block";
		newEl.remove();
		windowEl.classList.add('windowOpened');
		setTimeout(() => { windowEl.classList.remove('windowOpened'); }, ANIMATION_DURATION);
	});
	
	newEl.id = id + 'Tab';
	span.innerHTML = windowTitle;
	newEl.appendChild(span);
	document.getElementById("tabArea").appendChild(newEl);
}

function dragElement(titleEl, containerEl) {
	if (getComputedStyle(containerEl).position === "static") containerEl.style.position = "absolute";
	const parentContainer = document.getElementById("webContainer");

	titleEl.style.cursor = "move";
	titleEl.addEventListener("mousedown", startDrag);
	titleEl.addEventListener("touchstart", startDrag, { passive: false });

	function startDrag(e) {
		e.preventDefault();
		const isTouch = !!e.touches;
		const startX = isTouch ? e.touches[0].clientX : e.clientX;
		const startY = isTouch ? e.touches[0].clientY : e.clientY;
		const rect = containerEl.getBoundingClientRect();
		const offsetX = startX - rect.left;
		const offsetY = startY - rect.top;

		function onMove(ev) {
			focusWindow(containerEl);
			ev.preventDefault();
			const clientX = ev.touches ? ev.touches[0].clientX : ev.clientX;
			const clientY = ev.touches ? ev.touches[0].clientY : ev.clientY;
			const parentRect = parentContainer.getBoundingClientRect();
			const containerRect = containerEl.getBoundingClientRect();
			const parentStyle = getComputedStyle(parentContainer);
			
			const borderLeft = parseFloat(parentStyle.borderLeftWidth) || 0;
			const borderRight = parseFloat(parentStyle.borderRightWidth) || 0;
			const borderTop = parseFloat(parentStyle.borderTopWidth) || 0;
			const borderBottom = parseFloat(parentStyle.borderBottomWidth) || 0;

			let desiredLeft = clientX - offsetX;
			let desiredTop = clientY - offsetY;

			const maxLeft = parentRect.right - borderRight - containerRect.width - borderLeft;
			const maxTop = parentRect.bottom - borderBottom - containerRect.height - borderTop;

			desiredLeft = Math.min(Math.max(desiredLeft, parentRect.left), maxLeft);
			desiredTop = Math.min(Math.max(desiredTop, parentRect.top), maxTop);

			if (getComputedStyle(parentContainer).position !== "static") {
				containerEl.style.left = desiredLeft - parentRect.left + "px";
				containerEl.style.top = desiredTop - parentRect.top + "px";
			} else {
				containerEl.style.left = desiredLeft + "px";
				containerEl.style.top = desiredTop + "px";
			}
		}

		function endDrag() {
			document.removeEventListener("mousemove", onMove);
			document.removeEventListener("touchmove", onMove);
			document.removeEventListener("mouseup", endDrag);
			document.removeEventListener("touchend", endDrag);
		}

		document.addEventListener("mousemove", onMove);
		document.addEventListener("touchmove", onMove, { passive: false });
		document.addEventListener("mouseup", endDrag);
		document.addEventListener("touchend", endDrag);
	}
}

setInterval(() => {
	let day = new Date();
	let h = day.getHours();
	let m = day.getMinutes();
	let pm = h >= 12;
	h = h % 12 || 12;
	const timeIndent = document.getElementById('timeIndent');
	if (timeIndent) {
		timeIndent.innerHTML = `${h}:${m.toString().padStart(2, "0")} ${pm ? "PM" : "AM"}`;
	}
}, 100);

logoIndent.addEventListener('click', (e) => {
	e.stopPropagation();
	const isVisible = getComputedStyle(startMenu).display === 'grid';
	void startMenu.offsetWidth;
	startMenu.style.display = isVisible ? setTimeout(() => { startMenu.style.display = 'none'; }, MENU_ANIMATION) : 'grid';
	startMenu.style.zIndex = isVisible ? '0' : '4';
	startMenu.style.bottom = isVisible ? '-100%' : '-100%';
	setTimeout(() => { startMenu.style.bottom = isVisible ? '-100%' : '0%'; }, MENU_ANIMATION);
});

document.addEventListener('click', (e) => {
	if (startMenu.style.display === 'grid' && !e.target.closest('#startMenu') && !e.target.closest('#logoIndent')) {
		startMenu.style.bottom = '-100%';
		setTimeout(() => { startMenu.style.display = 'none'; }, MENU_ANIMATION);
	}
});

function createWindow(id, title, contentHTML, options = {}, url = '') {
	const windowId = id + "Container";
	const existing = document.getElementById(windowId);
	if (existing) return existing;
	const windowDiv = document.createElement('div');
	windowDiv.classList.add('window');
	if (options.className) windowDiv.classList.add(options.className);
	windowDiv.id = windowId;
	Object.assign(windowDiv.style, nextWindowPos());
	windowDiv.style.display = "none";

	windowDiv.innerHTML = `
		<div class="title-bar">
			<div class="window-title"><div class="window-icon"></div>${title}</div>
			<div class="window-controls">
				<button class="control-button minimize"><svg viewBox="0 0 10 10"><line x1="1" y1="8" x2="9" y2="8" /></svg></button>
				<button class="control-button maximize"><svg viewBox="0 0 12 12" width="18" height="18"><rect x="1" y="1" width="10" height="10" fill="none" stroke-width="1.5" rx="0.5" /><rect x="1" y="1" width="10" height="2.6" fill="white" /></svg></button>
				<button class="control-button close"><svg viewBox="0 0 10 10"><line x1="0" y1="0" x2="10" y2="10" /><line x1="10" y1="0" x2="0" y2="10" /></svg></button>
			</div>
		</div>
        ${url}
		<div class="window-content">${contentHTML}</div>
	`;
	
	dragElement(windowDiv.querySelector('.title-bar'), windowDiv);
	document.getElementById(options.windowLocation || "webContainer").appendChild(windowDiv);
	return windowDiv;
}

function createAppAndWindow(config) {
	const { id, title, contentHTML, iconId, appLocation, windowLocation, url } = config;
	const appId = id + "App";
	const appDiv = document.createElement('div');
	appDiv.className = 'app';
	appDiv.id = appId;
	appDiv.dataset.target = id + "Container";
	appDiv.innerHTML = `<div id="${iconId || ''}" class="appIcon"></div><div class="appTitle">${title}</div>`;
	
	const iconEl = appDiv.querySelector('.appIcon');
	if (iconId) iconEl.style.backgroundImage = `url(assets/${iconId}.webp), url(assets/${iconId}.png), url(assets/${iconId}.jpg)`;

	createWindow(id, title, contentHTML, { className: (id === "FileExplorer" ? "fileExplorerWindow" : id === "papers" ? "papersWindow" : ""), windowLocation: config.windowLocation }, url);

	if (appLocation === "webBg") appDiv.style.display = 'none';
	document.getElementById(appLocation).appendChild(appDiv);
}

createAppAndWindow({ id: "FileExplorer", title: "File Explorer", contentHTML: `<div id="fileExplorerAppGrid" class="appGrid"></div>`, iconId: "fileExplorerIcon", appLocation: "appGrid", windowLocation: "webContainer" });

const linksProvided = ["https://example.com", "https://codepen.io/false/pen/dPXGEeMJ", "https://essays-and-papers.com/false", "https://socialmedia.com/false"];

createAppAndWindow({ id: "links", title: "Links and Socials", contentHTML: linksProvided.map(l => `<a href="${l}" target="_blank">${l}</a>`).join('<br>'), iconId: "linksIcon", appLocation: "fileExplorerAppGrid", windowLocation: "webContainer" });
createAppAndWindow({ id: "papers", title: "Essays and Papers", contentHTML: `<div id="papersAppGrid" class="appGrid"></div>`, iconId: "papersIcon", appLocation: "fileExplorerAppGrid", windowLocation: "webContainer" });

createAppAndWindow({ id: "code", title: "Web Browser", contentHTML: `<div style="background: linear-gradient(180deg, var(--background-color), transparent); width:100%;height:100%;"><iframe id="browserIframe"
	" sandbox="allow-scripts allow-same-origin"></iframe></div>`, iconId: "webIcon", appLocation: "appGrid", windowLocation: "webContainer", url: `
    	<div class="url-bar">
		<div class="for-back-arrows">
			<div class="ie-nav-btn back"></div>
			<div class="ie-nav-btn forward"></div>
		</div>
		<div class="url-container">
            <input type="text" id="browserUrlInput" value="app://home">
			<div id="refreshPage" class="refresh"></div>
		</div>
	</div>` });
	
let web_history = [];
let history_index = -1;

window.navigateBrowser = function(url, addToHistory = true) {
    const browserIframe = document.getElementById('browserIframe');
    if (!browserIframe) return;

    url = url.trim();

    if (
        addToHistory &&
        web_history[history_index] !== url
    ) {
        web_history = web_history.slice(0, history_index + 1);
        web_history.push(url);
        history_index = web_history.length - 1;
    }

    const slug = url.toLowerCase().replace(/^app:\/\//, '');

    const appData = htmlData.find(item =>
        item.title.toLowerCase().replace(/\s+/g, '-') === slug ||
        item.title.toLowerCase() === slug
    );

    if (appData) {
        const doc = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body, html {
                    margin:0;
                    padding:0;
                    width:100%;
                    height:100%;
                    overflow:hidden;
                    background:#fff;
					margin-top: 20px;
                }
                ${appData.CSS}
            </style>
        </head>
        <body>
            ${appData.HTML}
            <script>
                function adjustScale() {
                    const targetWidth = 1080;
                    const targetHeight = 720;

                    const scaleX = window.innerWidth / targetWidth;
                    const scaleY = window.innerHeight / targetHeight;

                    document.body.style.zoom =
                        Math.min(scaleX, scaleY, 1);
                }

                window.addEventListener('resize', adjustScale);
                adjustScale();
            <\/script>

            <script>
                try {
                    ${appData.JS}
                } catch(e) {
                    console.error(e);
                }
            <\/script>
        </body>
        </html>
        `;

        browserIframe.srcdoc = doc;
    } else {
        let htmlList =
            '<div style="display:flex;flex-direction:column;gap:10px;">';

        htmlData.forEach(item => {
            const appSlug =
                'app://' +
                item.title.toLowerCase().replace(/\s+/g, '-');

            htmlList += `
                <a
                    href="#"
                    style="color:#fff;text-decoration:none;font-weight:bold;font-size:16px;"
                    onclick="
                        window.parent.document.getElementById('browserUrlInput').value='${appSlug}';
                        window.parent.navigateBrowser('${appSlug}');
                        return false;
                    "
                >
                    ${item.title}
                </a>
            `;
        });

        htmlList += '</div>';

        browserIframe.srcdoc = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body{
					font-family: 'wcp', serif;
					font-size: 100%;
					line-height: 100%;
					color: white;
					font-weight: 600;
					line-height: 110%;
					letter-spacing: 1px;
                    padding:20px;
					overflow: hidden;
					height: ${window.getComputedStyle(document.body).getPropertyValue('--window-height')};
            </style>
        </head>
        <body>
            <h2>Welcome to the Web Browser!</h2>

            <p style="margin-bottom:20px;">
                You can type an app URL, e.g.
                <code>app://pokemon-simulator</code>,
                or select a project below:
            </p>

            ${htmlList}
        </body>
        </html>
        `;
    }
};

const browserUrlInput = document.getElementById('browserUrlInput');
if (browserUrlInput) {
    browserUrlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            window.navigateBrowser(browserUrlInput.value);
        }
    });
    window.navigateBrowser(browserUrlInput.value);
}

document.querySelectorAll('.back').forEach(btn =>
	btn.addEventListener('click', () => {
		if (history_index <= 0) return;
		history_index--;
		const url = web_history[history_index];
		browserUrlInput.value = url;
		window.navigateBrowser(url, false);
	})
);

document.querySelectorAll('.forward').forEach(btn =>
	btn.addEventListener('click', () => {
		if (history_index >= web_history.length - 1) return;
		history_index++;
		const url = web_history[history_index];
		browserUrlInput.value = url;
		window.navigateBrowser(url, false);
	})
);

createAppAndWindow({ id: "bio", title: "Personal Bio", contentHTML: `
<div id="inBio" class="inWindow">
	<div id="primaryBio" class="aero">
	<div id="profileDiv"></div>
	<span>Primary Primary Primary</span>
	</div>
	<div id="secondaryBio" class="aero">Secondary Secondary Secondary</div>
	<div id="bioLibrary">
	<div id="libraryLabel">Library</div>
	<div id="contentLabel">Display</div>
	<div id="libraryContent">
	</div>
	<div id="libraryDisplay">
	<div class="libraryDisplayItem"></div>
	</div>
	</div>
</div>`, iconId: "bioIcon", appLocation: "appGrid", windowLocation: "webContainer" });
createAppAndWindow({ id: "settings", title: "Settings", contentHTML: `<div id="inSettings" class="inWindow"><p class="title">Device Theme</p><div id="colorExample"><div class="colorExample" id="primaryColor"></div><div class="colorExample" id="secondaryColor"></div></div><div id="HSLbar" class="bar"><div id="HSLslider" class="slider"></div></div><input maxlength="3" value='220' placeholder='220' id='themeInput'></input><p class="title">Translate Essays</p><select id="languageSelect"><option value="en">English</option><option value="de">Deutsch</option><option value="es">Español</option><option value="fr">Français</option><option value="it">Italiano</option><option value="pt">Português</option><option value="nl">Nederlands</option><option value="pl">Polski</option><option value="ru">Русский</option><option value="ja">日本語</option><option value="zh">中文</option><option value="ko">한국어</option></select></div>`, iconId: null, appLocation: "webBg", windowLocation: "webContainer" });
const mp3PlayerHTML = `
<div id ="mp3Window">
	<div class="mp3-player">
		<div class="mp3-player-shell">
			<div class="mp3-player-header">Now Playing. . .</div>
			<div class="mp3-player-body">
				<div class="mp3-cover"></div>
				<div class="mp3-meta">
					<div class="mp3-meta-title" id="mp3Track"></div>
					<div class="mp3-meta-subtitle" id="mp3Artist"></div>
				</div>
			</div>
			<div class="mp3-progress">
				<span class="mp3-time mp3-time-left">0:00</span>
				<div class="mp3-seekbar"><div class="mp3-seekfill"></div></div>
				<span class="mp3-time mp3-time-right">3:21</span>
			</div>
			<div class="mp3-actions">
				<button class="mp3-btn mp3-prev aero" title="Previous"></button>
				<button onclick="() => playPause()" class="mp3-btn mp3-play aero" title="Play/Pause"></button>
				<button onclick="() => nextTrack()" class="mp3-btn mp3-next aero" title="Next"></button>
			</div>
		</div>
	</div>
	</div>
`;
createAppAndWindow({ id: "music", title: "Mp3 Player", contentHTML: mp3PlayerHTML, iconId:'mp3_icon', appLocation: 'appGrid', windowLocation: 'webContainer' });

const refreshPage = document.getElementById('refreshPage');
if (refreshPage) {
    refreshPage.addEventListener('click', () => {
        refresh();
    });
}

function refresh() {
	if(refreshPage.classList.contains('refreshing')) return;
        refreshPage.classList.remove('refreshing');
        void refreshPage.offsetWidth;
        refreshPage.classList.add('refreshing');
        setTimeout(() => {
            if(refreshPage.classList.contains('refreshing')) refreshPage.classList.remove('refreshing');
        }, ANIMATION_DURATION / 2);
        
        const urlInput = document.getElementById('browserUrlInput');
        if (window.navigateBrowser && urlInput) {
            window.navigateBrowser(urlInput.value);
        }
}

const themeInput = document.getElementById('themeInput');
themeInput.addEventListener('input', () => {
	themeValues.hue = themeInput.value;
	changeSliderPos(Math.min(360, themeInput.value));
	if (themeInput.value !== '') updateTheme();
});

const languageSelect = document.getElementById('languageSelect');
if (languageSelect) {
	languageSelect.addEventListener('change', (e) => {
		selectedLanguage = e.target.value;
		console.log('Language changed to:', selectedLanguage);
	});
}

function formatTime12h(timeStr) {
	const [h, m] = timeStr.split(":").map(Number);
	return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

const weatherIcons = {
    clear: `
        <g filter="url(#glow)" stroke="#fff" stroke-width="2.3" stroke-linecap="round" fill="none">
            <circle cx="32" cy="32" r="10" fill="#ffd75a" stroke="#ffe9a0"/>
            ${Array.from({length:8},(_,i)=>{
                const a=i*Math.PI/4;
                const x1=32+14*Math.cos(a);
                const y1=32+14*Math.sin(a);
                const x2=32+20*Math.cos(a);
                const y2=32+20*Math.sin(a);
                return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
            }).join("")}
        </g>
    `,

    cloudy: `
        <g filter="url(#glow)">
            <ellipse cx="25" cy="36" rx="11" ry="8" fill="#f6fbff"/>
            <ellipse cx="36" cy="33" rx="13" ry="10" fill="#ffffff"/>
            <ellipse cx="46" cy="37" rx="10" ry="7" fill="#edf4ff"/>
            <rect x="18" y="36" width="36" height="8" fill="#ffffff"/>
        </g>
    `,

    rain: `
        <g filter="url(#glow)">
            <ellipse cx="25" cy="28" rx="11" ry="8" fill="#f6fbff"/>
            <ellipse cx="36" cy="25" rx="13" ry="10" fill="#ffffff"/>
            <ellipse cx="46" cy="29" rx="10" ry="7" fill="#edf4ff"/>
            <rect x="18" y="28" width="36" height="8" fill="#ffffff"/>

            <line x1="24" y1="40" x2="21" y2="49" stroke="#7dd3ff" stroke-width="2"/>
            <line x1="34" y1="40" x2="31" y2="49" stroke="#7dd3ff" stroke-width="2"/>
            <line x1="44" y1="40" x2="41" y2="49" stroke="#7dd3ff" stroke-width="2"/>
        </g>
    `,

    snow: `
        <g filter="url(#glow)">
            <ellipse cx="25" cy="28" rx="11" ry="8" fill="#f6fbff"/>
            <ellipse cx="36" cy="25" rx="13" ry="10" fill="#ffffff"/>
            <ellipse cx="46" cy="29" rx="10" ry="7" fill="#edf4ff"/>
            <rect x="18" y="28" width="36" height="8" fill="#ffffff"/>

            <g stroke="#ffffff" stroke-width="1.8" stroke-linecap="round">
                <path d="M24 45v6M21 48h6M22 46l4 4M26 46l-4 4"/>
                <path d="M34 45v6M31 48h6M32 46l4 4M36 46l-4 4"/>
                <path d="M44 45v6M41 48h6M42 46l4 4M46 46l-4 4"/>
            </g>
        </g>
    `,

    fog: `
        <g filter="url(#glow)" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round">
            <line x1="16" y1="24" x2="48" y2="24"/>
            <line x1="12" y1="32" x2="52" y2="32"/>
            <line x1="18" y1="40" x2="50" y2="40"/>
            <line x1="14" y1="48" x2="46" y2="48"/>
        </g>
    `,

    thunder: `
        <g filter="url(#glow)">
            <ellipse cx="25" cy="28" rx="11" ry="8" fill="#d9d9ff"/>
            <ellipse cx="36" cy="25" rx="13" ry="10" fill="#f4f4ff"/>
            <ellipse cx="46" cy="29" rx="10" ry="7" fill="#dcdcff"/>
            <rect x="18" y="28" width="36" height="8" fill="#f4f4ff"/>

            <polygon
                points="33,38 28,50 34,50 30,60 43,44 36,44 40,38"
                fill="#ffe34d"
                stroke="#fff4aa"
                stroke-width="1"/>
        </g>
    `
};

function getIconKey(code) {
	if (code <= 1) return 'clear';
	if (code <= 3) return 'cloudy';
	if (code <= 48) return 'fog';
	if (code <= 67) return 'rain';
	if (code <= 77) return 'snow';
	if (code <= 82) return 'rain';
	return 'thunder';
}

const weatherThemes = {
	clear: { bg: `linear-gradient(160deg, rgba(255,210,60,0.5) 0%, rgba(255,160,30,0.4) 40%, rgba(240,100,20,0.45) 100%)`, sheen: `rgba(255,240,120,0.6)`, glow: `rgba(255,180,40,0.35)`, orb: `radial-gradient(circle at 35% 30%, rgba(255,255,200,0.95) 0%, rgba(255,220,80,0.7) 40%, rgba(240,140,20,0.5) 100%)`, orbShadow: `0 2px 8px rgba(200,100,0,0.4), inset 0 1px 3px rgba(255,255,150,0.8)`, border: `rgba(255,220,100,0.6)` },
	cloudy: { bg: `linear-gradient(160deg, rgba(180,200,220,0.55) 0%, rgba(140,165,190,0.45) 40%, rgba(100,130,160,0.5) 100%)`, sheen: `rgba(220,235,250,0.55)`, glow: `rgba(140,170,200,0.3)`, orb: `radial-gradient(circle at 35% 30%, rgba(240,248,255,0.9) 0%, rgba(190,215,235,0.65) 40%, rgba(130,160,190,0.4) 100%)`, orbShadow: `0 2px 8px rgba(80,110,140,0.4), inset 0 1px 3px rgba(255,255,255,0.8)`, border: `rgba(200,220,240,0.55)` },
	rain: { bg: `linear-gradient(160deg, rgba(60,100,160,0.55) 0%, rgba(40,70,130,0.5) 40%, rgba(20,45,100,0.55) 100%)`, sheen: `rgba(100,150,220,0.45)`, glow: `rgba(60,100,200,0.35)`, orb: `radial-gradient(circle at 35% 30%, rgba(160,200,255,0.9) 0%, rgba(80,130,220,0.65) 40%, rgba(30,70,160,0.5) 100%)`, orbShadow: `0 2px 8px rgba(20,50,130,0.5), inset 0 1px 3px rgba(160,200,255,0.8)`, border: `rgba(100,150,230,0.5)` },
	snow: { bg: `linear-gradient(160deg, rgba(210,235,255,0.55) 0%, rgba(180,215,245,0.45) 40%, rgba(150,195,235,0.5) 100%)`, sheen: `rgba(245,250,255,0.65)`, glow: `rgba(180,215,255,0.35)`, orb: `radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95) 0%, rgba(210,235,255,0.7) 40%, rgba(160,200,240,0.45) 100%)`, orbShadow: `0 2px 8px rgba(100,150,200,0.35), inset 0 1px 3px rgba(255,255,255,0.9)`, border: `rgba(220,240,255,0.65)` },
	fog: { bg: `linear-gradient(160deg, rgba(180,185,195,0.5) 0%, rgba(155,160,172,0.45) 40%, rgba(130,135,150,0.5) 100%)`, sheen: `rgba(210,215,225,0.5)`, glow: `rgba(160,165,180,0.3)`, orb: `radial-gradient(circle at 35% 30%, rgba(230,232,238,0.9) 0%, rgba(190,194,206,0.65) 40%, rgba(150,155,170,0.45) 100%)`, orbShadow: `0 2px 8px rgba(100,105,120,0.35), inset 0 1px 3px rgba(240,242,246,0.8)`, border: `rgba(200,204,216,0.5)` },
	thunder: { bg: `linear-gradient(160deg, rgba(60,45,100,0.6) 0%, rgba(45,30,80,0.55) 40%, rgba(80,60,20,0.5) 100%)`, sheen: `rgba(140,120,220,0.4)`, glow: `rgba(80,60,160,0.4)`, orb: `radial-gradient(circle at 35% 30%, rgba(200,180,255,0.9) 0%, rgba(130,100,230,0.65) 40%, rgba(60,40,140,0.5) 100%)`, orbShadow: `0 2px 8px rgba(40,20,100,0.5), inset 0 1px 3px rgba(220,200,255,0.8)`, border: `rgba(160,130,255,0.5)` }
};

async function updateWeather(lat = 40.71, lon = -74.01) {
	try {
		const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode&daily=sunrise,sunset&temperature_unit=fahrenheit&timezone=auto&forecast_days=1`);
		const data = await res.json();
		const temp = Math.round(data.current.temperature_2m);
		const code = data.current.weathercode;
		const sunrise = formatTime12h(data.daily.sunrise[0].split("T")[1]);
		const sunset = formatTime12h(data.daily.sunset[0].split("T")[1]);

		const conditions = { 0: "Clear", 1: "Mostly Clear", 2: "Partly Cloudy", 3: "Overcast", 45: "Foggy", 48: "Icy Fog", 51: "Drizzle", 61: "Rain", 71: "Snow", 80: "Showers", 95: "Thunderstorm" };
		const iconKey = getIconKey(code);
		const theme = weatherThemes[iconKey];
		const bar = document.getElementById("weatherBar");
		const orb = bar.querySelector(".weather-orb");

		bar.style.background = theme.bg;
		bar.style.borderColor = theme.border;
		bar.style.boxShadow = `inset 0 1px 0 ${theme.sheen}, inset 0 -2px 6px ${theme.glow}, 0 4px 16px ${theme.glow}`;

		let sheen = bar.querySelector(".weather-sheen") || document.createElement("div");
		sheen.className = "weather-sheen";
		if (!sheen.parentElement) bar.prepend(sheen);
		sheen.style.cssText = `position: absolute; top: 0; left: 0; right: 0; height: 45%; pointer-events: none; z-index: 0; border-radius: 14px 14px 60% 60%; background: linear-gradient(to bottom, ${theme.sheen}, rgba(255,255,255,0.02));`;

		if (orb) {
			orb.style.background = theme.orb;
			orb.style.boxShadow = theme.orbShadow;
		}

		document.getElementById("weatherTemp").textContent = `${temp}°F`;
		document.getElementById("weatherCondition").textContent = conditions[code] || "Unknown";
		document.getElementById("weatherSunrise").textContent = sunrise;
		document.getElementById("weatherSunset").textContent = sunset;
		document.getElementById("weatherSVG").innerHTML = `<defs><filter id="glow"><feGaussianBlur stdDeviation="2.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>${weatherIcons[iconKey]}`;
	} catch (e) {
		console.warn('Issues fetching weather. . .', e);
	}
}

if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(pos => updateWeather(pos.coords.latitude, pos.coords.longitude), () => updateWeather());
} else {
	updateWeather();
}

function addToStartMenu(windowId, title) {
	const entry = document.createElement("div");
	entry.className = "startMenuApp";
	entry.innerHTML = `<div class="startMenuAppIcon"></div><span class="startMenuAppLabel">${title}</span>`;
	entry.addEventListener("click", () => {
		const el = document.getElementById(windowId);
		if (!el) return;
		startMenu.style.bottom = '-100%';
		setTimeout(() => { startMenu.style.display = 'none'; }, MENU_ANIMATION);
		restoreWindow(el);
	});
	document.getElementById("appBar").appendChild(entry);
}

['bioContainer', 'linksContainer', 'papersContainer', 'FileExplorerContainer'].forEach(id => {
	const titles = { bioContainer: 'Personal Bio', linksContainer: 'Links and Socials', papersContainer: 'Essays and Papers', FileExplorerContainer: 'File Explorer' };
	addToStartMenu(id, titles[id]);
});

powerOff.addEventListener('click', () => { fullContainer.classList.add('windowClosed'); });

function openFolder(category, items, isAppGrid) {
	const winId = `${isAppGrid ? 'appCategory' : 'category'}_${category.replace(/\s+/g, '_')}`;
	const existing = document.getElementById(winId);
	if (existing) { restoreWindow(existing); return; }

	const content = `<div class="window-content">${items.map((item, i) => `<div class="app paperEntry" data-idx="${i}"><div class="appIcon paperIcon"></div><div class="paperAppTitle">${item.title}</div></div>`).join('')}</div>`;
	const win = createWindow(winId.replace('Container', ''), category, content, { className: 'categoryWindow' });
	openWindow(win);
	win.querySelectorAll('.paperEntry').forEach(entry => {
		entry.addEventListener('dblclick', async () => {
			const item = items[entry.dataset.idx];
			if (isAppGrid) {
				const appWinId = 'app_' + item.title.replace(/\s+/g, '_');
				const appExist = document.getElementById(appWinId);
				if (appExist) { restoreWindow(appExist); return; }
				const doc = `<!DOCTYPE html><html><head><style>${item.CSS}</style></head><body>${item.HTML}<script>${item.JS}<\/script></body></html>`;
				const appWin = createWindow(appWinId.replace('Container', ''), item.title, `<iframe style="width:100%;height:100%;border:none;display:block;"></iframe>`);
				openWindow(appWin);
				appWin.querySelector('iframe').srcdoc = doc;
			} else {
				const readerId = 'reader_' + item.title.replace(/\s+/g, '_');
				const readerExist = document.getElementById(readerId);
				if (readerExist) { restoreWindow(readerExist); return; }
				
				if (!item.translations) {
    item.translations = {};
}

let displayItem = item;
let translationFailed = false;

if (selectedLanguage !== 'en') {

    if (item.translations[selectedLanguage]) {
        displayItem = item.translations[selectedLanguage];
    } else {
        const loadingBody = `
            <p class="paperTitle paperText">${item.title}</p>
            <p class="paperText">
                Translating to ${selectedLanguage}...
            </p>
        `;
        const tempWin = createWindow(
            readerId.replace('Container', ''),
            item.title,
            loadingBody,
            { className: 'paperWindow' }
        );
        openWindow(tempWin);
        const translated=await FlaskComm.translatePaper(item, selectedLanguage);
        if (translated) {
            item.translations[selectedLanguage] = translated;
            tempWin.remove();
            displayItem = translated;
        } else {
            translationFailed = true;
        }
    }
				}
				
				let body = `<p class="paperTitle paperText">${displayItem.title}</p>` + displayItem.content.split(/\r?\n/).map(p => `<p class="paperText">${p.trim()}</p>`).join('');
				if (translationFailed) {
					body = `<p class="paperText" style="color: #ff6b6b; font-weight: bold;">Translation failed--showing original text</p>` + body;
				}
				if (displayItem.tags) {
					body += `<div class="paperTags"><p class="tagHead paperText">Tags</p>${displayItem.tags.split(/\s+/).map(tag => `<span class="tag paperText">${tag.trim()}</span>`).join('')}</div>`;
				}
				if (displayItem.citations) {
					body += `<div class="paperCitations"><p class="citationHead paperText">References</p>${displayItem.citations.split(/\n+/).filter(c => c.trim()).map(cite => `<p class="citation paperText">${cite}</p>`).join('')}</div>`;
				}
				const readerWindow = document.getElementById(readerId);
				if (readerWindow) {
					readerWindow.querySelector('.window-content').innerHTML = body;
				} else {
					openWindow(createWindow(readerId.replace('Container', ''), displayItem.title, body, { className: 'paperWindow' }));
				}
			}
		});
	});
}

function renderGroupedGrid(data, containerId, isAppGrid) {
	const grouped = data.reduce((acc, curr) => {
		if (!acc[curr.category]) acc[curr.category] = [];
		acc[curr.category].push(curr);
		return acc;
	}, {});
	Object.entries(grouped).forEach(([category, items]) => {
		const folder = document.createElement("div");
		folder.className = 'app';
		folder.innerHTML = `<div class="appIcon" style="background-image:url(assets/${isAppGrid ? 'gameIcon' : 'papersIcon'}.webp),url(assets/${isAppGrid ? 'gameIcon' : 'papersIcon'}.png);"></div><div class="appTitle">${category}</div>`;
		folder.addEventListener('dblclick', () => openFolder(category, items, isAppGrid));
		document.getElementById(containerId).appendChild(folder);
	});
}

document.getElementById("bioApp").addEventListener('dblclick', () => {
	createLibraryContent('fav. philosophers', `Though his work wasn't anything groundbeaking or too original, Marcus Cicero is my favorite philosopher.<br>
		The rest are as follows (top 5):<br>
		2. Peter Wessel Zapffe,<br>
		3. Giacomo Leopardi,<br>
		4. Julius Bahnsen, and<br>
		5. Arthur Schopenhauer.<br>
		To reduce overthinking, I wrote these as quickly as possible.<br>Regardless, I'm sure it is clear (if you are familiar w/ any of these individuals) that I enjoy some German pessimism; whether I would consider myself a pessimist is a different question.`
	);
	createLibraryContent('fav. books', `Whether it is truly nonfiction or not, the <i>megalos</i> magnum opus spawned from <i>The Navidson Record</i> and Zampanò, the <i>House of Leaves</i>, will forever be my favorite piece of literature. Following behind it are the following (top 5):<br>
		Infinite Jest,<br>
		Death Note,<br>
		The Iliad,<br>
		and anything written by Dante Alighieri.<br>
		I have written short pieces on <i>House of Leaves</i> and <i>Death Note</i>, though they are already quite dated, so I may rewrite them. Very soon I would like to work on an <i>Infinite Jest</i> piece, but that would be a process spanning at least six months.`)
});


function createLibraryContent(id, content) {
	if (document.getElementById(id)) return;
	const d = document.createElement('div');
	d.id = id;
	d.innerHTML = id;
	d.classList.add('libraryContentItem');
	d.addEventListener('click', ()=> {
		document.querySelector('.libraryDisplayItem').innerHTML = content;
	});
		document.getElementById('libraryContent').appendChild(d);

}

function rerenderPapersGrid() {
	const container = document.getElementById("papersAppGrid");
	container.innerHTML = '';
	renderGroupedGrid(papersData, "papersAppGrid", false);
}

renderGroupedGrid(papersData, "papersAppGrid", false);

const dblClickEvent = new MouseEvent('dblclick', { 'view': window, 'bubbles': true, 'cancelable': true });
const settingsApp = document.getElementById('settingsApp');

document.getElementById('settingsOpt').addEventListener('click', () => {
	startMenu.style.bottom = '-100%';
	setTimeout(() => { startMenu.style.display = 'none'; }, MENU_ANIMATION);
	settingsApp.dispatchEvent(dblClickEvent);
	focusWindow(document.getElementById('settingsContainer'));
});

document.querySelectorAll('.slider').forEach((slider) => {
	const container = slider.closest('.bar');
	if (container) makeDraggable(slider, container);
});

function makeDraggable(slider, container) {
	let startX = null, startLeft = 0;
	const maxLeft = () => container.clientWidth - slider.offsetWidth;
	const getX = e => e.touches ? e.touches[0].clientX : e.clientX;

	function onPointerDown(e) {
		e.preventDefault();
		startX = getX(e);
		startLeft = slider.offsetLeft;
		slider.classList.add('dragging');
	}

	function onPointerMove(e) {
		if (startX === null || !slider.classList.contains('dragging')) return;
		e.preventDefault();
		const newLeft = Math.min(Math.max(0, startLeft + (getX(e) - startX)), maxLeft());
		slider.style.left = newLeft + 'px';
		if (container.id === 'HSLbar') {
			const val = Math.round((newLeft * 360) / maxLeft());
			themeInput.value = val;
			themeValues.hue = val;
			updateTheme();
		}
	}

	function onPointerUp() {
		if (!slider.classList.contains('dragging')) return;
		slider.classList.remove('dragging');
		startX = null;
	}

	slider.addEventListener('mousedown', onPointerDown);
	document.addEventListener('mouseup', onPointerUp);
	document.addEventListener('mousemove', onPointerMove);
	slider.addEventListener('touchstart', onPointerDown, { passive: false });
	document.addEventListener('touchend', onPointerUp);
	document.addEventListener('touchmove', onPointerMove, { passive: false });
}

function changeSliderPos(hue) {
	const HSLslider = document.getElementById('HSLslider');
	if (HSLslider) HSLslider.style.left = (340 * hue / 360) + 'px';
}
changeSliderPos(themeValues.hue);
console.log(themeValues);

const music_library = {
	'butterflies': '(Tsundere Twintails)',
	'new_look': 'Wii U Mii Maker (Nintendo)',
	'wii_party': 'Wii Party (Nintendo)',
	'wii_sports_golf_results': 'Wii Sports Golf Results (Nintendo)',
	'lease': '(Takeshi Abo)',
	'DSi_shop_theme': 'DSi Shop (Nintendo)',
	'2008_toyota_corolla': '2003 Toyota Corolla',
	'aquatic_ambience': 'Scizzie',
	'number_8_regret': 'Splatoon 2 (Nintendo)',
	'hyper_diver': 'Splatoon 3 (Nintendo)',
	'daisy_circuit': 'Mario Kart Wii (Nintendo)',
	'lotus_waters': 'Yumme 2kki (Mosenite)',
	'identification': 'Infinity Frequencies',
	'inkopolis_square_tutorial': 'Splatoon 2 (Nintendo)',
	'sunken_scrolls': 'Splatoon 1 (Nintendo)',
	'sinkopated_backwash': 'Splatoon 3 (Nintendo)',
	'fly_octo_fly': 'Splatoon 2 (Nintendo)',
	'090_thrifted_tchotchkes': 'OMORI Sound Team',
	'戦慄B': 'Hideki Taniuchi',
	'特捜キラ班': 'Hideki Taniuchi',
	'退屈': 'Hideki Taniuchi',
	'事件': 'Hideki Taniuchi',
	"can_you_really_call_this_a_hotel,_I_didn't_receive_a_mint_on_my_pillow_or_anything": 'Undertale (Toby Fox)',
	"and_now_for_today's_sponsors...!": 'Deltarune (Toby Fox)',
	'self_contained_universe': 'OneShot (Nightmargin)',
	'a_home_for_flowers': 'OMORI Sound Team',
	'okay,_everyone!': 'Dan Salvato',
	'palmtree_panic_p_mix': 'SEGA Sound Team',
	'sans.': 'Undertale (Toby Fox)',
	'daijoubu!': 'Dan Salvato'

};

const bgMusicEl = document.getElementById('bg_music');
const mp3TrackEl = document.getElementById('mp3Track');
const mp3ArtistEl = document.getElementById('mp3Artist');
const progressBar = document.querySelector('.mp3-seekbar');
const progressFill = document.querySelector('.mp3-seekfill');
const currentTimeEl = document.querySelector('.mp3-time-left');
const durationTimeEl = document.querySelector('.mp3-time-right');
const playButton = document.querySelector('.mp3-play');
const prevButton = document.querySelector('.mp3-prev');
const nextButton = document.querySelector('.mp3-next');
const trackKeys = Object.keys(music_library);
let currentTrackIndex = 0;

function toTitleCase(str) {
	const lowerWords = ['of', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'by', 'from', 'with'];
	return str.split(' ').map((word, idx) => {
		const parenMatch = word.match(/\(([^)]+)\)/);
		let baseWord = word.replace(/[\(\)]/g, '');
		
		if (idx === 0) {
			baseWord = baseWord.charAt(0).toUpperCase() + baseWord.slice(1).toLowerCase();
		} else if (lowerWords.includes(baseWord.toLowerCase())) {
			baseWord = baseWord.toLowerCase();
		} else {
			baseWord = baseWord.charAt(0).toUpperCase() + baseWord.slice(1).toLowerCase();
		}
		
		if (parenMatch) {
			const innerText = parenMatch[1].charAt(0).toUpperCase() + parenMatch[1].slice(1).toLowerCase();
			return baseWord ? `${baseWord} (${innerText})` : `(${innerText})`;
		}
		if (baseWord.includes('Sans.')) baseWord = 'sans.';
		return baseWord;
	}).join(' ');
}

function formatTime(seconds) {
	if (!seconds || Number.isNaN(seconds) || seconds === Infinity) return '0:00';
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
	return `${mins}:${secs}`;
}

function updatePlayerDisplay(index) {
	const trackKey = trackKeys[index];
	if (mp3TrackEl) mp3TrackEl.textContent = toTitleCase(trackKey.replace(/_/g, ' '));
	if (mp3ArtistEl) mp3ArtistEl.textContent = music_library[trackKey];
}

function setTrack(index, playImmediately = false) {
	currentTrackIndex = ((index % trackKeys.length) + trackKeys.length) % trackKeys.length;
	const trackKey = trackKeys[currentTrackIndex];
	updatePlayerDisplay(currentTrackIndex);
	bgMusicEl.loop = false;
	bgMusicEl.src = `music/${trackKey}.mp3`;
	bgMusicEl.volume = 1;
	if (playImmediately) {
		attemptPlay();
	}
}

function attemptPlay() {
	const playPromise = bgMusicEl.play();
	if (playPromise !== undefined) {
		playPromise.catch(() => {
			const resumeOnGesture = () => {
				bgMusicEl.play().catch(() => {});
				document.removeEventListener('click', resumeOnGesture);
				document.removeEventListener('keydown', resumeOnGesture);
			};
			document.addEventListener('click', resumeOnGesture);
			document.addEventListener('keydown', resumeOnGesture);
		});
	}
}

function updateProgress() {
	if (!bgMusicEl.duration || Number.isNaN(bgMusicEl.duration) || !isFinite(bgMusicEl.duration)) return;
	const percent = (bgMusicEl.currentTime / bgMusicEl.duration) * 100;
	if (progressFill) progressFill.style.width = `${Math.min(Math.max(percent, 0), 100)}%`;
	if (currentTimeEl) currentTimeEl.textContent = formatTime(bgMusicEl.currentTime);
	if (durationTimeEl) durationTimeEl.textContent = formatTime(bgMusicEl.duration);
}

function playPause() {
	if (bgMusicEl.paused) {
		attemptPlay();
	} else {
		bgMusicEl.pause();
	}
	updatePlayIcon();
}

function updatePlayIcon() {
	if (playButton) {
		if (bgMusicEl.paused) {
			playButton.classList.remove('playing');
		} else {
			playButton.classList.add('playing');
		}
	}
}

function nextTrack() {
	setTrack(currentTrackIndex + 1, true);
}

function prevTrack() {
	setTrack(currentTrackIndex - 1, true);
}
if (playButton) playButton.addEventListener('click', playPause);
if (nextButton) nextButton.addEventListener('click', nextTrack);
if (prevButton) prevButton.addEventListener('click', prevTrack);
if (progressBar) {
	progressBar.addEventListener('click', (event) => {
		if (!bgMusicEl.duration || Number.isNaN(bgMusicEl.duration) || !isFinite(bgMusicEl.duration)) return;
		const rect = progressBar.getBoundingClientRect();
		const percent = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
		bgMusicEl.currentTime = percent * bgMusicEl.duration;
		updateProgress();
	});
}

bgMusicEl.addEventListener('timeupdate', updateProgress);
bgMusicEl.addEventListener('loadedmetadata', updateProgress);
bgMusicEl.addEventListener('ended', nextTrack);
bgMusicEl.addEventListener('play', updatePlayIcon);
bgMusicEl.addEventListener('pause', updatePlayIcon);

setTrack(Math.floor(Math.random() * trackKeys.length), true);
});
