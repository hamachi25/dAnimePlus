interface Props {
	year: string;
}

const App = ({ year }: Props) => {
	return (
		<div className="absolute top-[3px] right-[3px] rounded bg-gray-100/80 !px-[4px] !py-[0.5] !no-underline">
			<span className="text-[11px] font-bold !no-underline">{year}年</span>
		</div>
	);
};
export default App;
