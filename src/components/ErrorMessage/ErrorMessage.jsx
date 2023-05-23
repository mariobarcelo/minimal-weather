import styles from './ErrorMessage.module.css';

function ErrorMessage({ children }) {
	return (
		<div className={styles.errorCard}>
			<p>{children}</p>
		</div>
	);
}

export default ErrorMessage;
