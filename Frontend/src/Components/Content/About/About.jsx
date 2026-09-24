import React from "react";
import Text from "./Text";
import Picture from "./Picture";

const About = () => {
  return (
    <section id="about" className="border-y border-gray-200 py-8">

  {/* About Us Heading */}
  <h2 className="mb-10 text-center text-3xl font-bold text-gray-900 underline decoration-green-600 decoration-2 underline-offset-4">
    About Us
  </h2>

  {/* Text + Picture */}
  <div className="mx-auto flex items-center px-4">

    {/* Text */}
    <div className="">
      <Text/>
    </div>

    {/* Picture */}
    <div className="w-[118%] flex justify-start">
    <Picture/>
    </div>

  </div>

</section>
  );
};

export default About;
