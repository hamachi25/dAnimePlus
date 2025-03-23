export const getItemListElement = (target: HTMLElement): Element[] => {
	const itemList = Array.from(target.querySelectorAll(".itemModule[data-workid]"));
	return itemList;
};
