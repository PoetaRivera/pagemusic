export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl w-full max-w-lg shadow-xl">
        <div className="flex justify-between items-center p-5 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
