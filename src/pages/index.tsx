import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [accountId, setAccountId] = useState('');
  const [introducerId, setIntroducerId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId,
          introducerId: introducerId || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setMessage('Account created successfully!');
      setAccountId('');
      setIntroducerId('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={styles.card}
      >
        <div className={styles.decorativeCircle1}></div>
        <div className={styles.decorativeCircle2}></div>

        <h1 className={styles.title}>Bank Account Referral</h1>

        {message && (
          <div className={`${styles.message} ${styles.successMessage}`}>
             {message}
          </div>
        )}

        {error && (
          <div className={`${styles.message} ${styles.errorMessage}`}>
             {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="accountId" className={styles.label}>
              Account ID
            </label>
            <input
              type="text"
              id="accountId"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className={styles.input}
              placeholder="Enter account ID"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="introducerId" className={styles.label}>
              Introducer ID (optional)
            </label>
            <input
              type="text"
              id="introducerId"
              value={introducerId}
              onChange={(e) => setIntroducerId(e.target.value)}
              className={`${styles.input} ${styles.inputPurple}`}
              placeholder="Enter introducer ID"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className={styles.button}
          >
            Create Account
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
