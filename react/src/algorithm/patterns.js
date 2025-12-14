import DivideByZero from "./DivideByZero.js";
import SplashMountain from "./SplashMountain.js";
import TsubameGaeshi from "./TsubameGaeshi.js";
import PurgeTheCocoon from "./PurgeTheCoccon.js";
import Eclipse from "./Eclipse.js";
import Mugen from "./Mugen.js";
import ThirdEye from "./ThirdEye.js";
// import SteppingStoneHolidays from "./SteppingStoneHolidays";
// import NDjamena from "./NDjamena";

export default [
  (direction, index, lPHints, lPCells) =>
    new DivideByZero(direction, index, lPHints, lPCells).execute(),
  (direction, index, lPHints, lPCells) =>
    new SplashMountain(direction, index, lPHints, lPCells).execute(),
  (direction, index, lPHints, lPCells) =>
    new TsubameGaeshi(direction, index, lPHints, lPCells).execute(),
  (direction, index, lPHints, lPCells) =>
    new PurgeTheCocoon(direction, index, lPHints, lPCells).execute(),
  (direction, index, lPHints, lPCells) =>
    new Eclipse(direction, index, lPHints, lPCells).execute(),
  (direction, index, lPHints, lPCells) =>
    new Mugen(direction, index, lPHints, lPCells).execute(),
  (direction, index, lPHints, lPCells) =>
    new ThirdEye(direction, index, lPHints, lPCells).execute()
];
