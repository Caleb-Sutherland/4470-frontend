import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";

export function HeaderMain() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const handleClick = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="absolute z-10 w-full h-20 flex items-center">
      <div className="w-full text-white flex justify-content-center pl-5 lg:pl-12 items-center flex-row">
        <div className="w-full flex flex-row items-center">
          <Link className="text-3xl font-semibold" to="/">
            votingbuck
          </Link>
          <Link
            className="hidden lg:block lg:ml-24 text-xl font-normal text-opacity-75"
            to="/corporations"
          >
            corporations
          </Link>
          <Link
            className="hidden lg:block lg:ml-12 text-xl font-normal text-opacity-75"
            to="/universities"
          >
            universities
          </Link>
          <Link
            className="hidden lg:block lg:ml-12 text-xl font-normal text-opacity-75"
            to="/politicians"
          >
            politicians
          </Link>
        </div>
        <div className="pr-5">
          <button
            onClick={handleClick}
            className="lg:hidden h-10 -mr-5 px-5"
          >
            <GiHamburgerMenu size="1.5em" color="white" />
          </button>
        </div>
      </div>
      {menuOpen ? (
        <div className="lg:hidden absolute top-20 w-full items-center -mt-1 text-white flex flex-col pb-5 z-50">
          <Link
            className="text-xl font-normal text-opacity-75"
            to="/corporations"
          >
            corporations
          </Link>
          <Link
            className="text-xl font-normal text-opacity-75"
            to="/universities"
          >
            universities
          </Link>
          <Link
            className="text-xl font-normal text-opacity-75"
            to="/politicians"
          >
            politicians
          </Link>
        </div>
      ) : null}
    </header>
  );
}
