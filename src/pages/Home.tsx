import { Button } from "@/components/ui/button";
import React from "react";

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <h1>Welcome to Equinxt</h1>
      <p className="text-2xl font-bold text-red-500">
        This is the home page of our application.
      </p>
      <Button className="text-black">Click me</Button>
    </div>
  );
};

export default Home;
