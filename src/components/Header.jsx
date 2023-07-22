import menu from "../images/icon-menu.svg";

const Header = () => {
  return (
    <header className="flex items-center z-10 justify-between px-6 py-4 fixed top-0 left-0 w-full border-b-4 border-blue-400 bg-[#26282b]">
      <div className="">
        <h1 className="text-white text-2xl">GetQrNow</h1>
      </div>

      <div className="">
        <img src={menu} alt="menu" />
      </div>
    </header>
  );
};

export default Header;
