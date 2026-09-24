import React from "react";
import AboutImg from "../../../assets/Content/About.png"

const Picture = () => {
  return (
   <div className="relative w-full h-175 overflow-hidden">

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 900 700"
        preserveAspectRatio="xMidYMid meet"
      >

        <defs>

          {/* IMAGE CLIP */}
          <clipPath id="imageClip">
            <path
              d="
                M 300 175
                C 360 120 415 135 460 90
                C 510 40 565 30 620 60
                C 685 95 735 145 750 205
                C 765 265 745 305 795 345
                C 830 375 840 420 805 460
                C 770 500 725 515 700 565
                C 670 620 620 645 565 620
                C 510 595 465 610 410 625
                C 345 640 305 600 310 545
                C 315 495 280 460 245 415
                C 210 360 225 305 195 270
                C 170 230 220 195 300 175
                Z
              "
            />
          </clipPath>

        </defs>


        {/* 1. OUTER LIGHT GREEN CURVE */}
        <path
          d="
            M 275 145
            C 345 80 410 110 455 55
            C 515 -5 585 5 650 50
            C 725 105 780 160 795 230
            C 815 300 855 350 850 420
            C 845 500 770 535 735 600
            C 700 665 620 690 550 650
            C 470 610 400 675 320 625
            C 260 585 270 500 230 450
            C 180 390 195 315 165 275
            C 135 230 190 175 275 145
            Z
          "
          fill="#D9F1E7"
        />


        {/* 2. BLUE CURVE */}
        <path
          d="
            M 225 195
            C 300 155 355 165 405 120
            C 455 75 525 70 580 105
            C 650 145 720 180 750 240
            C 780 305 760 350 800 395
            C 825 430 790 475 735 510
            C 685 540 675 605 615 635
            C 550 660 490 615 425 600
            C 350 585 290 615 255 560
            C 220 510 250 450 210 400
            C 165 345 165 250 225 195
            Z
          "
          fill="#2563A8"
        />


        {/* 3. MAIN GREEN CURVE */}
        <path
          d="
            M 285 160
            C 350 100 415 120 460 75
            C 510 25 570 15 625 50
            C 695 90 745 140 760 205
            C 775 270 755 310 805 350
            C 845 385 855 430 820 470
            C 780 510 735 525 710 580
            C 680 640 625 665 565 635
            C 505 605 460 620 405 640
            C 335 660 285 610 295 555
            C 305 500 270 465 235 420
            C 195 365 215 300 185 265
            C 155 225 205 190 285 160
            Z
          "
          fill="#075B20"
        />


        {/* 4. IMAGE — CURVE KE ANDAR */}
        <image
          href={AboutImg}
          x="35"
          y="55"
          width="720"
          height="570"
          preserveAspectRatio="xMidYMid meet"
          clipPath="url(#imageClip)"
        />

      </svg>

    </div>
  );
};

export default Picture;
