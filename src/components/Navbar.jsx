
import React, { useEffect, useState } from "react";

const Navbar = ({ showLogin }) => {
  /**
   * @type {[{
   *  heroku?: string;
   *  google_cloud?: string;
   *  vercel?: string;
   *  github?: string;
   *  }, React.Dispatch<any>]}
   */
  return (
    <nav className="navbar navbar-expand-lg navbar-light d-flex justify-content-between">
      <span className="navbar-brand">Chat Application</span>
      {showLogin? <a href="https://https://github.com/trungIsOnGithhub">Github</a> : <></>}
    </nav>
  );
};

export default Navbar;
