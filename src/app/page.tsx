import React from 'react';
import Link from 'next/link';
import Navbar from './navbar/page';

export default function Home() {
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-cover bg-center
      antialiased
      bg-gradient-to-r
      from-blue-300
      via-green-300
      to-yellow-200
    ">
      <div className="container mx-auto flex justify-center items-center p-10">
        <div className="max-w-lg text-center">
          <h1 className="text-4xl font-bold">Welcome to our Next Js First Web App</h1>
          <div className="px-4">
      <div
        className="
          flex
          justify-center
          items-center
          bg-white
          mx-auto
          max-w-2xl
          rounded-lg
          my-16
          p-16
          px-8
        "
      >
        <h1 className="text-2xl font-medium">Welcome to our page</h1>
      </div>
    </div>
        </div>
      </div>
    </div>
    </>
  );
}
