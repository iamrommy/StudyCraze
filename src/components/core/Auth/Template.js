import { FcGoogle } from "react-icons/fc";
// import { useSelector } from "react-redux";

import frameImg from "../../../assets/Images/frame.png";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import toast from "react-hot-toast";

function Template({ title, description1, description2, image, formType }) {
  // const { loading } = useSelector((state) => state.auth); //removed loading functionality from this page

  const loginHandler = ()=>{
    toast.error(`${formType === "signup" ? "Google Sign Up currently unavailable" : "Google Sign In currently unavailable"}`)
    return ; //remove these lines to activate google Auth
    // window.open(`${process.env.REACT_APP_BASE_URL}/auth/googlelogin`, '_self')
    window.location.href = `${process.env.REACT_APP_BASE_URL}/auth/googlelogin`;
  }

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      {/* {loading ? ( */}
        {/* <div className="spinner"></div> */}
      {/* ) : ( */}
        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center lg:items-start justify-around gap-y-12 py-12 lg:flex-row lg:gap-y-0 lg:gap-x-12">
          <div className="mx-auto w-11/12 max-w-[450px] md:mx-0">
            <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
              {title}
            </h1>
            <div className="mt-4 text-[1.125rem] leading-[1.625rem]">
              <p className="text-richblack-100">{description1}</p>{" "}
              <p className="font-edu-sa font-bold italic text-blue-100">
                {description2}
              </p>
            </div>
            {formType === "signup" ? <SignupForm /> : <LoginForm />}

            <div className='flex w-full items-center my-4 gap-x-2'>
                <div className='w-full h-[1px] bg-richblack-700'></div>
                <p className='text-richblack-700 font-medium leading[1.375rem]'>
                    OR
                </p>
                <div className='w-full h-[1px] bg-richblack-700'></div>
            </div>

            <button className='w-full flex justify-center items-center rounded-[8px] font-medium text-richblack-100
            border border-richblack-700 px-[12px] py-[8px] gap-x-2 mt-6' onClick={loginHandler}>
                <FcGoogle/>
                {
                    formType === "signup" ? <p>Sign Up with Google</p> : <p>Log In with Google</p>
                }
            </button>
          </div>
          <div className="flex lg:translate-y-16 justify-end lg:justify-start">
            <div className="relative mx-auto w-11/12 max-w-[450px] md:mx-0">
                <img
                src={frameImg}
                alt="Pattern"
                width={558}
                height={504}
                loading="lazy"
                />
                <img
                src={image}
                alt="Students"
                width={558}
                height={504}
                loading="lazy"
                className="absolute -top-4 right-4 z-10"
                />
            </div>
          </div>
        </div>
      {/* )} */}
    </div>
  );
}

export default Template;
