import { useParams } from "react-router"
const FileDownload = () => {
    const {id} = useParams()
  return (
    <div>
      <p className="pt-20 h-screen w-screen bg-blue-400 text-white z-40">{id}</p>
    </div>
  )
}

export default FileDownload
