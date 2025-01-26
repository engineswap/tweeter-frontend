import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import debounce from "lodash.debounce";
import { TweetsScrollable } from '../components/TweetsScrollable';
import { UsersScrollable } from '../components/UsersScrollable';
import { VerticalNavbar } from '../components/NavBar';

const apiPath = 'http://localhost:8080/api'

export function Search() {
    // States: query, user/tweet selector, searchResult
    const [searchType, setSearchType] = useState("tweets");
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    const fetchSearchResults = async (queryArg, st) => {
        console.log(`Searching ${queryArg} in ${st}`);
        try {
            const res = await fetch(apiPath + `/search?type=${st}&query=${queryArg}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                }
            })
            if (res.ok) {
                const jsonRes = await res.json();
                console.log(jsonRes);
                setResults(jsonRes);
            } else {
                console.error(`Error calling /search: ${res.status} - ${res.statusText}`);
            }
        } catch (e) {
            console.log(`Error with search: ${e.message}`);
        }
    };

    // Debounce fetchSearchResults
    let debouncedFetchResults = useCallback(
        debounce((q, s) => fetchSearchResults(q, s), 500), // 500ms delay
        [] // Runs a new debounce if searchType changes
    );
    const handleSearchTypeChange = async (e) => {
        if (!['tweets', 'users'].includes(e.target.value)) return;
        const newSearchType = e.target.value;

        setSearchType(newSearchType);
        setResults([]); // Clear the results when switching types

        // Trigger search with the current query and new search type
        debouncedFetchResults(query, newSearchType);
    };
    const handleQueryChange = async (e) => {
        setQuery(e.target.value);
        if (e.target.value.length > 0) debouncedFetchResults(e.target.value, searchType);
    };

    return (
        <div className='flex h-screen'>
            <VerticalNavbar />
            <div className="min-h-screen flex-1 bg-gray-800 flex flex-col items-center p-6">
                {/* Search Bar and Type Selector */}
                <div className="w-full max-w-md bg-gray-300 p-4 rounded-lg shadow-md">
                    <div className="flex items-center mb-4">
                        <select
                            value={searchType}
                            onChange={handleSearchTypeChange}
                            className="mr-3 p-2 border rounded-md text-gray-700 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="users">Users</option>
                            <option value="tweets">Tweets</option>
                        </select>
                        <input
                            type="text"
                            value={query}
                            onChange={handleQueryChange}
                            placeholder={`Search ${searchType}...`}
                            className="flex-grow p-2 border rounded-md focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>
                <div className="mt-3 w-full flex justify-center">
                    <div className="max-h-[calc(100vh-200px)] overflow-y-auto overflow-x-hidden">
                        {searchType == 'tweets' &&
                            <TweetsScrollable tweets={results} setTweets={setResults} />
                        }
                        {
                            searchType == 'users' &&
                            <UsersScrollable users={results} />
                        }
                    </div>
                </div>
                {/* <div className="mt-3"> */}
                {/*     <div> */}
                {/*         {searchType == 'tweets' && */}
                {/*             <TweetsScrollable tweets={results} setTweets={setResults} /> */}
                {/*         } */}
                {/*         { */}
                {/*             searchType == 'users' && */}
                {/*             <UsersScrollable users={results} /> */}
                {/*         } */}
                {/*     </div> */}
                {/* </div> */}
            </div>
        </div>
    );
}
