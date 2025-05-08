'use client'
import Image from "next/image";
import {FaFlask} from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function Home() {

  return (
    <>
      <header className="fixed top-0 w-full z-30 bg-white transition-all ">
        <nav className="max-w-screen-xl px-6 sm:px-8 lg:px-6 mx-auto grid grid-flow-col py-3 sm:py-4">
          <div className="col-start-1 col-end-2 flex items-center">
            <FaFlask className="text-blue-500 w-6 h-6" />
            <span className="pl-4 font-bold text-blue-500">Nori Evaluation System</span>
          </div>
          <div className="col-start-10 col-end-12 font-medium flex justify-end items-center">
            <button className="font-bold tracking-wide py-2 px-5 sm:px-8 border border-blue-500 text-blue-500 bg-white outline-none rounded-l-full rounded-r-full capitalize hover:bg-blue-500 hover:text-white transition-all hover:shadow-orange ">
              Sign In
            </button>
          </div>
        </nav>
      </header>

      <div className="max-w-screen-xl mt-24 px-8 xl:px-16 mx-auto">
        <div className="grid grid-flow-row sm:grid-flow-col grid-rows-2 md:grid-rows-1 sm:grid-cols-2 gap-8 py-6 sm:py-16">
          <div className=" flex flex-col justify-center items-start row-start-2 sm:row-start-1">
            <h1 className="text-2xl lg:text-3xl xl:text-4xl text-black leading-normal font-bold ">
              紫菜营养评价系统
            </h1>
            <p className="text-gray-700 mt-4 mb-6">
              Provide a network for all your needs with ease and fun using
              LaslesVPN discover interesting features from us.
            </p>
            <Button type="button" asChild 
              className="tracking-normal mt-6 py-6 lg:py-4 h-12 px-12 lg:px-16 text-white font-semibold rounded-lg text-base hover: shadow-blue-300 hover:shadow-xl transition-all outline-none cursor-pointer">
                <Link href="/main">进入系统</Link>
            </Button>
          </div>
          <div className="flex w-full">
              <Image
                src="/assets/ark-image-generate.jpeg"
                alt="VPN Illustrasi"
                quality={100}
                width={612}
                height={383}
                layout="responsive"
              />
          </div>
        </div>

        

        {/* <div className="relative w-full flex">

            {listUser.map((listUsers, index) => (
              <div className="flex mx-auto w-40 sm:w-auto">
                <div className="flex items-center justify-center bg-orange-100 w-12 h-12 mr-6 rounded-full">
                  <img src={listUsers.icon} className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <p className="text-xl text-black-600 font-bold">
                    {listUsers.number}+
                  </p>
                  <p className="text-lg text-black-500">{listUsers.name}</p>
                </div>
              </div>
            ))}
          <div
              className="absolute bg-black-600 opacity-5 w-11/12 roudned-lg h-64 sm:h-48 top-0 mt-8 mx-auto left-0 right-0"
              style={{ filter: "blur(114px)" }}
          ></div>
        </div> */}
      </div>
    </>
  );
}
