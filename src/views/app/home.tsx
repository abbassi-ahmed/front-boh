export default function Home() {
  return (
    <div className="flex-1 p-8 ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
          <h2 className="text-xl font-semibold mb-4 text-zinc-100">
            Total Users
          </h2>
          <p className="text-3xl font-bold text-purple-500">1,234</p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
          <h2 className="text-xl font-semibold mb-4 text-zinc-100">
            Active Projects
          </h2>
          <p className="text-3xl font-bold text-purple-500">56</p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
          <h2 className="text-xl font-semibold mb-4 text-zinc-100">Revenue</h2>
          <p className="text-3xl font-bold text-purple-500">$45,678</p>
        </div>
      </div>

      <div className="mt-8 bg-zinc-900 p-6 rounded-lg border border-zinc-800">
        <h2 className="text-xl font-semibold mb-4 text-zinc-100">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border-b border-zinc-800 pb-4">
              <p className="text-zinc-300">User completed task #{item}</p>
              <p className="text-sm text-zinc-500">2 hours ago</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
