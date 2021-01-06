import Document, { Html, Head, Main, NextScript } from "next/document";

export default class CustomDocument extends Document {
  static getInitialProps({ renderPage }) {
    // Returns an object like: { html, head, errorHtml, chunks, styles }
    return renderPage();
  }

  render() {
    return (
      <Html>
        <Head>
          <meta
            name="google-site-verification"
            content="YuaQ4dROlNtNXEKjUQNFh--EaV21Nco0sXs3J7coIMU"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
