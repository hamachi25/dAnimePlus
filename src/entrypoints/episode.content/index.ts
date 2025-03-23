import "./style.css";

export default defineContentScript({
	matches: ["https://animestore.docomo.ne.jp/animestore/ci_pc*"],
	main() {
		const animeElements = document.querySelectorAll("section.clearfix>a");
		animeElements.forEach((animeElement) => {
			const id = animeElement.getAttribute("id");
			const episodeId = id?.replace("episodePartId", "");
			if (!episodeId) return;

			animeElement.removeAttribute("href");
			animeElement.addEventListener("click", () => {
				open(`https://animestore.docomo.ne.jp/animestore/sc_d_pc?partId=${episodeId}`);
			});
		});
	},
});
