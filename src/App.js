
import './App.css';
import OrbitText from './components/OrbitText.js';

function App() {
  return (
    <div>
      <div className="mx-8 my-5 flex justify-between items-center">
        <a href="javascript:window.location.reload();">
          <h1 className="transition-all duration-200 ease-in-out hover:blur-[2px] hover:cursor-wait font-medium text-3xl">webXR</h1>
        </a>
        <a href="https://instagram.com/lucadenhez" target="_blank">
          <div className="transition-all duration-200 ease-in-out flex justify-between items-center gap-x-2 py-2 px-3 rounded-xl bg-black border-2 border-white hover:invert">
            <button className="transition-all duration-200 ease-in-out  text-white font-medium text-xl ">luca denhez</button>
            <img className="pt-[2px]" src={"/icons/arrow.svg"} width={15} height={15} alt={"arrow"}></img>
          </div>
        </a>
      </div>
      <div className="my-5 h-[1.5px] w-full bg-black"></div>
      <div className="flex gap-y-5 flex-col">
        <h1 className="mx-8 text-2xl">cube orbiting</h1>
        <OrbitText />
      </div>
    </div>
  );
}

export default App;
