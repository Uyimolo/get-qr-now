import logo from "../images/logo.svg";
const Logo = () => {
  return (
    <div className={`flex space-x-1 items-center justify-center`}>
      <img src={logo} alt="" className={`w-8`} />
      <h1 className={`text-blue-400 text-2xl`}>GetQrNow</h1>
    </div>
  );
};

export default Logo;
