import Link from "next/link";

export default function Navbar() {
    return (
        <>
            <header>
                <nav
                    className="
          flex flex-wrap
          items-center
          justify-between
          w-full
          py-4
          md:py-0
          px-4
          text-lg text-gray-700
          bg-white
        "
                >
                    <div>
                        <a href="#">
                            <h1>First Next Js</h1>
                        </a>
                    </div>

                    <div className="hidden w-full md:flex md:items-center md:w-auto" id="menu">
                        <ul className="pt-4 text-base text-gray-700 md:flex md:justify-between md:pt-0">
                          
                            <li>
                                <Link
                                    className="md:p-2 py-1 my-2 block hover:text-black hover:bg-blue-200 bg-blue-500 text-white font-medium rounded-lg"
                                    href="/signup"
                                >Sign Up</Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
        </>
    )
}