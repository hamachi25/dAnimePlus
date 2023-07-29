// ==UserScript==
// @name        dアニメストアPlus
// @namespace   https://github.com/chimaha/dAnimePlus
// @match       https://animestore.docomo.ne.jp/animestore/*
// @grant       none
// @version     1.5
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

// 解像度表示 ------------------------------------------------------------------
let qualityCount = 0;
function qualityDisplay() {
	const playerMypage = document.querySelectorAll(".thumbnailContainer > a");
	let workIds = [];
	for (let i = 0; i < playerMypage.length; i++) {
		const getHref = document.querySelectorAll(".textContainer")[i];
		const urlGet = new URL(getHref.getAttribute("href"));
		const workId = urlGet.searchParams.get("workId");
		workIds.push(workId);
	}
	workIds = workIds.slice(qualityCount);
	console.log(workIds);
	const jsonUrl = "https://animestore.docomo.ne.jp/animestore/rest/v1/works?work_id=" + workIds.join(",");
	const xhr = new XMLHttpRequest();
	xhr.open("GET", jsonUrl);
	xhr.send();
	xhr.onload = () => {
		if (xhr.status == 200) {
			const jsonObj = JSON.parse(xhr.responseText);

			function sort(workids, response) {
				const sorted = [];
				for (const workid of workids) {
					const item = response.find((res) => res["id"] == workid);
					sorted.push(item["distribution"]["quality"]);
				}
				return sorted;
			}
			const sorted = sort(workIds, jsonObj);
			console.log(sorted);
			console.log(qualityCount);

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
							<div id="quality" style="position: absolute; top: 3px; left: 3px; border: 0px; border-radius: 4px; padding: 2px 4px 0px 4px; font-size: 11px; font-weight: bold; background-color: rgba(255,255,255,0.8); text-decoration: none;">
								<span style="text-decoration: none;">${quality}</span>
							</div>
							`;
					document.querySelectorAll(".itemModuleIn > .thumbnailContainer > a")[i + qualityCount].insertAdjacentHTML('beforeend', headerquality);
				}
			}
			qualityCount = qualityCount + sorted.length;
		}
	};
}
// ----------------------------------------------------------------------------

// サムネイルとテキストをクリックすると新規タブで開く + mouseover ----------------------
function thumbnailclick() {
	const playerMypage = document.querySelectorAll(".thumbnailContainer > a");
	for (let i = 0; i < playerMypage.length; i++) {
		playerMypage[i].removeAttribute("onclick");
		const getHref = document.querySelectorAll(".textContainer")[i];
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
		getHref.removeAttribute("href");

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
}
// ----------------------------------------------------------------------------





const path = window.location.pathname.replace('/animestore/', '');
if (path == "mpa_fav_pc" || path == "mpa_hst_pc") {
	// 気になる、視聴履歴
	qualityDisplay();
	thumbnailclick();

} else if (path == "mp_viw_pc") {
	// 続きから見る
	const playerMypage = document.querySelectorAll(".thumbnailContainer > a");
	for (let i = 0; i < playerMypage.length; i++) {
		const getHref = document.querySelectorAll(".textContainer")[i];
		const urlGet = new URL(getHref.getAttribute("href"));
		const workId = urlGet.searchParams.get("workId");
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
	qualityDisplay();
	thumbnailclick();

} else if (path == "tp_pc") {
	// トップページ
	// 「現在放送中のアニメ」リンク先変更
	const observer = new MutationObserver(() => {
		// リンク先変更
		const itemList = document.querySelectorAll(".itemWrapper > .p-slider__item > a.c-slide");
		for (let i = 0; i < itemList.length; i++) {
			const params = new URL(itemList[i].getAttribute("href")).searchParams;
			const workId = params.get("workId");
			const url = "https://animestore.docomo.ne.jp/animestore/ci_pc?workId=" + workId;
			itemList[i].setAttribute("href", `${url}`);
		}

		// 新規ウィンドウで開くeventを無効化
		if (document.querySelector(".thumbnailContainer > a > .imgWrap16x9") == undefined) { return }
		const playerImg = document.querySelectorAll(".thumbnailContainer > a > .imgWrap16x9")[0];
		playerImg.onclick = (event) => {
			event.stopPropagation();
		};
		// アイコンのeventが削除できないので、imgWrap16x9の子に移動する
		const iconPlay = document.querySelector(".thumbnailContainer > a > i");
		playerImg.appendChild(iconPlay);

		// サムネイルをクリックすると新規タブで開く
		const playerHome = document.querySelector(".thumbnailContainer > a");
		const partId = playerHome.getAttribute("data-partid");
		const openUrl = "https://animestore.docomo.ne.jp/animestore/sc_d_pc?partId=" + partId;
		playerImg.addEventListener('click', () => {
			open(openUrl);
		});

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
	const topInterval = setInterval(() => {
		if (document.querySelectorAll("[data-workid] > .c-slide > #quality")[0]) { return }
		const playerSlider = document.querySelectorAll(".p-slider__item:not(.isBlack) > div > input[data-workid]");
		let workIds = [];
		for (let i = 0; i < playerSlider.length; i++) {
			const getHref = document.querySelectorAll(".p-slider__item:not(.isBlack) > div > input[data-workid]")[i];
			const workId = getHref.getAttribute("data-workid");
			workIds.push(workId);
		}
		console.log(workIds);
		const jsonUrl = "https://animestore.docomo.ne.jp/animestore/rest/v1/works?work_id=" + workIds.join(",");
		console.log(jsonUrl);
		const xhr = new XMLHttpRequest();
		xhr.open("GET", jsonUrl);
		xhr.send();
		xhr.onload = () => {
			if (xhr.status == 200) {
				const jsonObj = JSON.parse(xhr.responseText);

				function sort(workids, response) {
					const sorted = [];
					for (const workid of workids) {
						const item = response.find((res) => res["id"] == workid);
						sorted.push(item["distribution"]["quality"]);
					}
					return sorted;
				}
				const sorted = sort(workIds, jsonObj);
				console.log(sorted);

				for (let i = 0; i < sorted.length; i++) {
					const quality = sorted[i]
					if (quality == "fhd") {
						div("1080p");
					} else if (quality == "hd") {
						div("720p");
					} else if (quality == "sd") {
						div("480p");
					}
					function div(quality) {
						const headerquality = `
							<div id="quality" style="position: absolute; top: 3px; left: 3px; border: 0px; border-radius: 4px; padding: 2px 4px 0px 4px; font-size: 11px; font-weight: bold; background-color: rgba(255,255,255,0.8); text-decoration: none;">
								<span style="text-decoration: none;">${quality}</span>
							</div>
							`
						document.querySelectorAll(".p-slider__item:not(.isBlack) > a.c-slide > .isAnime:not(.isOnAir)")[i].insertAdjacentHTML('afterend', headerquality);
					}
				}
			}
		};
		clearInterval(topInterval);
	}, 1000);

} else if (path == "ci_pc") {
	// 作品ページ
	const playerImg = document.querySelectorAll("section.clearfix > a");
	for (let i = 0; i < playerImg.length; i++) {
		const partId = playerImg[i].getAttribute("href").slice(5);
		// 詳しく見るを開かずに、タブで動画を開く
		playerImg[i].addEventListener('click', () => {
			open("https://animestore.docomo.ne.jp/animestore/sc_d_pc" + partId);
		});
		playerImg[i].style.cursor = "pointer";
		playerImg[i].removeAttribute("href");
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
	const observerTarget = document.querySelector(".backInfoTxt1");
	const observer = new MutationObserver(() => {
		// 再生ウィンドウ名をアニメ名に変更
		const animeTitle = observerTarget.textContent
		document.title = animeTitle;
		// シークバーにタイトルと話数を表示
		const episode = document.querySelector(".backInfoTxt2").textContent;
		if (document.querySelector(".buttonArea > .title") == undefined) {
			const div = '<div class="title" style="display: table; margin-left: 10px;"></div>';
			document.querySelector(".buttonArea > .volume").insertAdjacentHTML("afterend", div);
		}
		const span = `<span style="display: table-cell; color: #a0a09f; font-weight: 700; vertical-align: middle;">${animeTitle} ${episode}</span>`
		document.querySelector(".buttonArea > .title").innerHTML = span;
	});
	const config = { childList: true };
	observer.observe(observerTarget, config);
	observer.disconnect;

	// マウスホイールで音量変更
	const video = document.querySelector("video");
	window.addEventListener("wheel", (event) => {
		const wheelDelta = Math.sign(event.wheelDelta);
		let volume = video.volume;
		if (wheelDelta == 1) {
			volume += 0.02;
		} else if (wheelDelta == -1) {
			volume -= 0.02;
		}
		volume = Math.max(0, Math.min(volume, 1));
		video.volume = volume;
	});

} else if (path == "sch_pc") {
	// 検索結果
	const observer2 = new MutationObserver(() => {
		qualityDisplay();
	});
	const config = { childList: true };
	console.log(document.querySelector("#listContainer"));
	observer2.observe(document.querySelector("#listContainer"), config);

	// 表示順選択肢を常に表示
	const observerTarget = document.querySelector(".listHeader > p.headerText");
	console.log(observerTarget);
	const observer = new MutationObserver(() => {
		document.querySelector(".minict_wrapper > span").style.display = "none";
		document.querySelector(".minict_wrapper > ul").style.cssText = "display: flex; border: none; border-top: none; box-shadow: none; width: max-content; background: none; top: -20px; right: -10px;"
		const searchli = document.querySelectorAll(".minict_wrapper > ul > li");
		for (let i = 0; i < searchli.length; i++) {
			searchli[i].style.cssText = "padding: 20px 30px; border-bottom: none;"
		}
	});
	observer.observe(observerTarget, config);

} else if (path == "gen_pc" || path == "c_all_pc") {
	// 検索結果(50音順・ジャンル)
	// 解像度表示
	const observer2 = new MutationObserver(() => {
		qualityDisplay();
	});
	const config2 = { childList: true };
	console.log(document.querySelector("#listContainer"));
	observer2.observe(document.querySelector("#listContainer"), config2);
} else if (path == "mpa_cmp_pc") {
	// コンプリート
	// 解像度表示
	qualityDisplay();
} else if (path == "CF/mylist_detail" || path == "mpa_shr_pc") {
	// リスト
	// 解像度表示
	const observer = new MutationObserver(() => {
		if (document.querySelectorAll(".p-mylistItemList__item > a > #quality")[0]) { return }
		const playerMypage = document.querySelectorAll(".p-mylistItemList__item > a");
		let workIds = [];
		for (let i = 0; i < playerMypage.length; i++) {
			const getHref = playerMypage[i];
			const urlGet = new URL(getHref.getAttribute("href"));
			const workId = urlGet.searchParams.get("workId");
			workIds.push(workId);
		}
		console.log(workIds);
		const jsonUrl = "https://animestore.docomo.ne.jp/animestore/rest/v1/works?work_id=" + workIds.join(",");
		const xhr = new XMLHttpRequest();
		xhr.open("GET", jsonUrl);
		xhr.send();
		xhr.onload = () => {
			if (xhr.status == 200) {
				const jsonObj = JSON.parse(xhr.responseText);

				function sort(workids, response) {
					const sorted = [];
					for (const workid of workids) {
						const item = response.find((res) => res["id"] == workid);
						sorted.push(item["distribution"]["quality"]);
					}
					return sorted;
				}
				const sorted = sort(workIds, jsonObj);
				console.log(sorted);

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
							<div id="quality" style="position: absolute; top: 3px; left: 3px; border: 0px; border-radius: 4px; padding: 2px 4px 0px 4px; font-size: 11px; font-weight: bold; background-color: rgba(255,255,255,0.8); text-decoration: none;">
								<span style="text-decoration: none;">${quality}</span>
							</div>
							`;
						playerMypage[i].insertAdjacentHTML('beforeend', headerquality);
					}
				}
			}
		};
	});
	const config = { childList: true, subtree: true };
	observer.observe(document.querySelector(".p-mylistItemList"), config);
	setTimeout(function () { observer.disconnect(); }, 1000);
}

// マイページのリンク先を気になるに変更
if (document.querySelector("ul.common-p-header__menu")) {
	const myPage = document.querySelector('ul.common-p-header__menu > li:first-child > a[href$="mp_viw"]');
	myPage.removeAttribute("href");
	myPage.addEventListener('click', () => {
		location.href = "https://animestore.docomo.ne.jp/animestore/mpa_fav_pc";
	});
}

// 詳しく見るを削除
const detail = document.querySelectorAll('.itemModule > section > .detail');
for (let i = 0; i < detail.length; i++) {
	detail[i].style.display = "none";
}