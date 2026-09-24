import React from "react";
import Mainbackground from "../../assets/MainBackground.png";
import LeftSide from "./LeftSide/LeftSide";
// import Navbar2 from "../Header/Navbar-2/Navbar2";
import RightSide from "./RightSide/RightSide";


const MainBackground = () => {
  return (
    <section className="relative h-screen w-full">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={Mainbackground}
          alt=""
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            object-center
            scale-105
            blur-[3px]
          "
        />

        {/* Green Overlay */}
        <div className="absolute inset-0 bg-[#006b32]/80" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 ">
        {/* <Navbar2/> */}
        <LeftSide />
        {/* <RightSide/> */}
      </div>

      {/* ================= WAVE ================= */}

      <svg
        className="absolute -bottom-px left-0 z-20 h-[43%] w-full"
        viewBox="0 0 1440 500"
        preserveAspectRatio="none"
      >
        {/* GREEN */}
        <path
          d="
            M0,170
            C180,250 330,360 520,330
            C720,300 760,80 980,70
            C1170,60 1280,160 1440,20
            L1440,500
            L0,500
            Z
          "
          fill="#08752f"
        />

        {/* BLUE */}
        <path
          d="
            M0,225
            C190,300 340,400 530,365
            C730,330 790,125 990,110
            C1180,95 1300,180 1440,65
            L1440,500
            L0,500
            Z
          "
          fill="#249bb5"
        />

        {/* LIGHT GREEN */}
        <path
          d="
            M0,250
            C200,330 350,425 545,390
            C745,350 805,150 1000,135
            C1190,120 1310,205 1440,90
            L1440,500
            L0,500
            Z
          "
          fill="#e1efd9"
        />

        {/* WHITE */}
        <path
          d="
            M0,275
            C210,355 365,455 560,415
            C760,375 820,180 1015,160
            C1200,140 1320,225 1440,115
            L1440,500
            L0,500
            Z
          "
          fill="white"
        />
      </svg>
    </section>
  );
};

export default MainBackground;
