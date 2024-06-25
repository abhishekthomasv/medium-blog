import { Link } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';
import { Blog } from '../hooks';
import { useRecoilState } from 'recoil';
import { useEffect, useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import { BACKEND_URL } from '../config';
import axios from 'axios';
import { blogData } from '../recoil/atom/blogAtom';
import { useLocation } from 'react-router-dom';

const Appbar = () => {
  const location = useLocation();
  const shouldSearch = () => {
    return location.pathname === "/blogs";
  };

  
  const [searchTerm, setSearchTerm] = useState<string | null>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [, setBlogs] = useRecoilState<Blog[]>(blogData);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setSearchTerm(formData.get("search") as string);
    e.currentTarget.reset();
    e.currentTarget.querySelector("input")?.focus();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
           
        if (debouncedSearchTerm && debouncedSearchTerm !== "") {
          const searchResponse = await axios.post(
            `${BACKEND_URL}/api/v1/blog/filter`,
            { search: debouncedSearchTerm },
            {
              headers: {
                Authorization: localStorage.getItem("token"),
              },
            }
          );
          setBlogs(searchResponse.data?.posts || []);
        } else {
          const bulkResponse = await axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          });
          setBlogs(bulkResponse.data.posts);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
     
      }
    };

    fetchData();
  }, [debouncedSearchTerm, setBlogs]);

  return (
    <div className="border-b flex justify-between px-10 py-4">
      <div className="flex flex-col justify-center cursor-pointer">
        <Link to={"/blogs"}>
          <div className="font-mono text-md md:text-xl pr-4 md:pr-0">Medium</div>
        </Link>
      </div>
      {shouldSearch() && (
        <form onSubmit={handleSearch} className="min-w-38 md:min-w-80 mx-auto pr-6 md:pr-0">
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only "
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              name="search"
              type="search"
              id="default-search"
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-3xl bg-gray-50 focus: outline-none "
              placeholder="Search for an article.."
              required
            />
            <div
             
              className="hidden md:block text-white absolute end-2.5 bottom-2.5 bg-green-800   focus:outline-none  font-medium rounded-3xl text-sm px-4 py-2 cursor-none"
            >
              Search
            </div>
          </div>
        </form>
      )}  
        <div className="flex">
          <Link to={"/newblog"}>
            <button
              type="button"
              className="hidden md:block text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-4 focus:ring-amber-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 mr-8"
            >
              Publish
            </button>
          </Link>
          <div className="cursor-pointer">
            <ProfileMenu />
          </div>
        </div>
    </div>
  );
};

export default Appbar;
