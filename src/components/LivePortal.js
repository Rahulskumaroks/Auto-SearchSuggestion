import React, { useState, useEffect } from "react";
import axios from "axios";
import { EllipsisVertical } from "lucide-react";
import { Star } from "lucide-react";

export default function LivePortal() {
  const [search, setSearch] = useState(null);
  const PAGE_SIZE = 10;
  const [searchList, setSearchList] = useState([]);
  const [count, setCount] = useState(0);
  const [serachType, setSerachTyped] = useState(false);
  const [cache, setCache] = useState({});

  const getProduct = async () => {
    if (cache[search]) {
      console.log("Cached", cache);
      setSearchList(cache[search]);
      return;
    }
    await axios
      .get(`https://dummyjson.com/recipes/search?q=${search}`)
      .then((res) => {
        setSearchList(res.data?.recipes);
        setCount(res.data?.total);
        setCache((prev) => ({ ...prev, [search]: res.data?.recipes }));
      });
  };

  useEffect(() => {
    const timer = setTimeout(getProduct, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  return (
    <>
      <div className="p-4">
        <div className="flex relative text-sm justify-center items-center">
          <div className="flex space-x-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSerachTyped(true)}
              onBlur={() => setSerachTyped(false)}
              type="text"
              placeholder="Search..."
              className={`w-80 p-2 ${
                serachType ? "rounded-hidden" : ""
              }  focus:border-green-600 border rounded`}
            ></input>
            <button className="border  hover:bg-green-500 hover:text-white p-2 rounded-lg bg-transparent text-black">
              Search
            </button>
          </div>
        </div>
        {serachType && (
          <div className="overflow-y-auto w-80 absolute  rounded max-h-48 border ">
            {searchList.map((item) => (
              <div
                onClick={() => {
                  setSearch(item?.name);
                  setSearchList([]);
                }}
                className="border max-w-80 p-2 hover:bg-green-200 cursor-pointer "
                key={item?.id}
              >
                <div className="flex items-center space-x-4">
                  <span className="text-xs font-semibold text-green-400 ">
                    {item?.name}
                  </span>
                  <span>
                    <img
                      className="rounded-full w-8 h-8 border"
                      src={item?.image}
                    />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
