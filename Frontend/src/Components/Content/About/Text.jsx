import React from "react";

const Text = () => {
  return (
    <div className="w-full lg:w-1/2 ml-10">

          <h5 className="text-2xl font-bold leading-tight text-gray-900 md:text-2xl">
            Turning Challenges Into
            <span className="text-green-700"> Opportunities</span>
          </h5>

          <div className="mt-6 space-y-5 text-base leading-7 text-gray-600 md:text-lg">

            <p>
              Synora is a digital platform that connects citizens,
              universities, industries, and government bodies to identify
              real-world challenges and work together towards meaningful
              solutions.
            </p>

            <p>
              Citizens can report local problems, share ideas, and track
              progress, while universities and industry partners can
              collaborate on innovative solutions that create measurable
              social impact.
            </p>

            <p>
              By bringing these stakeholders together, the platform aims to
              transform grassroots challenges into opportunities for
              innovation, research, and sustainable development.
            </p>

          </div>

        </div>
  );
};

export default Text;
