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

                    <div className="m-0 w-auto" id="menu">
                        <ul className="lg:m-3 max-lg:m-3 text-base text-gray-700 md:flex md:justify-between">
                          
                            <li>
                                <Link
                                    className="p-2 inline sm:text-center py- my-2 hover:text-black hover:bg-blue-200 bg-blue-500 text-white font-medium rounded-lg "
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