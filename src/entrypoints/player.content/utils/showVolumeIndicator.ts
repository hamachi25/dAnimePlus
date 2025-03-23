interface ShowVolumeIndicatorProps {
	setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
	lastActivityRef: React.RefObject<number>;
	hideTimeoutRef: React.RefObject<NodeJS.Timeout | null>;
}

export const showVolumeIndicator = ({
	setIsVisible,
	lastActivityRef,
	hideTimeoutRef,
}: ShowVolumeIndicatorProps) => {
	setIsVisible(true);
	lastActivityRef.current = Date.now();

	if (hideTimeoutRef.current) {
		clearTimeout(hideTimeoutRef.current);
	}

	const checkActivity = () => {
		const now = Date.now();
		const timeSinceLastActivity = now - lastActivityRef.current;

		if (timeSinceLastActivity >= 1000) {
			setIsVisible(false);
			hideTimeoutRef.current = null;
		} else {
			hideTimeoutRef.current = setTimeout(checkActivity, 100);
		}
	};

	hideTimeoutRef.current = setTimeout(checkActivity, 100);
};
