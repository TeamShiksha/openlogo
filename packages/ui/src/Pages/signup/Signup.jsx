import { useState } from 'react';
import styles from './Signup.module.css';

function Signup({onClose}) {
	const backdropClick = (e) => {
		if (e.target === e.currentTarget) {
		  onClose();
		}
	  };
	
	return (
		<div className={styles.signupmodal} onClick={backdropClick}>
			<div className={styles.pageDiv}>
				<form  noValidate className={styles.formBox}>
					<h2 className={styles.formTitle}>Sign up for free</h2>
					<div className={styles.inputGroup}>
						<input
							type='text'
							id='name'
							name='name'
							className={styles.input}
							required
						/>
						<label className={styles.userLabel}  htmlFor='name'>
							 Name
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
				
				<button className={styles.closeButton} onClick={onClose} >x</button>
			
			</div>
		</div>
	);
}

export default Signup;
