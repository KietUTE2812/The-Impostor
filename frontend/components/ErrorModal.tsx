const ErrorModal = ({ message, onClose }: { message: string; onClose: () => void }) => {
    return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center" style={{ background: 'rgba(0, 0, 0, 0.7)' }}>
        <div
        className="bg-[#1B263B] rounded-xl p-8 max-w-lg w-full text-center"
        style={{
            border: '2px solid rgba(255, 0, 0, 0.3)',
            boxShadow: '0 8px 32px rgba(255, 0, 0, 0.2)',
            animation: 'fadeInScale 0.5s ease-out'
        }}
        >
            <h1
            className="text-4xl font-bold mb-4"
            style={{
                fontFamily: "'Cinzel', serif",
                color: '#FF4C4C',
                textShadow: '0 0 30px rgba(255, 76, 76, 0.8)',
                letterSpacing: '2px'
            }}
            >
            Alert   

            </h1>
        <h3
            className="text-2xl font-bold mb-4 text-pink-300"
            style={{
            fontFamily: "'Cinzel', serif",
            textShadow: '0 0 20px rgba(255, 76, 76, 0.7)',
            letterSpacing: '2px'
            }}
        >
        {message}
        </h3>
        <button
            onClick={onClose}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
            Close
        </button>
        </div>
    </div>
    );
};

export default ErrorModal;