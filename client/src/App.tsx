import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Login from "./pages/login";
import Welcome from "./pages/welcome";
import ChatPage from "./pages/chatPage";

type MypaymentMetaData = {};

type AuthResult = {
  accessToken: string;
  user: {
    uid: string;
    username: string;
  };
};

export type User = AuthResult["user"];

interface PaymentDTO {
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
  baseURL: `${backendURL}`,
  timeout: 20000,
  withCredentials: true,
});
const config = {
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
};

function App() {
  const [user, setUser] = useState<User | null>(null);

  const signIn = async () => {
    const scopes = ["username", "payments"];
    const authResult: AuthResult = await window.Pi.authenticate(
      scopes,
      onIncompletePaymentFound
    );
    signInUser(authResult);
    setUser(authResult.user);
    console.log(user);
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

  const onIncompletePaymentFound = (payment: PaymentDTO) => {
    console.log("onIncompletePaymentFound", payment);
    return axiosClient.post("/payments/incomplete", { payment });
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login signIn={signIn} />} />
        <Route path="/chatpage" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
