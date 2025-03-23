import ReactDOM from "react-dom/client";
import "~/assets/style.css";
import "./style.css";
import App from "./App";
import { getItemListElement } from "./utils/getItemListElement";
import { getWorkIds } from "./utils/getWorkIds";
import { fetchApi } from "./utils/fetchApi";
import { transformData } from "./utils/transformData";

export default defineContentScript({
	matches: [
		"https://animestore.docomo.ne.jp/animestore/sch_pc*",
		"https://animestore.docomo.ne.jp/animestore/gen_pc*",
	],
	async main(ctx) {
		let prevCounts: number = 0;
		let prevUrl: string = "";
		const target = document.getElementById("listContainer");
		if (!target) return;

		const injectElements = (itemList: Element[], onAirYear: string[]) => {
			itemList.forEach((item, index) => {
				const target = item.querySelector(".imgWrap16x9");
				const ui = createIntegratedUi(ctx, {
					position: "inline",
					append: "after",
					anchor: target,
					onMount: (container) => {
						const root = ReactDOM.createRoot(container);
						root.render(<App year={onAirYear[index]} />);
						return root;
					},
				});
				ui.mount();
			});
		};

		const itemList = getItemListElement(target);
		const workIds = getWorkIds(itemList);

		// 初期読み込み
		if (workIds && workIds.length > 0) {
			const fetchedData = await fetchApi(workIds);
			const onAirYear = transformData(fetchedData, workIds);
			injectElements(itemList, onAirYear);

			prevCounts = workIds.length;
			prevUrl = location.href;
		}

		const observer = new MutationObserver(async () => {
			// 並び順を切り替えた場合リセット
			if (prevUrl !== location.href) {
				prevCounts = 0;
				prevUrl = location.href;
			}

			const itemList = getItemListElement(target);
			const addedItemList = itemList.slice(prevCounts);
			const workIds = getWorkIds(addedItemList);

			if (!workIds || workIds.length === 0) return;

			const fetchedData = await fetchApi(workIds);
			const onAirYear = transformData(fetchedData, workIds);

			injectElements(addedItemList, onAirYear);

			prevCounts += workIds.length;
		});

		observer.observe(target, {
			childList: true,
			subtree: true,
		});
	},
});
