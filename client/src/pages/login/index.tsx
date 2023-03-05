import logo from "../assets/images/neobot-logo.png";
import piLogo from "../assets/images/pi-logo.png";
import { Link, Navigate } from "react-router-dom";
import React, { useState } from "react";
import { User } from "../../App";
import axios from "axios";

interface signIn {
  signIn: () => void;
  user: User | null;
}
export let notSubscribed = true;

const Login: React.FC<signIn> = ({ signIn, user }) => {
  const [msg, setMsg] = useState<string>("");
  const [error, setError] = useState<string>("");
  // const [error, setError] = useState<string>("");

  // host for live testing
  const backend_URL = "https://neobot.online";
  const axiosClient = axios.create({
    baseURL: `${backend_URL}`,
    timeout: 20000,
    withCredentials: true,
  });

  const log = async () => {
    //getting todays date
    let todayDateString = new Date().toLocaleDateString();
    let todayDate = new Date(todayDateString);
    //getting user details
    const { data } = await axiosClient.post("/check-user", {
      username: user?.username,
    });
    //confirminig user info
    if (data) {
      // checking for error
      if (data.error) {
        setError(data.error);
      }
      // checking if subscribed
      if (data.User.expireIn !== (" " || "")) {
        if (todayDate > new Date(data.User.expiresIn)) {
          notSubscribed = false;
        } //returns false if they are subscribed
        //pls do not format my code read it on one line!!
      }
      setMsg(data.User.username);
    }
  };

  return (
    <div className="text-center">
      <div className="hidden lg:flex justify-center items-center w-3/5  bg-off-white  left-0 h-full fixed">
        <img
          src={logo}
          alt="logo_png"
          className="min-h-[180px] w-4/5 md:w-2/5 lg:w-3/5 my-0 mx-auto animate-pulse"
        />
      </div>

      <div className="flex justify-center items-center h-screen lg:absolute lg:right-0 lg:w-2/5 ">
        <div className="flex flex-col gap-5 items-center w-full px-10 md:px-48 lg:px-10">
          <p className="text-xl lg:text-2xl text-pi-color-D">
            Authenticate with Pi Network
          </p>
          {error && (
            <p className="text-xl lg:text-2xl text-pi-color-D">{error}</p>
          )}
          <button
            className="button text-[7vw] md:text-[1.7rem] bg-pi-color hover:bg-pi-color-D w-full lg:w-4/5 gap-5 pl-0 flex justify-center items-center py-3 pr-2 duration-300"
            onClick={() => log()}
          >
            <img src={piLogo} alt="" className="w-10" />
            Login with Pi
          </button>
          {msg && <Navigate to="/chatPage" />}

          {/* back door button  to login for test*/}
          {/* kindly comment this out before build */}
          {/* <Link to='/chatPage'>   
            <button
            className="button text-[7vw] md:text-[1.7rem] bg-cerulean hover:bg-ceruleanD py-3 duration-300">
            Proceed without login
          </button>
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
