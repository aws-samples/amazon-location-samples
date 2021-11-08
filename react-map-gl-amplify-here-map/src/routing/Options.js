import { useContext, useState } from "react";
import { AppContext } from "../AppContext";
import DepartureTimeSelector from "./DepartureTimeSelector";
import ModeOptions from "./ModeOptions";

// Component: Options - Renders the options for the user to select
const Options = () => {
  const context = useContext(AppContext);
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);

  // TODO: complete this function for time
  return (
    // <div className="w-full border border-red-400">
    <div className="w-full">
      {isOptionOpen ? (
        <ModeOptions
          isOptionOpen={isOptionOpen}
          setIsOptionOpen={setIsOptionOpen}
        />
      ) : (
        <DepartureTimeSelector
          isOptionOpen={isOptionOpen}
          setIsOptionOpen={setIsOptionOpen}
        />
      )}
    </div>
  );
};

export default Options;
