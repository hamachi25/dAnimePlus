// ==UserScript==
// @name        dアニメストアPlus
// @namespace   https://github.com/chimaha/dAnimePlus
// @match       https://animestore.docomo.ne.jp/animestore/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @version     1.6.5.5
// @author      chimaha
// @description dアニメストアに様々な機能を追加します
// @license     MIT license
// @icon        https://animestore.docomo.ne.jp/favicon.ico
// @compatible  firefox
// @compatible  chrome
// @downloadURL https://github.com/chimaha/dAnimePlus/raw/main/script/danimeplus.user.js
// @updateURL   https://github.com/chimaha/dAnimePlus/raw/main/script/danimeplus.user.js
// @supportURL  https://github.com/chimaha/dAnimePlus/issues
// ==/UserScript==

/*! dアニメストアPlus | MIT license | https://github.com/chimaha/dAnimePlus/blob/main/LICENSE */

/*!
*dアニメストア便利化 (https://greasyfork.org/ja/scripts/414008)
*Copyright (c) 2020 家守カホウ
*Released under the MIT license.
*see https://opensource.org/licenses/MIT
*/

"use strict";

// 解像度表示 + 制作年度表示------------------------------------------------------------------
let qualityCount = 0;
function qualityAndYear(torf) {
	const playerMypage = document.querySelectorAll(".thumbnailContainer > a");
	let workIds = [];
	for (let i = 0; i < playerMypage.length; i++) {
		const workId = new URL(document.querySelectorAll(".textContainer[href]")[i]).searchParams.get("workId");
		workIds.push(workId);
	}
	workIds = workIds.slice(qualityCount);
	const fetchAsync = async () => {
		const url = "https://animestore.docomo.ne.jp/animestore/rest/v1/works?work_id=" + workIds.join(",");
		const response = await fetch(url);
		const json = await response.json();
		function sort(workids, json) {
			const sorted = [];
			const yearSorted = [];
			for (const workid of workids) {
				const item = json.find((res) => res["id"] == workid);
				sorted.push(item["distribution"]["quality"]);
				yearSorted.push(item["details"]["production_year"]);
			}
			return [sorted, yearSorted];
		}
		const [sorted, yearSorted] = sort(workIds, json);

		for (let i = 0; i < sorted.length; i++) {
			const quality = sorted[i];
			const year = yearSorted[i];
			if (quality == "fhd") {
				div("1080p");
			} else if (quality == "hd") {
				div("720p");
			} else if (quality == "sd") {
				div("480p");
			}
			function div(quality) {
				let headerquality;
				if (torf) {
					headerquality = `
					<div class="quality" style="position: absolute; top: 3px; left: 3px; border-radius: 4px; padding: 0.5px 4px; background-color: rgba(255,255,255,0.8); text-decoration: none;">
						<span style="font-size: 11px; font-weight: bold; text-decoration: none;">${quality}</span>
					</div>
					<div style="position: absolute;top: 3px;right: 3px;border-radius: 4px;padding: 0.5px 4px;background-color: rgba(255,255,255,0.8);text-decoration: none;">
						<span style="text-decoration: none;font-weight: bold;font-size: 11px;">${year}年</span>
					</div>`;
				} else {
					headerquality = `
					<div class="quality" style="position: absolute; top: 3px; left: 3px; border-radius: 4px; padding: 0.5px 4px; background-color: rgba(255,255,255,0.8); text-decoration: none;">
						<span style="font-size: 11px; font-weight: bold; text-decoration: none;">${quality}</span>
					</div>`;
				}
				playerMypage[i + qualityCount].insertAdjacentHTML('beforeend', headerquality);
			}
		}
		qualityCount = qualityCount + sorted.length;
	};
	fetchAsync();
}
// -----------------------------------------------------------------------------------------


// サムネイルとテキストをクリックすると新規タブで開く + mouseover -------------------------------
function thumbnailclick() {
	const playerMypage = document.querySelectorAll(".thumbnailContainer > a");
	for (let i = 0; i < playerMypage.length; i++) {
		playerMypage[i].removeAttribute("onclick");
		const getHref = document.querySelectorAll(".textContainer[href]")[i];
		const urlGet = new URL(getHref.getAttribute("href"));
		const partId = urlGet.searchParams.get('partId');
		const openUrl = "https://animestore.docomo.ne.jp/animestore/sc_d_pc?partId=" + partId;
		// サムネイルとテキストをクリックすると新規タブで開く
		playerMypage[i].addEventListener('click', () => {
			open(openUrl);
		});
		getHref.addEventListener('click', () => {
			open(openUrl);
		});
		getHref.style.cursor = "pointer";

		// mouseover
		playerMypage[i].addEventListener('mouseover', () => {
			getHref.style.textDecoration = "underline";
		});
		playerMypage[i].addEventListener('mouseleave', () => {
			getHref.style.textDecoration = "";
		});
		const playerImg = document.querySelectorAll(".thumbnailContainer > a > .imgWrap16x9")[i];
		getHref.addEventListener('mouseover', () => {
			playerImg.style.opacity = "0.6";
		});
		getHref.addEventListener('mouseleave', () => {
			playerImg.style.opacity = "";
		});
	}
	const getHref = document.querySelectorAll(".textContainer[href]");
	for (let i = 0; i < getHref.length; i++) {
		getHref[i].removeAttribute("href");
	}
}
// -----------------------------------------------------------------------------------------

// 解像度を表示選択
let resolutionbool = GM_getValue("menu", true);
let titlebool = GM_getValue("seekbarTitle", true);

const path = window.location.pathname.replace('/animestore/', '');
if (path == "mpa_fav_pc" || path == "mpa_hst_pc") {
	// 気になる、視聴履歴
	if (resolutionbool) { qualityAndYear(false); }
	thumbnailclick();

} else if (path == "mp_viw_pc") {
	// 続きから見る
	const playerMypage = document.querySelectorAll(".thumbnailContainer > a");
	for (let i = 0; i < playerMypage.length; i++) {
		const workId = new URL(document.querySelectorAll(".textContainer")[i].getAttribute("href")).searchParams.get("workId");
		// header作成
		const hrefLink = "https://animestore.docomo.ne.jp/animestore/ci_pc?workId=" + workId;
		const title = document.querySelectorAll(".textContainer h2.line1 > span")[i].textContent;
		const id1 = workId.slice(0, 2);
		const id2 = workId.slice(2, 4);
		const id3 = workId.slice(4, 5);
		const imgId = "https://cs1.animestore.docomo.ne.jp/anime_kv/img/" + id1 + "/" + id2 + "/" + id3 + "/" + workId + "_1_3.png";
		const header = `
		<header class="">
			<a href="${hrefLink}">
				<p class="line2"><span class="ui-clamp webkit2LineClamp">${title}</span></p>
				<div class="titleThumbnail">
					<div class="titleThumbnailIn">
						<i class="icon "></i>
						<div class="imgWrap16x9">
							<img class=" verticallyLong lazyloaded" src="${imgId}" alt="パッケージ画像" width="640" height="360">
						</div>
					</div>
				</div>
			</a>
		</header>`;
		document.querySelectorAll(".itemModule > section")[i].insertAdjacentHTML('afterbegin', header);
	}
	if (resolutionbool) { qualityAndYear(false); }
	thumbnailclick();

} else if (path == "tp_pc") {
	// トップページ
	// 「現在放送中のアニメ」リンク先変更
	let eventStop = false;
	let addOpen = false;
	const observer = new MutationObserver(() => {
		// リンク先変更
		const itemLists = document.querySelectorAll(".itemWrapper > .p-slider__item > a.c-slide");
		for (const itemList of itemLists) {
			const workId = new URL(itemList.getAttribute("href")).searchParams.get("workId");
			const url = "https://animestore.docomo.ne.jp/animestore/ci_pc?workId=" + workId;
			itemList.setAttribute("href", `${url}`);
		}

		// 新規ウィンドウで開くeventを無効化
		if (document.querySelector(".thumbnailContainer > a > .imgWrap16x9") == undefined) { return; }
		const playerImg = document.querySelectorAll(".thumbnailContainer > a > .imgWrap16x9")[0];
		if (!eventStop) {
			playerImg.addEventListener("click", e => {
				e.stopPropagation();
			})
			eventStop = true;
		}
		// アイコンのeventが削除できないので、imgWrap16x9の子に移動する
		const iconPlay = document.querySelector(".thumbnailContainer > a > i");
		playerImg.appendChild(iconPlay);

		// サムネイルをクリックすると新規タブで開く
		const openUrl = "https://animestore.docomo.ne.jp/animestore/sc_d_pc?partId=" + document.querySelector(".thumbnailContainer > a").getAttribute("data-partid");
		if (!addOpen) {
			playerImg.addEventListener('click', () => {
				open(openUrl);
			});
			addOpen = true;
		}

		// 「続きから視聴する」を削除
		document.querySelector(".btnResume").remove();
		// タイトルの横幅を増やす
		document.querySelector(".pageHeader .title").style.width = "944px";
		// mouseover
		const headerLink = document.querySelector(".pageHeaderIn > .information");
		const playerToppage = document.querySelector(".thumbnailContainer > a");
		const titleLine = document.querySelector(".information > .title");
		const subtitleLine = document.querySelector(".information > .subTitle > p");
		headerLink.style.cursor = "pointer";
		headerLink.addEventListener('mouseover', () => {
			titleLine.style.textDecoration = "underline";
			subtitleLine.style.textDecoration = "underline";
			playerImg.style.opacity = "0.6";
		});
		headerLink.addEventListener('mouseleave', () => {
			titleLine.style.textDecoration = "";
			subtitleLine.style.textDecoration = "";
			playerImg.style.opacity = "";
		});
		playerToppage.addEventListener('mouseover', () => {
			titleLine.style.textDecoration = "underline";
			subtitleLine.style.textDecoration = "underline";
		});
		playerToppage.addEventListener('mouseleave', () => {
			titleLine.style.textDecoration = "";
			subtitleLine.style.textDecoration = "";
		});
		// タイトルをクリックすると新規タブで開く
		headerLink.addEventListener('click', () => {
			open(openUrl);
		});
	});
	const config = { childList: true, subtree: true };
	observer.observe(document.body, config);
	setTimeout(function () { observer.disconnect(); }, 1000);

	// 解像度表示
	if (resolutionbool) {
		setTimeout(() => {
			const playerSlider = document.querySelectorAll('.p-slider__item:not(.isBlack,[data-link^="/animestore/series?seriesId="]) > div > input[data-workid]');
			let workIds = [];
			for (let i = 0; i < playerSlider.length; i++) {
				const workId = document.querySelectorAll(`.p-slider__item:not(.isBlack,[data-link^="/animestore/series?seriesId="]) > div > input[data-workid]`)[i].getAttribute("data-workid");
				workIds.push(workId);
			}

			const fetchAsync = async () => {
				const url = "https://animestore.docomo.ne.jp/animestore/rest/v1/works?work_id=" + workIds.join(",");
				const response = await fetch(url);
				const json = await response.json();

				function sort(workids, json) {
					const sorted = [];
					for (const workid of workids) {
						const item = json.find((res) => res["id"] == workid);
						sorted.push(item["distribution"]["quality"]);
					}
					return sorted;
				}
				const sorted = sort(workIds, json);

				for (let i = 0; i < sorted.length; i++) {
					const quality = sorted[i];
					if (quality == "fhd") {
						div("1080p");
					} else if (quality == "hd") {
						div("720p");
					} else if (quality == "sd") {
						div("480p");
					}
					function div(quality) {
						const headerquality = `
							<div class="quality" style="position: absolute; top: 3px; left: 3px; border-radius: 4px; padding: 0.5px 4px; background-color: rgba(255,255,255,0.8); text-decoration: none;">
								<span style="font-size: 11px; font-weight: bold; text-decoration: none;">${quality}</span>
							</div>`;
						document.querySelectorAll(`.p-slider__item:not(.isBlack,[data-link^="/animestore/series?seriesId="]) > a.c-slide > .isAnime:not(.isOnAir)`)[i].insertAdjacentHTML('afterend', headerquality);
					}
				}
			}
			fetchAsync();
		}, 500);
	}

} else if (path == "ci_pc") {
	// 作品ページ
	const playerImges = document.querySelectorAll("section.clearfix > a");
	for (const playerImg of playerImges) {
		const openUrl = "https://animestore.docomo.ne.jp/animestore/sc_d_pc" + playerImg.getAttribute("href").slice(5);
		// 詳しく見るを開かずに、タブで動画を開く
		playerImg.addEventListener('click', () => {
			open(openUrl);
		});
		playerImg.style.cursor = "pointer";
		playerImg.removeAttribute("href");
	}

	// // 詳しく見る
	// const observer = new MutationObserver(() => {
	// 	if (document.querySelector("modal") != undefined && document.querySelector("#openVideo") == undefined) {
	// 		if (document.querySelector("#streamingQuality") == undefined) { return }
	// 		document.querySelector("#streamingQuality").remove();
	// 		const urlGet = new URL(location.href);
	// 		const partId = urlGet.searchParams.get('partId');
	// 		const openUrl = "https://animestore.docomo.ne.jp/animestore/sc_d_pc?partId=" + partId;
	// 		const div = `<div id="openVideo" class="list"><a class="normal">視聴する</a></div>`;
	// 		document.querySelector(".playerContainer > div").insertAdjacentHTML('afterbegin', div);
	// 		// 詳しく見るで新規タブで開く
	// 		document.querySelector("#openVideo > a").addEventListener('click', () => {
	// 			open(openUrl);
	// 		});
	// 		document.querySelector("#openVideo > a").style.cursor = "pointer";
	// 	}
	// });
	// const config = { childList: true, subtree: true };
	// observer.observe(document.body, config);

} else if (path == "sc_d_pc") {
	const video = document.querySelector("video");

	if (titlebool) {
		const observerTarget = document.querySelector(".backInfoTxt1");
		const observer = new MutationObserver(() => {
			// 再生ウィンドウ名をアニメ名に変更
			const animeTitle = observerTarget.textContent
			document.title = animeTitle;
			// シークバーにタイトルと話数を表示
			const episode = document.querySelector(".backInfoTxt2").textContent;
			// 保存した音量に変更
			const getVolume = GM_getValue("volume");
			video.volume = getVolume ? getVolume : "";

			if (document.getElementById("title") == undefined) {
				const div = `
			<div id="volumeText" style="display: table; position: relative; width: 25px; right: 5px;">
			    <span style="display: table-cell; color: #a0a09f; font-weight: 600; vertical-align: middle;">${Math.round(video.volume * 100)}</span>
			</div>
            <div id="title" style="display: table; margin-left: 20px;"></div>`;
				document.querySelector(".buttonArea > .volume").insertAdjacentHTML("afterend", div);
			}
			const span = `<span style="display: table-cell; color: #a0a09f; font-weight: 700; vertical-align: middle;">${animeTitle} ${episode}</span>`
			document.getElementById("title").innerHTML = span;
		});
		const config = { childList: true };
		observer.observe(observerTarget, config);
		observer.disconnect;
	}

	// マウスホイールで音量変更
	window.addEventListener("wheel", e => {
		const wheelDelta = Math.sign(e.wheelDelta);
		let volume = video.volume;
		if (wheelDelta == 1) {
			volume += 0.02;
		} else if (wheelDelta == -1) {
			volume -= 0.02;
		}
		volume = Math.max(0, Math.min(volume, 1));
		video.volume = volume;

		GM_setValue("volume", volume)
		const span = `<span style="display: table-cell; color: #a0a09f; font-weight: 600; vertical-align: middle;">${Math.round(video.volume * 100)}</span>`;
		document.querySelector("#volumeText").innerHTML = span;
	});

	// 音量バーを操作した場合
	let isDragging = false;
	document.querySelector("#volumePopupIn").addEventListener('mousedown', (e) => {
		isDragging = true;
	});
	document.addEventListener('mouseup', () => {
		isDragging = false;
	});
	document.addEventListener("mousemove", () => {
		if (isDragging) {
			GM_setValue("volume", video.volume)
			document.querySelector("#volumeText > span").textContent = Math.round(video.volume * 100);
		}
	})

	// 上下キーで音量変更した場合
	document.addEventListener("keyup", e => {
		if (e.key == "ArrowDown" || e.key == "ArrowUp") {
			document.querySelector("#volumeText > span").textContent = Math.round(video.volume * 100);
		}
	})

} else if (path == "sch_pc") {
	// 検索結果
	// 表示順選択肢を常に表示
	const observerTarget = document.querySelector(".listHeader > p.headerText");
	const observer = new MutationObserver(() => {
		document.querySelector(".minict_wrapper > span").style.display = "none";
		document.querySelector(".minict_wrapper > ul").style.cssText = "display: flex; border: none; border-top: none; box-shadow: none; width: max-content; background: none; top: -20px; right: -10px;"
		const searchli = document.querySelectorAll(".minict_wrapper > ul > li");
		for (let i = 0; i < searchli.length; i++) {
			searchli[i].style.cssText = "padding: 20px 30px; border-bottom: none;"
		}
		qualityCount = 0;
	});
	const config = { childList: true };
	observer.observe(observerTarget, config);

	// 解像度表示
	if (resolutionbool) {
		const observer2 = new MutationObserver(() => {
			qualityAndYear(true);
		});
		observer2.observe(document.querySelector("#listContainer"), config);
	}

} else if (path == "gen_pc" || path == "c_all_pc" || path == "series_pc") {
	// 検索結果(50音順・ジャンル)、シリーズ
	// 表示順選択肢を常に表示
	const observerTarget = document.querySelector(".listHeader > p.headerText");
	const observer = new MutationObserver(() => {
		setTimeout(() => {
			document.querySelector(".minict_wrapper > span").style.display = "none";
			document.querySelector(".minict_wrapper > ul").style.cssText = "display: flex; border: none; border-top: none; box-shadow: none; width: max-content; background: none; top: -20px; right: -10px;"
			const searchli = document.querySelectorAll(".minict_wrapper > ul > li");
			for (let i = 0; i < searchli.length; i++) {
				searchli[i].style.cssText = "padding: 20px 30px; border-bottom: none;"
			}
		}, 300);
		qualityCount = 0;
	});
	const config = { childList: true };
	observer.observe(observerTarget, config);

	// 解像度表示
	if (resolutionbool) {
		const observer2 = new MutationObserver(() => {
			qualityAndYear(true);
		});
		const config2 = { childList: true };
		observer2.observe(document.querySelector("#listContainer"), config2);
	}
} else if (path == "mpa_cmp_pc" || path == "series_pc") {
	// コンプリート
	// 解像度表示
	if (resolutionbool) { qualityAndYear(false); }

} else if (path == "CF/mylist_detail" || path == "mpa_shr_pc") {
	// リスト
	// 解像度表示
	if (resolutionbool) {
		const observer = new MutationObserver(() => {
			if (document.querySelectorAll(".p-mylistItemList__item > a > .quality")[0]) { return; }
			const playerMypage = document.querySelectorAll(".p-mylistItemList__item > a");
			let workIds = [];
			for (let i = 0; i < playerMypage.length; i++) {
				const workId = new URL(playerMypage[i].getAttribute("href")).searchParams.get("workId");
				workIds.push(workId);
			}
			const fetchAsync = async () => {
				const url = "https://animestore.docomo.ne.jp/animestore/rest/v1/works?work_id=" + workIds.join(",");
				const response = await fetch(url);
				const json = await response.json();

				function sort(workids, json) {
					const sorted = [];
					for (const workid of workids) {
						const item = json.find((res) => res["id"] == workid);
						sorted.push(item["distribution"]["quality"]);
					}
					return sorted;
				}
				const sorted = sort(workIds, json);

				for (let i = 0; i < sorted.length; i++) {
					const quality = sorted[i];
					if (quality == "fhd") {
						div("1080p");
					} else if (quality == "hd") {
						div("720p");
					} else if (quality == "sd") {
						div("480p");
					}
					function div(quality) {
						const headerquality = `
							<div class="quality" style="position: absolute; top: 3px; left: 3px; border-radius: 4px; padding: 0.5px 4px; background-color: rgba(255,255,255,0.8); text-decoration: none;">
								<span style="font-size: 11px; font-weight: bold; text-decoration: none;">${quality}</span>
							</div>`;
						playerMypage[i].insertAdjacentHTML('beforeend', headerquality);
					}
				}
			};
			fetchAsync();
		});
		const config = { childList: true, subtree: true };
		observer.observe(document.querySelector(".p-mylistItemList"), config);
		setTimeout(function () { observer.disconnect(); }, 1000);
	}
}

// 詳しく見るを削除
const detail = document.querySelectorAll('.itemModule > section > .detail');
for (let i = 0; i < detail.length; i++) {
	detail[i].style.display = "none";
}


// 解像度を表示設定
let resolutionText = resolutionbool ? "解像度を表示：ON✔️" : "解像度を表示：OFF❌";
GM_registerMenuCommand(resolutionText, () => {
	if (resolutionbool) {
		const showResolution = false;
		GM_setValue("menu", showResolution);
	} else {
		const showResolution = true;
		GM_setValue("menu", showResolution);
	}
});
// シークバーにタイトルと音量を表示設定
let titleText = titlebool ? "シークバーにタイトルを表示：ON✔️" : "シークバーにタイトル：OFF❌";
GM_registerMenuCommand(titleText, () => {
	if (titlebool) {
		const showTitle = false;
		GM_setValue("seekbarTitle", showTitle);
	} else {
		const showTitle = true;
		GM_setValue("seekbarTitle", showTitle);
	}
});