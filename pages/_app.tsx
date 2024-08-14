import "../styles/tailwind.scss";
import "../styles/index.scss";
import "react-toastify/dist/ReactToastify.css";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "../redux/store";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import { CartProvider } from "../contexts/cart/CartContext";
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const startLoading = () => {
      setLoading(true);
      document.body.style.overflow = "hidden";
    };

    const stopLoading = () => {
      setLoading(false);
      document.body.style.overflow = "unset";
    };

    router.events.on("routeChangeStart", startLoading);
    router.events.on("routeChangeComplete", stopLoading);
    router.events.on("routeChangeError", stopLoading);

    return () => {
      router.events.off("routeChangeStart", startLoading);
      router.events.off("routeChangeComplete", stopLoading);
      router.events.off("routeChangeError", stopLoading);
    };
  }, [setLoading]);

  return getLayout(
    <Provider store={store}>
      <CartProvider>
        <ToastContainer
          toastStyle={{
            backgroundColor: "rgb(33,43,54)",
            color: "white",
          }}
        />
        <Toaster
          toastOptions={{
            className: "",
            style: {
              borderRadius: "50px",
              backgroundColor: "rgb(33,43,54)",
              color: "white",
            },
          }}
        />
        <Component {...pageProps} loading={loading} />
      </CartProvider>
    </Provider>
  );
}
