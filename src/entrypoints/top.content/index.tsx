import "./style.css";

export default defineContentScript({
	matches: ["https://animestore.docomo.ne.jp/animestore/tp_pc"],
	main() {
		const pageHeaderIn = document.querySelector(".pageHeader>.pageHeaderIn");
		const thumbnail = pageHeaderIn?.querySelector(".thumbnailContainer>a");
		const episodeId = thumbnail?.getAttribute("data-partid");

		if (episodeId) {
			// クリックイベントを無効化
			const childElements = thumbnail?.querySelectorAll("div,i");
			childElements?.forEach((element) => {
				element.addEventListener("click", (event) => {
					event.stopPropagation();
				});
			});

			pageHeaderIn?.addEventListener("click", () => {
				open(`https://animestore.docomo.ne.jp/animestore/sc_d_pc?partId=${episodeId}`);
			});
			// クリックイベントを無効化したため、子要素でもイベントを発火
			thumbnail?.querySelector(".imgWrap16x9")?.addEventListener("click", () => {
				open(`https://animestore.docomo.ne.jp/animestore/sc_d_pc?partId=${episodeId}`);
			});
		}

		const onAirAnime = document.querySelectorAll(".itemWrapper a.c-slide");
		onAirAnime.forEach((anime) => {
			const url = anime.getAttribute("href");
			if (!url) return;

			const urlObj = new URL(url);
			urlObj.searchParams.delete("partId");
			anime.setAttribute("href", urlObj.toString());
		});
	},
});
