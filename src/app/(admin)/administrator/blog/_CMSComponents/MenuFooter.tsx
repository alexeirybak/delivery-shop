// components/SidebarMenu/MenuFooter.tsx
export default function MenuFooter() {
  return (
    <div className="pt-8 mt-8 border-t border-gray-200/50">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-gray-50 to-white rounded-full shadow-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-gray-600">
            CMS Панель • v1.0
          </span>
        </div>
      </div>
    </div>
  );
}
