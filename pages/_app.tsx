import { AppProps } from "next/app";
import "../styles/globals.scss";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; //styles of nprogress
import "nprogress";
import NextNProgress from "../components/pageTransition";

import AuthProvider from "../utils/AuthProvider";

// Router.events.on("routeChangeStart", () => NProgress.start());
// Router.events.on("routeChangeComplete", () => NProgress.done());
// Router.events.on("routeChangeError", () => NProgress.done());

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <NextNProgress
        color="#fda87a"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
      />
      <Component {...pageProps} />
    </AuthProvider>
  );
};
export default App;
