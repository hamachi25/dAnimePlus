export const getWorkIds = (itemList: Element[]): string[] | undefined => {
	const workIdWithNull = Array.from(itemList).map((item) => item.getAttribute("data-workid"));
	const workId = workIdWithNull.filter((id): id is string => id !== null);
	if (workIdWithNull.length !== workId.length) return undefined;

	return workId;
};
