import logo from '../assets/images/neobot-logo.png';
import piLogo from '../assets/images/pi-logo.png';
import { Link } from 'react-router-dom';

type signIn={
    signIn:()=>void;
} 

const Login = ({signIn}:signIn) => {
    return ( <div className="text-center">
        <div className="hidden lg:flex justify-center items-center w-3/5  bg-off-white absolute left-0 h-full fixed">
            <img src={logo} alt="logo_png" className='min-h-[180px] w-4/5 md:w-2/5 lg:w-3/5 my-0 mx-auto animate-pulse'/>
        </div>


<div className='flex justify-center items-center h-screen lg:absolute lg:right-0 lg:w-2/5 '>

            <div className="flex flex-col gap-5 items-center w-full px-10 md:px-48 lg:px-10">
              <p className="text-xl lg:text-2xl text-pi-color-D">Authenticate with Pi Network</p>
            <button className="button text-[7vw] md:text-[1.7rem] bg-pi-color hover:bg-pi-color-D w-full lg:w-4/5 gap-5 pl-0 flex justify-center items-center py-3 pr-2" onClick={signIn}>
                <img src={piLogo} alt="" className='w-10' />
                Login with Pi
                </button>
<p>This chat page will only be available on login this is just for test</p>
                <Link to='/chatpage'>
          <button className="button px-2 py-3 text-2xl bg-cerulean hover:bg-ceruleanD active:bg-ceruleanD">Proceed without login</button>
            </Link>  
            </div>

            
            
            {/* <form className="mt-10 flex flex-col items-center gap-3 lg:px-10 " >
                <p className="text-xl">Enter mail to Join the Waitlist</p>
                <input type="email" name="email" className="border-dark-green border focus:border-black rounded py-3 px-4 w-full lg:w-4/5"/>
                <button className="button text-[1.7rem] bg-dark-green mx-[3.5rem] hover:bg-dark-greenL active:bg-dark-greenL" type="submit">Enter</button>
            </form> */}
        </div>
    </div> );
}
 
export default Login;