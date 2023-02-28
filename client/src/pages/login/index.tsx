import logo from "../assets/images/neobot-logo.png";
import piLogo from "../assets/images/pi-logo.png";
import { Navigate } from "react-router-dom";
import React, { useState } from "react";
import { User } from "../../App";

interface signIn {
  signIn: () => void;
  user:User | null;
}

const Login: React.FC<signIn> = ({ signIn,user }) => {
  const [msg, setMsg] = useState<string>("");
  const [change, setChange] = useState<boolean>(false);

  const log = async () => {
    try {
      await signIn();
      if (user){
       setMsg(`login sucessful`); 
      }
      setChange(true);
    } catch (error) {
      setMsg(`login unsucessful`);
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
          <button
            className="button text-[7vw] md:text-[1.7rem] bg-pi-color hover:bg-pi-color-D w-full lg:w-4/5 gap-5 pl-0 flex justify-center items-center py-3 pr-2"
            onClick={() => log()}
          >
            <img src={piLogo} alt="" className="w-10" />
            Login with Pi
          </button>
          <p className="">{msg}</p>
          {user && <Navigate to="/chatPage" />}
        </div>
      </div>
    </div>
  );
};

export default Login;
