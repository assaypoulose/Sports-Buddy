import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import userImg from '../../assets/user.jpg';
import adminImg from '../../assets/admin.jpg';
import HomeCard from "../Cards/HomeCard";

const Home = ({ theme }) => {
  return (
    <div className="flex flex-col gap-12 items-center px-6 py-4 min-h-screen justify-center dark:text-white">
      <div className="flex flex-wrap gap-12 justify-center">
        <Link to="/login/user">
          <HomeCard img={userImg} name="users" theme={theme} />
        </Link>
        <Link to="/login/admin">
          <HomeCard img={adminImg} name="admin" theme={theme} />
        </Link>
      </div>
    </div>
  );
}

export default Home;
