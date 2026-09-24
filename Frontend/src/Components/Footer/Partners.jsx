import React from "react";
import tata from "../../assets/Footer/Tata.png"
import cit from "../../assets/Footer/CitLogo.png"
import JharkhandLogo from "../../assets/logo.png"

const Partners = () => {
  return (
    <div className="mx-auto mt-16 max-w-6xl">
      <h2
        className="
      mb-10 text-center
      text-2xl font-bold md:text-3xl
    "
      >
        Our Knowledge Partners
      </h2>

      <div
        className="
      grid grid-cols-1 gap-12
      md:grid-cols-3
      items-start
    "
      >
        {/* Jharkhand Government */}
        <div className="flex flex-col items-center text-center">
          <div
            className="
          flex h-24 items-center justify-center
          w-full
        "
          >
            <img
              src={JharkhandLogo}
              alt="Government of Jharkhand"
              className="h-20 w-auto object-contain"
            />
          </div>

          <h3
            className="
          mt-5 max-w-xs
          text-base font-bold leading-6
        "
          >
            Government of Jharkhand
          </h3>
        </div>

        {/* Tata Steel Foundation */}
        <div className="flex flex-col items-center text-center">
          <div
            className="
          flex h-24 items-center justify-center
          w-full
        "
          >
            <img
              src={tata}
              alt="Tata Steel Foundation"
              className="h-20 w-auto object-contain"
            />
          </div>

          <h3
            className="
          mt-5 max-w-xs
          text-base font-bold leading-6
        "
          >
            Tata Steel Foundation
          </h3>
        </div>

        {/* CIT Ranchi */}
        <div className="flex flex-col items-center text-center">
          <div
            className="
          flex h-24 items-center justify-center
          w-full
        "
          >
            <img
              src={cit}
              alt="CIT Ranchi"
              className="h-20 w-auto object-contain"
            />
          </div>

          <h3
            className="
          mt-5 max-w-xs
          text-base font-bold leading-6
        "
          >
            Cambridge Institute of Technology, Ranchi
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Partners;
