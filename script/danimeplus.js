// ==UserScript==
// @name        dアニメストアPlus
// @namespace   https://github.com/chimaha
// @match       https://animestore.docomo.ne.jp/animestore/*
// @grant       none
// @version     1.0
// @author      chimaha
// @description dアニメストアの動画を新規タブで開きます
// @license     MIT
// @supportURL  https://github.com/chimaha/dAnimePlus/issues
// ==/UserScript==

/*
家守カホウ様のコードを一部使用しています
MIT dアニメストア便利化(https://greasyfork.org/ja/scripts/414008)
*/

"use strict";

const path = window.location.pathname.replace('/animestore/', '');
if (path == "mpa_fav_pc" || path == "mpa_hst_pc") {
	// 気になる、視聴履歴
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
} else if (path == "mp_viw_pc") {
	// 続きから見る
	const playerMypage = document.querySelectorAll(".thumbnailContainer > a");
	for (let i = 0; i < playerMypage.length; i++) {
		// htmlのonclick属性を削除
		playerMypage[i].removeAttribute("onclick");
		const getHref = document.querySelectorAll(".textContainer")[i];
		const urlGet = new URL(getHref.getAttribute("href"));
		const partId = urlGet.searchParams.get('partId');
		// サムネイルとテキストをクリックすると新規タブで開く
		playerMypage[i].addEventListener('click', () => {
			open("https://animestore.docomo.ne.jp/animestore/sc_d_pc?partId=" + partId);
		});
		getHref.addEventListener('click', () => {
			open("https://animestore.docomo.ne.jp/animestore/sc_d_pc?partId=" + partId);
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

		// header作成
		const workId = urlGet.searchParams.get('workId');
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
} else if (path == "tp_pc") {
	// トップページ
	// 「現在放送中のアニメ」リンク先変更
	function changeHref() {
		const itemList = document.querySelectorAll(".itemWrapper > .p-slider__item > a.c-slide");
		for (let i = 0; i < itemList.length; i++) {
			const params = new URL(itemList[i].getAttribute("href")).searchParams;
			const workId = params.get("workId");
			const url = "https://animestore.docomo.ne.jp/animestore/ci_pc?workId=" + workId;
			itemList[i].setAttribute("href", `${url}`);
		}
	}
	const observer = new MutationObserver(records => {
		if (document.querySelector(".pageHeader.top").style.display != "none") {
			changeHref();
			// 新規ウィンドウで開くeventを無効化
			if (document.querySelector(".thumbnailContainer > a > .imgWrap16x9") == undefined) { return }
			const playerImg = document.querySelectorAll(".thumbnailContainer > a > .imgWrap16x9")[0];
			playerImg.onclick = (event) => {
				event.stopPropagation();
			};
			// アイコンのeventが削除できないので、imgWrap16x9の子に移動する
			if (document.querySelector(".thumbnailContainer > a > i") == undefined) { return }
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
		} else {
			changeHref();
		}
	});
	const config = { childList: true, subtree: true };
	observer.observe(document.body, config);
	setTimeout(function () { observer.disconnect() }, 1000);
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
	// const observer = new MutationObserver(records => {
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
	// 再生ウィンドウ名をアニメ名に変更
	const target = document.querySelector(".backInfoTxt1");
	const observer = new MutationObserver(records => {
		document.title = document.querySelector(".backInfoTxt1").textContent;
	});
	const config = { childList: true };
	observer.observe(target, config);
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