import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {

  render() {
    return (
      <html lang="en">
        <Head>        
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          
          {/* HTML Meta Tags */}
          <title>Bitcoin Monkey Staking</title>
          <meta name="title" content="Bitcoin Monkey Staking"/>

          {/* Search Engine Tags */}
          <meta itemProp="name" content="Bitcoin Monkey Staking"/>

          {/* Facebook Meta Tags */}
          <meta property="og:url" content="https://stake.bitcoinmonkeys.io/"/>
          <meta property="og:type" content="website"/>
          <meta property="og:title" content="Bitcoin Monkey Staking"/>

          {/* Twitter Meta Tags */}
          <meta name="twitter:title" content="Bitcoin Monkey Staking"/>

          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
          <link href="https://fonts.googleapis.com/css2?family=Gochi+Hand&display=swap" rel="stylesheet"/>
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet"/>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}