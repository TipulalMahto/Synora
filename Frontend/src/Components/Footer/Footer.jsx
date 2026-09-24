import React from "react";
import Partners from "./Partners";
import BottomLine from "./BottomLine";
import Contacts from "./Contacts";
import background from "../../assets/Footer/Background.png"

const Footer = () => {
  return (
    <div className="relative inset-0 overflow-hidden">
      <img
        src={background}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />

      <div className="absolute inset-0 bg-green-950/80 ring-1 ring-inset ring-white/10"></div>

      <div className="relative z-10 top-10">
        <Contacts />
        <Partners />
        <BottomLine />
      </div>
    </div>
  );
};

export default Footer;
