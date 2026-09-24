import React from 'react'

const StatsBox = () => {
  return (
    <div className=''>
        <div className=" ml-15 mr-15 mt-5 mb-25 border mx-auto flex max-w-275 rounded-3xl bg-white px-8 py-6 shadow-sm">

  {/* Item 1 */}
  <div className="flex flex-1 items-center gap-4 border-r border-slate-200">
    <div className="text-3xl text-[#151044]">♙</div>

    <div>
      <h3 className="text-xl font-bold text-[#10264d]">
        1.8+ lakh
      </h3>

      <p className="text-sm text-slate-500">
        Grievances Redressed
      </p>
    </div>
  </div>

  {/* Item 2 */}
  <div className="flex flex-1 items-center gap-4 border-r border-slate-200 px-7">
    <div className="text-3xl text-[#151044]">▦</div>

    <div>
      <h3 className="text-xl font-bold text-[#10264d]">
        91+ Departments
      </h3>

      <p className="text-sm text-slate-500">
        Jharkhand Ministries & Bodies
      </p>
    </div>
  </div>

  {/* Item 3 */}
  <div className="flex flex-1 items-center gap-4 border-r border-slate-200 px-7">
    <div className="text-3xl text-[#151044]">♜</div>

    <div>
      <h3 className="text-xl font-bold text-[#10264d]">
        1,109
      </h3>

      <p className="text-sm text-slate-500">
        Connected Bodies & Depts
      </p>
    </div>
  </div>

  {/* Item 4 */}
  <div className="flex flex-1 items-center gap-4 pl-7">
    <div className="text-3xl text-[#151044]">🤝</div>

    <div>
      <h3 className="text-xl font-bold text-[#10264d]">
        For a Better Jharkhand
      </h3>

      <p className="text-sm text-slate-500">
        Your Voice may solve
        <br />
        major Problem
      </p>
    </div>
  </div>

</div>
    </div>
  )
}

export default StatsBox