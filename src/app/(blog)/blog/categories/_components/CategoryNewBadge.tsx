export default function CategoryNewBadge({ createdAt }: { createdAt: string }) {
  const createdDate = new Date(createdAt);
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  if (createdDate > monthAgo) {
    return (
      <div className="absolute top-3 right-3 z-10 bg-linear-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
        Новое
      </div>
    );
  }

  return null;
}
