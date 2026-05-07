import type React from "react"
import { Html, Head, Main, NextScript } from "next/document"

export const metadata = {
  title: "Exit From Matrix - Decentralized Democratic Platform",
  description: "Verified income. Democratic voting. Transparent treasury.",
  generator: "v0.app",
}

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata.description} />
        <meta name="generator" content={metadata.generator} />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </Head>
      <body className="font-sans antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
