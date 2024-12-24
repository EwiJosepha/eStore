"use client"
export default () => {

  return (
    <footer className=" bg-black  px-10 md:h-[600px] h-[480px] flex flex-col gap-8">
      <div className="gap-6 justify-between sm:flex sm:items-start pt-8">
        <div className=" flex flex-col gap-4">
          <div className="max-w-md flex flex-col gap-4">
            <p className="text-white mt-2 font-bold lg:text-2xl text-lg">NEWSLETTER</p>
            <p className="text-gray-300 pb-2 lg:text-2xl text-lg">Sign up and get exclusive discount</p>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="border-1 gap-4 flex flex-col">
              <input
                type="email"
                placeholder="E-mail"
                className="w-full lg:p-3 p-2 outline-none bg-gray-200"
              />
              <button className="lg:p-4 p-1 text-white text-sm md:text-1xl bg-gray-800 outline-none shadow-md focus:shadow-none sm:px-5 w-[50%]">
                SUBSCRIBE
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col justify-between sm:flex md:space-y-0 md:mt-0 pt-4 md:pt-0">
          <p className="text-white mt-2 font-bold md:pb-2 lg:text-2xl text-lg">Footers Menu</p>
          <div className="flex flex-col  text-gray-300 gap-4">
            <p className=" hover:text-gray-600 cursor-pointer  text-lg">Contact Us</p>
            <p className=" hover:text-gray-600 cursor-pointe  text-lg">Search</p>
          </div>
        </div>
      </div>
      <div className="mt-8 lg:py-3 border-t items-center justify-between sm:flex">
        <div className="mt-4 sm:mt-0 text-gray-600 lg:text-2xl text-lg">
          &copy; {new Date(Date.now()).getFullYear()} - PRESTIGE ATTIRE.
        </div>
      </div>
    </footer>
  )
}
