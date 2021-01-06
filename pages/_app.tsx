import { AppProps } from "next/app";
import "nprogress";
import { PageTransition } from "components/common";
import AuthProvider from "utils/AuthProvider";

import "styles/globals.scss";
import "nprogress/nprogress.css";

// Router.events.on("routeChangeStart", () => NProgress.start());
// Router.events.on("routeChangeComplete", () => NProgress.done());
// Router.events.on("routeChangeError", () => NProgress.done());

const App = ({ Component, pageProps }: AppProps) => {
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
