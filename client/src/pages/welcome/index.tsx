import logo from "../assets/images/neobot-logo.png";
import { Link } from "react-router-dom";

const Welcome: React.FC<{ signIn: () => void }> = ({ signIn }) => {
  return (
    <div className="flex h-full w-full fixed flex-col justify-center items-center gap-10">
      <div>
        <h1 className="text-3xl lg:text-5xl font-semibold font-head mb-2 mx-3  text-center tracking-wide lg:tracking-widest">
          NeoBot{" "}
        </h1>
        <h2 className="text-3xl lg:text-4xl font-semibold mb-10 mx-3 text-center">
          (A.I for Pi Network)
        </h2>
        <img
          src={logo}
          alt="logo_png"
          className="min-h-[180px] w-[70%] md:w-2/5 lg:w-1/5 my-0 mx-auto animate-pulse"
        />
      </div>

      <div className="flex flex-col items-center lg:flex-row gap-5 mx-5">
        {/* link to login page */}
        <Link to="/login" onClick={() => signIn()}>
          <button className="button px-14 py-3 text-2xl bg-verdigris hover:bg-moonstone active:bg-moonstone duration-300">
            Sign In
          </button>
        </Link>

        {/* link to login page
            <Link to='/login'>
          <button className="button px-14 py-3 text-2xl bg-cerulean hover:bg-ceruleanD active:bg-ceruleanD duration-300">Sign up</button>
            </Link> */}
      </div>
    </div>
  );
};

export default Welcome;
