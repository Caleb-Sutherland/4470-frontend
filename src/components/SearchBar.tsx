import React, { useState } from "react";
import { MdSearch } from "react-icons/md";
import { Link } from "react-router-dom";

export function SearchBar() {
  const [queryResults, setQueryResults] = useState<any>(null);
  const [cursor, setCursor] = useState<number>(-1);
  const [cursorLinkPath, setCursorLinkPath] = useState<string>("");

  const handleKeyDown = (e: any) => {
    if (e.keyCode === 38) {
      e.preventDefault();
      setCursor(
        cursor < 0
          ? queryResults.politicians.length +
              queryResults.corporates.length +
              queryResults.universities.length -
              1
          : cursor - 1
      );
    } else if (e.keyCode === 40) {
      e.preventDefault();
      setCursor(
        cursor ==
          queryResults.politicians.length +
            queryResults.corporates.length +
            queryResults.universities.length -
            1
          ? -1
          : cursor + 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (cursor > -1) {
        goToPage(cursorLinkPath);
      }
    }
  };

  const goToPage = (path: string) => {
    window.open(path, "_self");
  };

  const handleChange = async (event: any) => {
    setCursor(-1);
    setCursorLinkPath("");
    event.target.value = event.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/search/${event.target.value}`
    );
    const data = await res.json();

    let remainingSpaces = 6;
    let pIndex = 0;
    let cIndex = 0;
    let uIndex = 0;
    const finalPoliticians: any = [];
    const finalCorporates: any = [];
    const finalUniversities: any = [];

    while (
      remainingSpaces > 0 &&
      (data.politicians[pIndex] ||
        data.corporates[cIndex] ||
        data.universities[uIndex])
    ) {
      if (data.politicians[pIndex]) {
        finalPoliticians.push(data.politicians[pIndex]);
        remainingSpaces--;
        pIndex++;
      }
      if (remainingSpaces > 0 && data.corporates[cIndex]) {
        finalCorporates.push(data.corporates[cIndex]);
        remainingSpaces--;
        cIndex++;
      }
      if (remainingSpaces > 0 && data.universities[uIndex]) {
        finalUniversities.push(data.universities[uIndex]);
        remainingSpaces--;
        uIndex++;
      }

      const finalData = {
        politicians: finalPoliticians,
        corporates: finalCorporates,
        universities: finalUniversities,
        pCount: data.politicians.length,
        cCount: data.corporates.length,
        uCount: data.universities.length,
      };

      setQueryResults(finalData);
    }
  };

  return (
    <div className="relative">
      <div className="w-72 placeholder-blueGray300 text-blueGray600 relative bg-white bg-white text-xs shadow-lg rounded-lg flex items-center">
        <MdSearch size={16} className="text-gray-700 ml-4" />
        <input
          type="text"
          onChange={handleChange}
          onFocus={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            setCursor(-1);
            setQueryResults(null);
          }}
          onClick={() => setCursor(-1)}
          placeholder="Corporations, universities or politicians"
          className="w-full px-3 py-3 rounded-lg border-blueGray300 outline-none focus:outline-none"
        />
      </div>
      {queryResults ? (
        <div className="absolute top-12 w-72 px-0 py-3 text-blueGray600 bg-white bg-white text-sm outline-none shadow-lg rounded-lg z-50">
          {queryResults.politicians.length > 0 ? (
            <div>
              <p className="px-3">POLITICIANS</p>
            </div>
          ) : null}
          {queryResults.politicians.map((item: any, index: number) => {
            if (
              cursor == index &&
              cursorLinkPath != "/politicians/" + item.value.id
            ) {
              setCursorLinkPath("/politicians/" + item.value.id);
            }
            return (
              <div
                key={index}
                onMouseDown={(e) => e.preventDefault()}
                onMouseUp={() => goToPage("/politicians/" + item.value.id)}
                className={
                  "cursor-pointer pl-8 pr-3 py-1 " +
                  (cursor == index ? "bg-searchHover" : "")
                }
                onMouseEnter={() => setCursor(index)}
                onMouseLeave={() => setCursor(-1)}
              >
                <p>{item.value.name}</p>
              </div>
            );
          })}
          {queryResults.corporates.length > 0 ? (
            <div>
              <p className="px-3">CORPORATIONS</p>
            </div>
          ) : null}
          {queryResults.corporates.map((item: any, index: number) => {
            if (
              cursor == queryResults.politicians.length + index &&
              cursorLinkPath != "/corporations/" + item.value.id
            ) {
              setCursorLinkPath("/corporations/" + item.value.id);
            }
            return (
              <div
                key={index}
                onMouseDown={(e) => e.preventDefault()}
                onMouseUp={() => goToPage("/corporations/" + item.value.id)}
                className={
                  "cursor-pointer pl-8 pr-3 py-1 " +
                  (cursor == queryResults.politicians.length + index
                    ? "bg-searchHover"
                    : "")
                }
                onMouseEnter={() =>
                  setCursor(queryResults.politicians.length + index)
                }
                onMouseLeave={() => setCursor(-1)}
              >
                <p>{item.value.name}</p>
              </div>
            );
          })}
          {queryResults.universities.length > 0 ? (
            <div>
              <p className="px-3">UNIVERSITIES</p>
            </div>
          ) : null}
          {queryResults.universities.map((item: any, index: number) => {
            if (
              cursor ==
                queryResults.politicians.length +
                  queryResults.corporates.length +
                  index &&
              cursorLinkPath != "/universities/" + item.value.id
            ) {
              setCursorLinkPath("/universities/" + item.value.id);
            }
            return (
              <div
                key={index}
                onMouseDown={(e) => e.preventDefault()}
                onMouseUp={() => goToPage("/universities/" + item.value.id)}
                className={
                  "cursor-pointer pl-8 pr-3 py-1 " +
                  (cursor ==
                  queryResults.politicians.length +
                    queryResults.corporates.length +
                    index
                    ? "bg-searchHover"
                    : "")
                }
                onMouseEnter={() =>
                  setCursor(
                    queryResults.politicians.length +
                      queryResults.corporates.length +
                      index
                  )
                }
                onMouseLeave={() => setCursor(-1)}
              >
                <p>{item.value.name}</p>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
