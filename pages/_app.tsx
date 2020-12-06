import { AppProps } from "next/app";
import "../styles/globals.scss";

import AuthProvider from "../utils/AuthProvider";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
};
export default App;
