import ReactDOM from "react-dom/client";
import "~/assets/style.css";
import App from "./App";

export default defineContentScript({
	matches: ["https://animestore.docomo.ne.jp/animestore/sc_d_pc*"],
	main(ctx) {
		const ui = createIntegratedUi(ctx, {
			position: "inline",
			append: "after",
			anchor: "video",
			onMount: (container) => {
				const root = ReactDOM.createRoot(container);
				root.render(<App />);
			},
		});
		ui.mount();

		// タイトルを"アニメ名 - 話数"に変更する
		const createTabTitle = () => {
			const observer = new MutationObserver((_, obs) => {
				const title = document.querySelector(".backInfoTxt1");
				const episode = document.querySelector(".backInfoTxt2");

				if (title?.textContent && episode?.textContent) {
					document.title = `${title.textContent} - ${episode.textContent}`;
					obs.disconnect();
				}
			});

			observer.observe(document.body, {
				childList: true,
				subtree: true,
			});
		};
		createTabTitle();

		ctx.addEventListener(window, "wxt:locationchange", () => createTabTitle());
	},
});
