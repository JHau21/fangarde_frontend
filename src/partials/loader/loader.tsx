import styles from "./loader.module.css";

interface LoaderProps {
	className?: string;
	size?: number;
}

const Loader = ({ className, size }: LoaderProps) => {
	const custom_style = {
		width: `${size ? size : 120}px`,
		height: `${size ? size : 120}px`,
		border: `${size ? 0.13 * size : 16}px solid #f3f3f3`,
		borderTop: `${size ? 0.13 * size : 16}px solid #3498db`,
	};
	return (
		<div className={className ?? styles.root}>
			<div className={styles.loader} style={custom_style}></div>
		</div>
	);
};

export default Loader;
