export const createHeaderImgUrl = (workId: string) => {
	const id1 = workId.slice(0, 2);
	const id2 = workId.slice(2, 4);
	const id3 = workId.slice(4, 5);

	return `https://cs1.animestore.docomo.ne.jp/anime_kv/img/${id1}/${id2}/${id3}/${workId}_1_3.png`;
};
