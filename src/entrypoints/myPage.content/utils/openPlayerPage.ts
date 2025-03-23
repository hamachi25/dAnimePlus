export const setupPlayerLinks = (playerUrl: URL, linkElement: NodeListOf<Element>) => {
	linkElement.forEach((element) => {
		(element as HTMLAnchorElement).href = playerUrl.toString();
		(element as HTMLAnchorElement).target = "_blank";
		element.querySelector(".imgWrap16x9")?.addEventListener("click", (event) => {
			event.stopPropagation();
		});
	});
};
