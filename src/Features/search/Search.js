import {React, useState, useEffect} from 'react';
import {useNavigate, useSearchParams } from 'react-router-dom';
// Import createSearchParams
// Import useNavigate


export default function Search({ value, onChange }) {
    const [input, setInput] = useState(value);     // <-- define input + setInput
    // get navigate function
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        setInput(value);
    }, [value]);


    const onSearchHandler = (e) => {
        e.preventDefault();

        const q = input.trim();
        onChange(q)

        // Preserve other existing query params while setting `q`
        const nextParams = new URLSearchParams(searchParams);
        if (q) {
            nextParams.set('q', q);
        } else {
            nextParams.delete('q');
        }

        navigate({
        pathname: '.',
        search: `?${nextParams.toString()}`
        },
        { replace: true }
    );
    };

    return (
        <form onSubmit={onSearchHandler} className="search-form">
            <input 
                type="text" 
                className="search" 
                placeholder="Search posts…" 
                aria-label="Search posts"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="search-button" aria-label="Search">
                🔎
            </button>
        </form>
    );
    }

