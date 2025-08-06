export default function AboutPage() {
  return (
    <main className="bg-green-100 min-h-screen py-12">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-extrabold text-black mb-12">About Us</h1>

        <div className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
          {/* Card 1 */}
          <div className="border-4 border-green-700 rounded-xl p-4 bg-white shadow-md transition-transform transform hover:scale-105 hover:shadow-xl">
            <img
              src="https://via.placeholder.com/150"
              alt="Person 1"
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-bold text-black mb-2">Anannaya</h2>
            <p className="text-gray-700 text-sm">
              Passionate about sustainability and eco-friendly innovations.
            </p>
          </div>

          {/* Card 2 */}
          <div className="border-4 border-green-700 rounded-xl p-4 bg-white shadow-md transition-transform transform hover:scale-105 hover:shadow-xl">
            <img
              src="https://via.placeholder.com/150"
              alt="Person 2"
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-bold text-black mb-2">Ishita</h2>
            <p className="text-gray-700 text-sm">
              Developer and researcher focused on green technology.
            </p>
          </div>

          {/* Card 3 */}
          <div className="border-4 border-green-700 rounded-xl p-4 bg-white shadow-md transition-transform transform hover:scale-105 hover:shadow-xl">
            <img
              src="https://via.placeholder.com/150"
              alt="Person 3"
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-bold text-black mb-2">Loheyta</h2>
            <p className="text-gray-700 text-sm">
              Designer dedicated to creating user-friendly interfaces for eco apps.
            </p>
          </div>

          {/* Card 4 */}
          <div className="border-4 border-green-700 rounded-xl p-4 bg-white shadow-md transition-transform transform hover:scale-105 hover:shadow-xl">
            <img
              src="https://via.placeholder.com/150"
              alt="Person 4"
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-bold text-black mb-2">Prisha</h2>
            <p className="text-gray-700 text-sm">
              Environmental analyst supporting data-driven sustainability.
            </p>
          </div>

          {/* Card 5 */}
          <div className="border-4 border-green-700 rounded-xl p-4 bg-white shadow-md transition-transform transform hover:scale-105 hover:shadow-xl">
            <img
              src="https://via.placeholder.com/150"
              alt="Person 2"
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-bold text-black mb-2">Sakshi</h2>
            <p className="text-gray-700 text-sm">
              Developer and researcher focused on green technology.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
