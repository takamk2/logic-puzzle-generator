import DivideByZero from "./DivideByZero.js";
import SplashMountain from "./SplashMountain.js";
import TsubameGaeshi from "./TsubameGaeshi.js";
import PurgeTheCocoon from "./PurgeTheCoccon.js";
import SimpleOverlap from "./SimpleOverlap.js";
import LineLogic from "./LineLogic.js";
import Hypothesis from "./Hypothesis.js";
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
    new SimpleOverlap(direction, index, lPHints, lPCells).execute(),
  (direction, index, lPHints, lPCells) =>
    new LineLogic(direction, index, lPHints, lPCells).execute(),
  (direction, index, lPHints, lPCells) =>
    new Hypothesis(direction, index, lPHints, lPCells).execute()
];
