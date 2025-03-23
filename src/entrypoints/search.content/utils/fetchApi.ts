export const fetchApi = async (workIds: string[]) => {
	const baseUrl = "https://animestore.docomo.ne.jp/animestore/rest/v1/works?work_id=";
	const requestUrl = baseUrl + workIds.join(",");

	const response = await fetch(requestUrl);
	const data = await response.json();
	return data;
};
