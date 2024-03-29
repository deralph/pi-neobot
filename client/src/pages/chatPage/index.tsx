import axios from "axios";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  MyPaymentMetadata,
  PaymentCallbacks,
  PaymentDTO,
  User,
} from "../../App";
import { ColorModes } from "../../App";
import { notSubscribed } from "../login";

const config = {
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
};

interface Message {
  id: number;
  content: string;
  author: string;
}

interface props {
  signOut: () => void;
  darkMode: () => void;
  darkModeToggele: ColorModes;
  user: User | null;
}

const ChatPage: React.FC<props> = ({
  signOut,
  user,
  darkMode,
  darkModeToggele,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [submessage, setSubMessage] = useState<string>("");
  const [mobileMenuToggle, setMobileMenuToggle] = useState(false);
  const [notsub, setNotsub] = useState<boolean>(notSubscribed);

  const bottomRef = useRef<null | HTMLDivElement>(null);

  // setting up axios

  // host for local testing
  const backend_URL = "http://localhost:9001";

  // host for live testing
  // const backend_URL = "https://neobot.online";
  const axiosClient = axios.create({
    baseURL: `${backend_URL}`,
    timeout: 20000,
    withCredentials: true,
  });

  const msg = `We apologize for the inconvenience, but the service you are trying to access is currently unavailable. Our team is working diligently to resolve the issue, and we expect to have the service back up and running shortly. Please try again later. Thank you for your patience. Reach out to us on pi-neobot@gmail.com.`;

  const change = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMessage(e.target.value);

  //function for chat messages display
  const display = async () => {
    const newMessage: Message = {
      id: messages.length + 1,
      content: message,
      author: "Me",
    };

    const loading: Message = {
      id: messages.length + 2,
      content: "loading...",
      author: "Ai",
    };

    if (message.length > 0) {
      // display user message and loading
      setMessages([...messages, newMessage, loading]);

      try {
        const { data } = await axiosClient.post("/generate-output", {
          text: message,
          username: user?.username,
        });
        console.log(data);

        if (data.message) {
          // removing the loading messege
          // messages.pop();

          // creating an instance for the Ai reply
          const newReply: Message = {
            id: messages.length + 2,
            content: data.message,
            author: "Ai",
          };
          // setMessages([...messages, newReply]);
          setMessages([...messages, newMessage, newReply]);
        } else if (data.error && data.error !== "invalid access token") {
          const newReply: Message = {
            id: messages.length + 2,
            content: data.error,
            author: "Ai",
          };
          setMessages([...messages, newMessage, newReply]);
        } else if (data.error === "invalid access token") {
          const newReply: Message = {
            id: messages.length + 2,
            content: "invalid access token",
            author: "Ai",
          };
          setMessages([...messages, newReply]);
        } else {
          const newReply: Message = {
            id: messages.length + 2,
            content: msg,
            author: "Ai",
          };
          setMessages([...messages, newReply]);
        }
      } catch (error) {
        // removing the loading messege
        // messages.pop();
        const newReply: Message = {
          id: messages.length + 2,
          content: msg,
          author: "Ai",
        };
        setMessages([...messages, newMessage, newReply]);
      }
  
    }
    bottomRef.current!.scrollIntoView({ behavior: "smooth" });
    setMessage("");
    console.log(messages);
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

  const onReadyForServerApproval = (paymentId: string) => {
    console.log("onReadyForServerApproval", paymentId);
    axiosClient.post(
      "/payments/approve",
      { paymentId, username: user?.username, uid: user?.uid },
      config
    );
  };

  const onReadyForServerCompletion = (paymentId: string, txid: string) => {
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

  const sub = async () => {
    try {
      await subscribe("Subscription for one Month Neobot premium", 5, {
        productId: "neobot premium",
        username:user?.username
      });
     
      
        setSubMessage("subscription successful \n Enjoy your features!");
        // if(notSubscribed){
        //   notSubscribed = false
        // }
    } catch (error) {
      setSubMessage("Unable to subscribe \n Try again later");
    }
  };

  return (
    <div className="h-full w-full fixed">
      {/* side nav for and mobile */}
      {mobileMenuToggle && (
        <div className="fixed top-0 bottom-0 left-0 w-full z-[999]">
          <div
            className="fixed top-0 bottom-0 left-0 w-full bg-[#0000006e] "
            onClick={() => setMobileMenuToggle(!mobileMenuToggle)}
          ></div>
          <div className="z-[9999] animate-slide md:left-0 duration-300 bg-dark-green h-full text-white md:block px-3 py-3 fixed w-[260px] md:w-[34%] lg:w-1/5">
            <div className="flex flex-col justify-between h-[90%]">
              <div className="flex justify-center">History</div>

              <div className="gap-5 flex flex-col">
                <hr />
                <div className="gap-3 flex flex-col">
                  <div
                    className="flex flex-row items-end gap-2 hover:bg-[#efefef1f] cursor-pointer  rounded p-2.5 duration-300"
                    onClick={() => darkMode()}
                  >
                    <span className="material-symbols-outlined duration-300">
                      {`${
                        darkModeToggele === "light" ? "dark_mode" : "light_mode"
                      }`}
                    </span>
                    <p className="text-white text-xl duration-300">
                      {`${
                        darkModeToggele === "light" ? "Dark mode" : "Light mode"
                      }`}
                    </p>
                  </div>

                  <Link to="/login" onClick={() => signOut()}>
                    <div className="flex flex-row items-end gap-2 hover:bg-[#efefef1f] rounded p-2.5 duration-300">
                      <span className="material-symbols-outlined">logout</span>
                      <p className="text-white text-xl">Logout</p>
                    </div>
                  </Link>

                  <Link to="/terms">
                    <div className="flex flex-row items-end gap-2 hover:bg-[#efefef1f] rounded p-2.5 duration-300">
                      <span className="material-symbols-outlined">note</span>
                      <p className="text-white text-xl">Terms and condition</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* end of side nav  */}

      {/* chat main display */}
      <div className="lg:ml-[20%] md:ml-[34%]  h-full w-full lg:w-4/5 md:w-[66%] bg-verdigrisL dark:bg-black">
        <div className=" px-3.5 md:px-10 lg:px-20 h-[88%] overflow-y-scroll">
          {/* intro */}
          <div className="mt-0 mb-2 lg:mt-8 lg:mb-5 fixed top-0 pt-4 px-0 mr-2 ml-[-8px] bg-verdigrisLM dark:bg-black ">
            <header className="flex items-center justify-between pl-2">
              {/* welcome message */}
              <div className="dark:text-white text-dark-green">
                Welcome, {user?.username}
              </div>
              {/* hamburger menu for mobile */}
              <div
                onClick={() => setMobileMenuToggle(!mobileMenuToggle)}
                className="flex gap-1 items-end flex-col md:hidden"
              >
                <div className="h-1 w-6 bg-black dark:bg-white"></div>
                <div className="h-1 w-6 bg-black dark:bg-white"></div>
                <div className="h-1 w-6 bg-black dark:bg-white"></div>
              </div>
            </header>
            {/* If user has not subscribed this will show */}
            {notsub && (
              <div className="alert pt-[10px] px-[6px] pb-[25px] bg-slate-400 mt-2 md:mt-1 mb-3 mx-auto w-full rounded dark:bg-white">
                <p>
                  Click the subscribe button to continue using Neobot after the
                  free trial expires{""}
                </p>
                <span
                  className="bg-verdigris p-2 mt-[-12px] float-right text-white ml-4 rounded cursor-pointer duration-300 active:bg-verdigrisL hover:bg-verdigrisL"
                  onClick={() => sub()}
                >
                  Subscribe
                </span>
                {submessage && <p className="mt-30">{submessage}</p>}
              </div>
            )}

            <div className="alert">
              Welcome to Neobot, this is a chat bot that will answer your
              questions and help you do things faster. <br />
              Note that some answers maybe inaccurate
            </div>
          </div>

          <div className="mt-[230px]">
            {/* intro chats */}
            <div className="flex flex-col items-start">
              <div className="chat-text">Hi {user?.username}, I am NeoBot!</div>
            </div>
            <div className="flex flex-col items-start">
              <div className="chat-text ">
                I am an Artificially Intelligent chatbot on the Pi Network
              </div>
            </div>
            <div className="flex flex-col items-start">
              <div className="chat-text ">What can I help you with today?</div>
            </div>

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col ${
                  message.author === "Me" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`chat-text  ${
                    message.author === "Me"
                      ? "bg-cerulean rounded-tl-xl rounded-br-none "
                      : "bg-verdigris"
                  } `}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
          <div ref={bottomRef} />
        </div>

        {/* message input */}
        <div className="chat-input md:mx-auto md:my-0">
          <input
            required
            type="text"
            placeholder="Message..."
            className=" text-lg w-full focus:shadow-xl rounded-full py-3 px-4 lg:w-full outline-none"
            onChange={(e) => change(e)}
            value={message}
          />
          <span
            onClick={() => display()}
            className=" material-symbols-outlined bg-cerulean duration-300 text-4xl text-white active:text-cerulean active:bg-transparent rounded-full px-3 py-2 "
          >
            send
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
