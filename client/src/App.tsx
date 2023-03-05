import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Login from "./pages/login";
import Welcome from "./pages/welcome";
import ChatPage from "./pages/chatPage";
import TandC from "./pages/TandC";

export type AuthResult = {
  accessToken: string;
  user: {
    uid: string;
    username: string;
  };
};

export type User = AuthResult["user"];

export interface PaymentDTO {
  amount: number;
  user_uid: string;
  created_at: string;
  identifier: string;
  metadata: Object;
  memo: string;
  status: {
    developer_approved: boolean;
    transaction_verified: boolean;
    developer_completed: boolean;
    cancelled: boolean;
    user_cancelled: boolean;
  };
  to_address: string;
  transaction: null | {
    txid: string;
    verified: boolean;
    _link: string;
  };
}

// Make TS accept the existence of our window.__ENV object - defined in index.html:
interface WindowWithEnv extends Window {
  __ENV?: {
    backendURL: string; // REACT_APP_BACKEND_URL environment variable
    sandbox: "true" | "false"; // REACT_APP_SANDBOX_SDK environment variable - string, not boolean!
  };
}

const _window: WindowWithEnv = window;
const backendURL = _window.__ENV && _window.__ENV.backendURL;

const axiosClient = axios.create({
  baseURL: `https://neobot.online`,
  timeout: 20000,
  withCredentials: true,
});
const config = {
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
};

export interface MyPaymentMetadata {}

export type PaymentCallbacks = {
  onReadyForServerApproval: (paymentId: string, uid: string) => void;
  onReadyForServerCompletion: (
    paymentId: string,
    txid: string,
    username: string
  ) => void;
  onCancel: (paymentId: string) => void;
  onError: (error: Error, payment?: PaymentDTO) => void;
};

export type ColorModes = string;

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [darkModeToggele, setDarkModeToggele] = useState<ColorModes>("light");

  const signIn = async () => {
    const scopes = ["username", "payments"];
    // Kindly stop formatting my code to multiple lines it confusing and annoying
    const authResult: AuthResult = await window.Pi.authenticate(
      scopes,
      onIncompletePaymentFound
    );
    signInUser(authResult);
    setUser(authResult.user);
  };

  const signOut = () => {
    setUser(null);
    signOutUser();
  };

  const signInUser = (authResult: AuthResult) => {
    axiosClient.post("/user/signin", { authResult });
  };

  const signOutUser = () => {
    return axiosClient.get("/user/signout");
  };

  const subscribe = async (
    memo: string,
    amount: number,
    paymentMetadata: MyPaymentMetadata
  ) => {
    const paymentData = { amount, memo, metadata: paymentMetadata };
    const callbacks: PaymentCallbacks = {
      onReadyForServerApproval,
      onReadyForServerCompletion,
      onCancel,
      onError,
    };
    const payment = await window.Pi.createPayment(paymentData, callbacks);
    console.log(payment);
  };

  const onIncompletePaymentFound = (payment: PaymentDTO) => {
    console.log("onIncompletePaymentFound", payment);
    return axiosClient.post("/payments/incomplete", { payment });
  };

  const onReadyForServerApproval = (paymentId: string) => {
    console.log("onReadyForServerApproval", paymentId);
    axiosClient.post(
      "/payments/approve",
      { paymentId, uid: user?.uid },
      config
    );
  };

  const onReadyForServerCompletion = (
    paymentId: string,
    txid: string,
    username: string
  ) => {
    console.log("onReadyForServerCompletion", paymentId, txid);
    axiosClient.post(
      "/payments/complete",
      { paymentId, txid, username: user?.username },
      config
    );
  };

  const onCancel = (paymentId: string) => {
    console.log("onCancel", paymentId);
    return axiosClient.post("/payments/cancelled_payment", { paymentId });
  };

  const onError = (error: Error, payment?: PaymentDTO) => {
    console.log("onError", error);
    if (payment) {
      console.log(payment);
      // handle the error accordingly
    }
  };

  //function for setting dark mode
  const darkMode = () => {
    // if set via local storage previously
    if (localStorage.getItem("color-theme")) {
      if (localStorage.getItem("color-theme") === "light") {
        document.documentElement.classList.add("dark");
        localStorage.setItem("color-theme", "dark");
        setDarkModeToggele("dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("color-theme", "light");
        setDarkModeToggele("light");
      }

      // if NOT set via local storage previously
    } else {
      if (document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("color-theme", "light");
        setDarkModeToggele("light");
      } else {
        document.documentElement.classList.add("dark");
        localStorage.setItem("color-theme", "dark");
        setDarkModeToggele("dark");
      }
    }
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Welcome signIn={signIn} />} />
        {user && (
          <Route
            path="/login"
            element={<Login signIn={signIn} user={user} />}
          />
        )}{" "}
        <Route path="/terms" element={<TandC />} />
        {user && (
          <Route
            path="/chatpage"
            element={
              <ChatPage
                signOut={signOut}
                user={user}
                darkMode={darkMode}
                darkModeToggele={darkModeToggele}
              />
            }
          />
        )}
      </Routes>
    </div>
  );
}

export default App;
