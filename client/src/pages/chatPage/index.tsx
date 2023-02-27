import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MyPaymentMetadata, User } from "../../App";

interface Message {
  id: number;
  content: string;
  author: string;
}
interface props {
  signOut: () => void;
  user: User | null;
  subscribe: (
    memo: string,
    amount: number,
    paymentMetadata: MyPaymentMetadata
  ) => void;
}

const ChatPage: React.FC<props> = ({ signOut, user, subscribe }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [submessage, setSubMessage] = useState<string>("");

  // setting up axios
  const backend_URL = "https://neobot.online/";
  const axiosClient = axios.create({
    baseURL: `${backend_URL}`,
    timeout: 20000,
    withCredentials: true,
  });

  const change = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMessage(e.target.value);

  //function for chat messages display
  const display = async () => {
    const newMessage: Message = {
      id: messages.length + 1,
      content: message,
      author: "Me",
    };

    setMessages([...messages, newMessage]);
    try {
      const { data } = await axiosClient.post("/generate-output", {
        text: message,
      });
      console.log(data);

      if (data.message) {
        const newReply: Message = {
          id: messages.length + 1,
          content: data.message,
          author: "Ai",
        };
        setMessages([...messages, newMessage, newReply]);
      } else if (data.error && data.error !== "Invalid access token") {
        const newReply: Message = {
          id: messages.length + 1,
          content: data.error,
          author: "Ai",
        };
        setMessages([...messages, newMessage, newReply]);
      } else {
        const newReply: Message = {
          id: messages.length + 1,
          content: "An error occured, try again later",
          author: "Ai",
        };
        setMessages([...messages, newMessage, newReply]);
      }

      setMessage("");
    } catch (error) {
      const newReply: Message = {
        id: messages.length + 1,
        content: "An error occured, try again later",
        author: "Ai",
      };
      setMessages([...messages, newMessage, newReply]);
      setMessage("");
    }
  };
  const sub = async () => {
    try {
      await subscribe("subscription for the pi-neobot", 5, {
        price: 5,
        user: user!,
      });

      setSubMessage("Subscription sucessful \n Enjoy your features!");
    } catch (error) {
      setSubMessage("unable to subscribe \n Try again later");
    }
  };

  return (
    <div className="h-full w-full fixed">
      <div className="hidden bg-dark-green h-full text-white md:block px-3 py-3 fixed left-0 w-1/5 ">
        <div className="flex flex-col justify-between h-[90%]">
          <div className="flex justify-center">History</div>

          <div className="gap-5 flex flex-col">
            <hr />
            <div className="gap-3 flex flex-col">
              <div className="flex flex-row items-end gap-2 hover:bg-[#efefef1f] rounded p-2.5 duration-300">
                <span className="material-symbols-outlined">dark_mode</span>
                <p className="text-white text-xl">Dark mode</p>
              </div>

              <Link to="/login">
                <div className="flex flex-row items-end gap-2 hover:bg-[#efefef1f] rounded p-2.5 duration-300">
                  <span className="material-symbols-outlined">logout</span>
                  <p className="text-white text-xl" onClick={() => signOut()}>
                    Logout
                  </p>
                </div>
              </Link>
              <Link to="/terms">
                {" "}
                <div className="flex flex-row items-end gap-2 hover:bg-[#efefef1f] rounded p-2.5 duration-300">
                  <span className="material-symbols-outlined">note</span>
                  <p className="text-white text-xl" onClick={() => signOut()}>
                    Terms and conditions
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="md:ml-[20%] h-full w-full md:w-4/5 bg-verdigrisL">
        {/* message display */}

        <div className=" px-3.5 md:px-10 lg:px-20 h-[89%] overflow-y-scroll">
          {/* intro */}
          <div className="mt-4 mb-2 lg:mt-8 lg:mb-5">
            <div className="p-4 bg-slate-400 my-6 max-w-[500px] mx-auto w-full">
              <p className="font-bold ">
                Click here to subscribe and enjoy more benefits{" "}
                <span
                  className="bg-verdigris p-2 text-white ml-4"
                  onClick={() => sub()}
                >
                  subscribe
                </span>
              </p>
              {submessage && <p className="mt-3">{submessage}</p>}
            </div>
            <div className="alert">
              {user?.username} Welcome to Neobot, this is a chat bot that will
              answer your questions and help you do things faster
            </div>
            <div className="alert">Note that some answers maybe inaccurate</div>
            <div className="alert">
              This chatbot will not provide answer to inapproprite questions
            </div>
          </div>

          <div className="flex flex-col items-start">
            <div className="chat-text">Hi, I am NeoBot!</div>
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

        {/* message input */}
        <div className="chat-input md:mx-auto md:my-0">
          <input
            required
            type="text"
            placeholder="Message"
            className=" text-lg w-full focus:shadow-xl rounded-full py-3 px-4 lg:w-full"
            onChange={(e) => change(e)}
            value={message}
          />
          <span
            onClick={() => display()}
            className=" material-symbols-outlined bg-cerulean duration-300 text-4xl text-white hover:text-cerulean hover:bg-transparent rounded-full px-3 py-2 "
          >
            send
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
