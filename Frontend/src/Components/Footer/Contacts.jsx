import React from "react";

const Contacts = () => {
  return (
    <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-3">

  {/* Address */}
  <div className="flex flex-col items-center">

    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400">
      <span className="text-xl text-blue-700">⌖</span>
    </div>

    <h3 className="mb-3 text-2xl font-bold">
      Address
    </h3>

    <p className="max-w-md text-base leading-6">
      143 Pharachanch, Sarukudar, Bishnugarh, Hazaribagh, Jharkhand-825312
    </p>

  </div>


  {/* Help Line */}
  <div className="flex flex-col items-center">

    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500">
      <span className="text-xl">☎</span>
    </div>

    <h3 className="mb-3 text-2xl font-bold">
      Help Line
    </h3>

    <p className="text-base">
      9934744533
    </p>

  </div>


  {/* Email */}
  <div className="flex flex-col items-center">

    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500">
      <span className="text-xl">✉</span>
    </div>

    <h3 className="mb-3 text-2xl font-bold">
      Email
    </h3>

    <p className="text-base">
      tipulalmahto012@gmail.com
    </p>

  </div>

</div>
  );
};

export default Contacts;
