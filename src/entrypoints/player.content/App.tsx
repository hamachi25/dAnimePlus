import { volumeSetting } from "~/utils/storage";
import { setVolumeIcon } from "./utils/setVolumeIcon";
import { showVolumeIndicator } from "./utils/showVolumeIndicator";

const App = () => {
	const [volume, setVolume] = useState<number>(10);
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const lastActivityRef = useRef<number>(0);
	const timeHideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		(async () => {
			const volume = await volumeSetting.getValue(); // ローカルストレージから音量を取得
			const videoElement = document.querySelector("video");
			if (videoElement && volume) {
				videoElement.volume = volume;
			}

			const getVolumeFromPlayer = () => {
				if (videoElement) {
					const currentVolume = Math.round(videoElement.volume * 100);
					volumeSetting.setValue(videoElement.volume); // 音量をローカルストレージに保存
					setVolume(currentVolume);
				}
			};
			getVolumeFromPlayer();
			videoElement?.addEventListener("volumechange", getVolumeFromPlayer);

			const handleWheel = (e: WheelEvent) => {
				if (!videoElement) return;

				// Shiftキー＋縦スクロール・横スクロールの場合は、再生位置を調整
				if (e.shiftKey || Math.abs(e.deltaX) > 0) {
					e.preventDefault();

					const delta = e.shiftKey ? e.deltaY : e.deltaX;
					const skipAmount = delta > 0 ? 5 : -5;
					const newTime = Math.max(
						0,
						Math.min(videoElement.duration, videoElement.currentTime + skipAmount),
					);
					videoElement.currentTime = newTime;
				} else if (e.deltaY !== 0) {
					// 通常の縦スクロールは音量調整
					const delta = e.deltaY > 0 ? -0.02 : 0.02;
					const newVolume = Math.max(0, Math.min(1, videoElement.volume + delta));

					videoElement.volume = newVolume;
					videoElement.muted = false;

					volumeSetting.setValue(newVolume); // 音量をローカルストレージに保存
					setVolume(Math.round(newVolume * 100));
					showVolumeIndicator({ setIsVisible, lastActivityRef, hideTimeoutRef });
				}
			};
			window.addEventListener("wheel", handleWheel);

			return () => {
				videoElement?.removeEventListener("volumechange", getVolumeFromPlayer);
				window.removeEventListener("wheel", handleWheel);
				if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
				if (timeHideTimeoutRef.current) clearTimeout(timeHideTimeoutRef.current);
			};
		})();
	}, []);

	return (
		<>
			<div
				className={`absolute bottom-20 left-22 z-50 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1.5 transition-opacity ${
					isVisible ? "opacity-100 duration-0" : "opacity-0 duration-400"
				}`}
			>
				{setVolumeIcon(volume)}
				<span className="leading-none font-bold text-[#a0a09f]">{volume}</span>
			</div>
		</>
	);
};

export default App;
