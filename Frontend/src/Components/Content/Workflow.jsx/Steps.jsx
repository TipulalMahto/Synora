import React from "react";

const Steps = () => {
  return (
    <section className="px-6 pb-10">
      <div className="relative mx-auto max-w-7xl">
        {/* Connecting Line */}
        <div className="absolute top-15 right-[8%] left-[8%] hidden h-px bg-linear-to-r from-green-300 via-blue-300 to-orange-300 lg:block" />

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* STEP 01 */}
          <div className="rounded-2xl border border-slate-200 bg-white px-8 py-8 text-center shadow-sm">
            <div className="mx-auto flex size-18 items-center justify-center rounded-2xl bg-green-600 shadow-md">
              <span className="text-3xl text-white">⌖</span>
            </div>

            <p className="mt-5 text-sm font-bold tracking-wide text-green-700">
              STEP 01
            </p>

            <h3 className="mt-3 text-xl font-bold text-slate-900">
              Citizen Submits
            </h3>

            <p className="mt-5 text-[17px] leading-7 text-slate-500">
              Upload photos, voice notes, or video with precise geo-location via
              our mobile-first portal.
            </p>
          </div>

          {/* STEP 02 */}
          <div className="rounded-2xl border border-slate-200 bg-white px-8 py-8 text-center shadow-sm">
            <div className="mx-auto flex size-18 items-center justify-center rounded-2xl bg-blue-600 shadow-md">
              <span className="text-3xl text-white">⚙</span>
            </div>

            <p className="mt-5 text-sm font-bold tracking-wide text-blue-700">
              STEP 02
            </p>

            <h3 className="mt-3 text-xl font-bold text-slate-900">
              Verification
            </h3>

            <p className="mt-5 text-[17px] leading-7 text-slate-500">
              The government verifies reports and groups similar ones by priority.
            </p>
          </div>

          {/* STEP 03 */}
          <div className="rounded-2xl border border-slate-200 bg-white px-8 py-8 text-center shadow-sm">
            <div className="mx-auto flex size-18 items-center justify-center rounded-2xl bg-purple-600 shadow-md">
              <span className="text-3xl text-white">🎓</span>
            </div>

            <p className="mt-5 text-sm font-bold tracking-wide text-purple-700">
              STEP 03
            </p>

            <h3 className="mt-3 text-xl font-bold text-slate-900">
              University R&amp;D
            </h3>

            <p className="mt-5 text-[17px] leading-7 text-slate-500">
              HEIs form multidisciplinary teams, submit proposals, and earn NEP
              2020 experiential credits.
            </p>
          </div>

          {/* STEP 04 */}
          <div className="rounded-2xl border border-slate-200 bg-white px-8 py-8 text-center shadow-sm">
            <div className="mx-auto flex size-18 items-center justify-center rounded-2xl bg-orange-600 shadow-md">
              <span className="text-3xl text-white">▤</span>
            </div>

            <p className="mt-5 text-sm font-bold tracking-wide text-orange-700">
              STEP 04
            </p>

            <h3 className="mt-3 text-xl font-bold text-slate-900">
              Industry &amp; CSR
            </h3>

            <p className="mt-5 text-[17px] leading-7 text-slate-500">
              Corporate sponsors fund prototypes through CSR Section 135, and
              deploy proven solutions at scale.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Steps;
