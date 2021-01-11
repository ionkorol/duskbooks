import { useEffect } from "react";
import { AppProps } from "next/app";
import { PageTransition } from "components/common";
import AuthProvider from "utils/AuthProvider";
import TagManager from "react-gtm-module";
import "nprogress";

import "styles/globals.scss";
import "nprogress/nprogress.css";
import "react-toastify/dist/ReactToastify.css";

// Router.events.on("routeChangeStart", () => NProgress.start());
// Router.events.on("routeChangeComplete", () => NProgress.done());
// Router.events.on("routeChangeError", () => NProgress.done());

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    const tagManagerArgs = {
      gtmId: "G-B3Q7MSX0WR",
    };

    TagManager.initialize(tagManagerArgs);
  }, []);
  return (
    <AuthProvider>
      <PageTransition
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
