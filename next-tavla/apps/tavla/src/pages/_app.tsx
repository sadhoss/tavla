import "mapbox-gl/dist/mapbox-gl.css";
import "@entur/tokens/dist/styles.css";
import "@shared/styles/themes/default.css";
import "@shared/styles/themes/dark.css";
import "@shared/styles/themes/light.css";
import "@shared/styles/global.css";
import "@shared/styles/reset.css";
import "@shared/styles/fonts.css";
import "@shared/styles/spacing.css";
import Head from "next/head";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <title>Entur Tavla</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}