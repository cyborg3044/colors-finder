import { useEffect, useState } from "react";
import "./App.css";
import ColourTable from "./components/ColourTable";
import {
  hexToRgb,
  hexToHsl,
  sortWithClusters,
  searchColorsInClusters,
  isValidColour,
  convertToHex,
} from "./Utils";
import { API_URL, KEY } from "./constants";

function App() {
  const [colours, setColours] = useState(null);
  const [sortedColors, setSortedColours] = useState(null);
  const [searchString, setSearchString] = useState("");
  const [error, setError] = useState({
    isInvalidColour: false,
    isFetchFailed: false,
  });

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        const colorsData = data.colors.map((obj) => {
          return { ...obj, RGB: hexToRgb(obj.hex), HSL: hexToHsl(obj.hex) };
        });

        setColours(colorsData);
        setSortedColours(sortWithClusters(colorsData));
      });
  }, []);

  const resetError = () => {
    setError({ isInvalidColour: false, isFetchFailed: false });
  };

  const handleEnter = (event) => {
    if (event.key === KEY) {
      let searchString = event.target.value;
      if (isValidColour(searchString) === true) {
        resetError();
        searchString = convertToHex(searchString);
        if (searchString !== "") {
          const searchResults = searchColorsInClusters(
            sortedColors,
            searchString
          );
          setColours(searchResults);
          setSearchString(searchString);
        } else {
          setError({ ...error, isInvalidColour: true });
        }
      } else {
        setError({ ...error, isInvalidColour: true });
      }
    }
  };

  return (
    <div className="App">
      <header className="Header">Colour Searcher</header>
      <div className="Input">
        <label className="Input-label">Colour</label>
        <input
          type="text"
          placeholder="Enter Colour"
          disabled={colours === null ? true : false}
          onKeyDown={handleEnter}
        ></input>
      </div>
      {error.isInvalidColour && <div className="Error">Invalid CSS color</div>}
      {searchString !== "" && (
        <div className="Result">Results for "{searchString}"</div>
      )}
      <div className="Colours">
        {colours === null ? (
          <div>loading</div>
        ) : (
          <div>
            <ColourTable colours={colours}></ColourTable>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
