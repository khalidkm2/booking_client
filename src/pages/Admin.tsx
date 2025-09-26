
const Admin = () => {
  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col items-center justify-center font-serif px-4">
      <div className="max-w-3xl w-full text-center p-12 bg-[#2a2a2a] border-4 border-yellow-800 rounded-2xl shadow-2xl">
        <h1 className="text-5xl md:text-6xl font-bold text-[#d4af37] mb-4 drop-shadow-lg tracking-wide">
          🎬 Admin Dashboard
        </h1>
        <p className="text-yellow-100 text-lg md:text-xl mb-6">
          Coming soon… stay tuned for management features.
        </p>
        <div className="inline-block px-6 py-3 bg-yellow-900 text-yellow-50 font-semibold rounded-lg shadow-lg border-2 border-yellow-700 hover:bg-yellow-800 transition">
          ✨ Vintage Mode Active
        </div>
      </div>
    </div>
  );
}

export default Admin;
