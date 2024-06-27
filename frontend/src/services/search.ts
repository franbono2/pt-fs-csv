import { type ApiSearchResponse, Data } from '../types'

const WORKSPACE_URL = 'https://3000-idx-pt-fs-csv-1719482373303.cluster-p6qcyjpiljdwusmrjxdspyb5m2.cloudworkstations.dev/'

export const searchData = async (search: string): Promise<[Error?, Data?]> => {

    try {
        const res = await fetch(WORKSPACE_URL + `api/users?q=${search}`, {
            method: 'GET',
            credentials: 'include'
        })
        if (!res.ok) return [new Error(`Failed to search data: ${res.statusText}`)]
        const json = await res.json() as ApiSearchResponse
        return [undefined, json.data]
    } catch (error) {
        if (error instanceof Error) return [error]
    }

    return [new Error('Unknown error')]
}