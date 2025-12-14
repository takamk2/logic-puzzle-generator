import DivideByZero from "./DivideByZero";
import SplashMountain from "./SplashMountain";
import TsubameGaeshi from "./TsubameGaeshi";
import PurgeTheCocoon from "./PurgeTheCoccon";
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
    new PurgeTheCocoon(direction, index, lPHints, lPCells).execute()
];
