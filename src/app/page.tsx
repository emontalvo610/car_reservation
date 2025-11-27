export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Car Reservation System
        </h1>
        <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
          Welcome to the modern car reservation platform
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-3">🚗 Browse Cars</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Explore our wide selection of vehicles
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-3">📅 Book Now</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Easy and fast reservation process
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold mb-3">💼 Manage</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Track and manage your reservations
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}


