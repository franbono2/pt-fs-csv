import { useState } from 'react'
import './App.css'
import { uploadFile } from './services/upload'
import { Toaster, toast } from 'sonner'
import { Data } from './types'
import { Search } from './steps/Search'

const APP_STATUS = {
  IDLE: 'IDLE',
  FILE_UPLOAD: 'FILE_UPLOAD',
  UPLOADING: 'UPLOADING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
} as const

const BUTTON_TEXT = {
  [APP_STATUS.FILE_UPLOAD]: 'Upload',
  [APP_STATUS.UPLOADING]: 'Uploading',
} as const

type AppStatus = typeof APP_STATUS[keyof typeof APP_STATUS] // 'IDLE' | 'FILE_UPLOAD' | 'UPLOADING' | 'SUCCESS' | 'ERROR' | ...

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [userData, setUserData] = useState<Data>([])
  const [status, setStatus] = useState<AppStatus>(APP_STATUS.IDLE)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = e.target.files ?? []
    if (file) {
      setFile(file)
      setStatus(APP_STATUS.FILE_UPLOAD)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status !== APP_STATUS.FILE_UPLOAD || !file) return

    setStatus(APP_STATUS.UPLOADING)
    const [err, data] = await uploadFile(file)
    console.log({ err, data })

    if (err) {
      setStatus(APP_STATUS.ERROR)
      toast.error(err.message)
      return
    }

    if (data) setUserData(data)
    setStatus(APP_STATUS.SUCCESS)
    toast.success('File uploaded successfully')
  }

  const showUploadButton = status === APP_STATUS.FILE_UPLOAD || status === APP_STATUS.UPLOADING
  const showInput = status !== APP_STATUS.SUCCESS

  return (
    <>
      <Toaster />
      <h1>Challenge: Upload CSV + Search</h1>
      {showInput &&
        <form onSubmit={handleSubmit}>
          <label>
            <input
              disabled={status === APP_STATUS.UPLOADING}
              name="file"
              type="file"
              onChange={handleInputChange}
              accept=".csv"
            />
          </label>
          {showUploadButton &&
            <button disabled={status === APP_STATUS.UPLOADING}>
              {BUTTON_TEXT[status]}
            </button>
          }
        </form>
      }
      {status === APP_STATUS.SUCCESS &&
        <Search initdata={userData}/>
      }
    </>
  )
}

export default App
