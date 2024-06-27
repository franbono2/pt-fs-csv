import { useEffect, useState } from "react"
import { Data } from "../types"
import { searchData } from "../services/search"
import { toast } from "sonner"
import { useDebounce } from "@uidotdev/usehooks"

const DEBOUNCE_TIME = 300

export const Search = ({ initdata }: { initdata: Data }) => {
    const [data, setData] = useState<Data>(initdata)
    const [search, setSearch] = useState(() => {
        const search = new URLSearchParams(window.location.search).get('q')
        return search ?? ''
    })
    const debouncedSearch = useDebounce(search, DEBOUNCE_TIME)

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    useEffect(() => {
        const pathName = debouncedSearch === '' ? window.location.pathname : `?q=${debouncedSearch}`
        window.history.pushState({}, document.title, pathName)
    }, [debouncedSearch])

    useEffect(() => {
        if (!debouncedSearch){
            setData(initdata)
            return
        } 
        searchData(debouncedSearch).then(response => {
            const [err, data] = response
            console.log({ err, data })
            if (err) {
                toast.error(err.message)
                return
            }
            if (data) setData(data)
            toast.success('Search successfully')
        })
    }, [debouncedSearch, initdata])

    return (
        <div>
            <h1>Search</h1>
            <form action="">
                <input
                    type="search"
                    placeholder="Buscar datos"
                    onChange={handleSearch}
                    defaultValue={search}
                />
            </form>
            <ul>
                {
                    data.map(user => (
                        <li key={user.id}>
                            <article>
                                {
                                    Object.entries(user).map(([key, value]) => (
                                        <p key={key}><strong>{key}: </strong>{value}</p>
                                    ))
                                }
                            </article>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}