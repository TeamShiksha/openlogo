
import styles from './Signup.module.css';

function Signup() {
	return (
		<>
			<div className={styles.pageDiv}>
				<form  noValidate className={styles.formBox}>
					<h2 className={styles.formTitle}>Sign up for free</h2>
					<div className={styles.inputGroup}>
						<input
							type='text'
							id='firstName'
							name='firstName'
							className={styles.input}
							required
						/>
						<label className={styles.userLabel}  htmlFor='firstName'>
							First Name
						</label>
					</div>
					<div className={styles.inputGroup}>
						<input
							type='text'
							id='lastName'
							name='lastName'
							className={styles.input}
							required
						/>
						<label className={styles.userLabel}  htmlFor='lastName'>
							Last Name
						</label>
					</div>
					<div className={styles.inputGroup}>
						<input
							type='text'
							id='email'
							name='email'
							className={styles.input}
							required
						/>
						<label className={styles.userLabel}  htmlFor='email'>
							Email
						</label>
					</div>
					<div className={styles.inputGroup}>
						<input
							type='password'
							id='password'
							name='password'
							className={styles.input}
							required
						/>
						<label className={styles.userLabel} htmlFor='password'>
							Password
						</label>
					</div>
					<div className={styles.inputGroup}>
						<input
							type='password'
							id='confirmPassword'
							name='confirmPassword'
							className={styles.input}
							required
						/>
						<label className={styles.userLabel} htmlFor='confirmPassword'>
							Confirm Password
						</label>
					</div>
					<div className={styles.inputGroup}>
						<button type='submit' className={styles.submitButton} >
							Register
						</button>
					</div>
					
					<div className={styles.inputActiontext}>
						<span>Already have an account?</span>
							<span>Sign in</span>
					</div>
				</form>
			</div>
		</>
	);
}

export default Signup;
