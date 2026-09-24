import React from "react";

const Text = () => {
  return (
    <div>
      <section className="text-center pt-6 pb-16 px-4">
        {/* Small Badge */}
        <div className="inline-block rounded-full border border-yellow-300 px-5 py-2">
          <span className="text-sm font-semibold tracking-wide text-orange-600">
            PLATFORM WORKFLOW
          </span>
        </div>

        {/* Main Heading */}
        <h2 className="mt-5 text-4xl md:text-5xl font-extrabold text-[#001f4d]">
          How Synora Works
        </h2>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-7 text-slate-500">
          From a citizen's smartphone to a deployed solution
        </p>
      </section>
    </div>
  );
};

export default Text;
