import Image from "next/image";
import {FaFlask} from "react-icons/fa6";

export default function Home() {
  return (
    <>
      <header className="fixed top-0 w-full z-30 bg-white transition-all ">
        <nav className="max-w-screen-xl px-6 sm:px-8 lg:px-6 mx-auto grid grid-flow-col py-3 sm:py-4">
          <div className="col-start-1 col-end-2 flex items-center">
            <FaFlask className="text-blue-500 w-6 h-6" />
            <span className="pl-4 font-bold text-blue-500">Nori Detection System</span>
          </div>
          <div className="col-start-10 col-end-12 font-medium flex justify-end items-center">
            <button className="font-bold tracking-wide py-2 px-5 sm:px-8 border border-blue-500 text-blue-500 bg-white outline-none rounded-l-full rounded-r-full capitalize hover:bg-blue-500 hover:text-white transition-all hover:shadow-orange ">
              Sign In
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}
