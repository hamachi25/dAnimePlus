interface MyPageElements {
	textElement: Element;
	titleElement: Element;
	linkElements: NodeListOf<Element>;
}

export const getMyPageElements = (animeElement: Element): MyPageElements | undefined => {
	const textElement = animeElement.querySelector(".textContainer");
	const titleElement = animeElement.querySelector(".textContainerIn>.line1>span");
	const linkElements = animeElement.querySelectorAll(".itemModuleIn a");

	if (!textElement || !titleElement || !linkElements) {
		return undefined;
	}

	return {
		textElement,
		titleElement,
		linkElements,
	};
};
