import ReactDOM from "react-dom/client";
import App from "./App";
import "~/assets/style.css";
import "./style.css";
import { getMyPageElements } from "./utils/getMyPageElements";
import { setupPlayerLinks } from "./utils/openPlayerPage";
import { createHeaderImgUrl } from "./utils/createHeaderImgUrl";

export default defineContentScript({
	matches: [
		"https://animestore.docomo.ne.jp/animestore/mp_viw_pc*",
		"https://animestore.docomo.ne.jp/animestore/mpa_hst_pc*",
		"https://animestore.docomo.ne.jp/animestore/mpa_fav_pc*",
	],
	main(ctx) {
		const animeElements = document.querySelectorAll(".itemModule>section");
		animeElements.forEach((animeElement) => {
			const myPageElements = getMyPageElements(animeElement);
			if (!myPageElements) return;

			const animeUrl = myPageElements.textElement.getAttribute("href");
			if (!animeUrl) return;

			const url = new URL(animeUrl);
			const partId = url.searchParams.get("partId");

			if (partId) {
				const playerUrl = new URL("https://animestore.docomo.ne.jp/animestore/sc_d_pc");
				playerUrl.searchParams.set("partId", partId);

				// 新規タブで開く
				setupPlayerLinks(playerUrl, myPageElements.linkElements);
			}

			// 「続きから見る」ではheaderを追加
			if (location.href.startsWith("https://animestore.docomo.ne.jp/animestore/mp_viw_pc")) {
				url.searchParams.delete("partId");
				const newAnimeUrl = url.toString();

				const title = myPageElements.titleElement.textContent;
				if (!title) return;

				const workId = url.searchParams.get("workId");
				if (!workId) return;

				const imgUrl = createHeaderImgUrl(workId);

				const ui = createIntegratedUi(ctx, {
					position: "inline",
					append: "first",
					anchor: animeElement,
					onMount: (container) => {
						const root = ReactDOM.createRoot(container);
						root.render(
							<App newAnimeUrl={newAnimeUrl} title={title} imgUrl={imgUrl} />,
						);
					},
				});
				ui.mount();
			}
		});
	},
});
