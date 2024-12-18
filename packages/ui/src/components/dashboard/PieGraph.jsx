import PropTypes from 'prop-types';

const cleanPercentage = (percentage) => {
	const tooLow = !Number.isFinite(+percentage) || percentage < 0;
	const tooHigh = percentage > 100;
	if (tooLow) return 0;
	if (tooHigh) return 100;
	return +percentage;
};

const Circle = ({colour, pct, strokeWidth, fill}) => {
	const r = 70 - strokeWidth / 2;
	const circ = 2 * Math.PI * r;
	const strokePct = ((100 - pct) * circ) / 100;
	return (
		<circle
			r={r}
			cx={100}
			cy={100}
			fill={fill}
			stroke={strokePct !== circ ? colour : ''}
			strokeWidth='30'
			strokeDasharray={circ}
			strokeDashoffset={pct ? strokePct : 0}
		></circle>
	);
};

Circle.propTypes = {
	colour: PropTypes.string,
	pct: PropTypes.number,
	strokeWidth: PropTypes.number,
	fill: PropTypes.string,
};
  
Circle.defaultProps = {
	colour: "#000",
	pct: 0,
	strokeWidth: 5,
	fill: "none",
};

const Text = ({percentage, fontSize}) => {
	return (
		<text
			x='50%'
			y='50%'
			dominantBaseline='central'
			textAnchor='middle'
			fontSize={fontSize}
		>
			{percentage.toFixed(0)}%
		</text>
	);
};

Text.propTypes = {
	percentage: PropTypes.number,
	fontSize: PropTypes.string
};
  
Text.defaultProps = {
	percentage: 20,
	fontSize: '1.5em'
};

function PieGraph({percentage, colour, strokeWidth, fontSize}) {
	const pct = cleanPercentage(percentage);
	return (
		<svg viewBox='0 0 200 200' preserveAspectRatio='xMidYMid meet'>
			<g transform={`rotate(-90 100 100)`}>
				
			<Circle 
					colour="#e5e7eb"
					strokeWidth={strokeWidth} 
					pct={100} 
					fill="white" 
				/>
				<Circle
					colour={colour}
					pct={pct}
					strokeWidth={strokeWidth}
					fill="transparent"
				/>
			</g>
			<Text percentage={pct} fontSize={fontSize} />
		</svg>
	);
}

PieGraph.defaultProps = {
	strokeWidth: 12,
	fontSize: '1.5em',
};

PieGraph.propTypes = {
	percentage: PropTypes.number,
	colour: PropTypes.string,
	strokeWidth: PropTypes.number,
	fontSize: PropTypes.string
};

export default PieGraph;
