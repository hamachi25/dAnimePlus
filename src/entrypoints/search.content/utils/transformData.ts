// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transformData = (data: any, workIds: string[]): string[] => {
	return workIds.map((workId) => {
		const item = data.find((obj: { id: string }) => obj.id === workId);
		return item ? item.details.production_year : "";
	});
};
