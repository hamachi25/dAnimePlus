interface Props {
	newAnimeUrl: string;
	title: string;
	imgUrl: string;
}

const App = ({ newAnimeUrl, title, imgUrl }: Props) => {
	return (
		<header>
			<a href={newAnimeUrl}>
				<p className="line2">
					<span className="ui-clamp webkit2LineClamp">{title}</span>
				</p>
				<div className="titleThumbnail">
					<div className="titleThumbnailIn">
						<div className="imgWrap16x9">
							<img
								className="lazyloaded"
								src={imgUrl}
								alt="パッケージ画像"
								width="640"
								height="360"
							/>
						</div>
					</div>
				</div>
			</a>
		</header>
	);
};
export default App;
