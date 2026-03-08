import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react"
import { useEffect } from "react"

export default function PopUp({ type = "success", message, onClose }) {

  const styles = {
    success: {
      icon: <CheckCircle size={22} />,
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200"
    },
    error: {
      icon: <XCircle size={22} />,
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200"
    },
    warning: {
      icon: <AlertTriangle size={22} />,
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-200"
    }
  }

  const style = styles[type]

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed top-6 right-6 z-50 animate-slideIn">

      <div className={`flex items-center gap-3 p-4 rounded-lg border shadow-md ${style.bg} ${style.border}`}>

        <div className={`${style.text}`}>
          {style.icon}
        </div>

        <p className={`text-sm font-medium ${style.text}`}>
          {message}
        </p>

        <button onClick={onClose}>
          <X size={16} className="text-gray-500"/>
        </button>

      </div>

    </div>
  )
}