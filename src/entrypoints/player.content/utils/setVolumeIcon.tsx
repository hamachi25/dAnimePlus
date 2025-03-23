import { IoVolumeMute } from "react-icons/io5";
import { IoVolumeLow } from "react-icons/io5";
import { IoVolumeMedium } from "react-icons/io5";
import { IoVolumeHigh } from "react-icons/io5";

export const setVolumeIcon = (volume: number) => {
	if (volume === 0) {
		return <IoVolumeMute fill="#a0a09f" color="#a0a09f" size={23} className="p-[1px]" />;
	} else if (volume >= 1 && volume <= 33) {
		return <IoVolumeLow fill="#a0a09f" size={23} />;
	} else if (volume >= 34 && volume <= 64) {
		return <IoVolumeMedium fill="#a0a09f" size={23} />;
	} else {
		return <IoVolumeHigh fill="#a0a09f" size={23} />;
	}
};
