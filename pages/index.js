import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

let client = require('contentful').createClient({
  space: process.env.NEXT_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_CONTENTFUL_ACCES_TOKEN,
})

export async function getStaticProps() {
  let data = await client.getEntries({
    content_type: 'article'
  })

  return {
    props: {
      articles: data.items
    }
  }

}

export default function Home({ articles }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Nextjs blog</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <ul>
          {/* contenful API send us an array with properties like this
          fields: {title: "welcome to my blog", slug: "welcome", date: "2021-06-08T10:00+02:00", content: {…}}
          metadata: {tags: Array(0)}
          sys: {space: {…}, id: "3txAPniYePQB6y1ib7Bh */}
          {articles.map((article) => (
            <li key={article.sys.id}>
              <Link href={'/articles/' + article.fields.slug}>
                <a>{article.fields.title}</a>
              </Link>
            </li>
          ))}
        </ul>

      </main>

      <footer className={styles.footer}>

      </footer>
    </div>
  )
}
