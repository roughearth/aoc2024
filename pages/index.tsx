import Head from 'next/head'
import Nav from '../components/nav'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>AoC 2024</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          AoC 2024
        </h1>
        <Nav />
      </main>
    </div>
  )
}
