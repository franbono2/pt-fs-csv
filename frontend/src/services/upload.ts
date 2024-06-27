import { ApiUploadResponse, type Data } from '../types'

const WORKSPACE_URL = 'https://3000-idx-pt-fs-csv-1719482373303.cluster-p6qcyjpiljdwusmrjxdspyb5m2.cloudworkstations.dev/'

export const uploadFile = async (file: File): Promise<[Error?, Data?]> => {
    const formData = new FormData()
    formData.append('file', file)

    try {
        const res = await fetch(WORKSPACE_URL + 'api/files', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        })
        if (!res.ok) return [new Error(`Failed to upload file: ${res.statusText}`)]
        const json = await res.json() as ApiUploadResponse
        return [undefined, json.data]
    } catch (error) {
        if (error instanceof Error) return [error]
    }

    return [new Error('Unknown error')]
}