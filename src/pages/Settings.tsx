import TabDetails from "@/components/settings/components/TabDetails";
import Sidebar from "@/components/settings/components/Sidebar";

export default function Settings() {
  return (
    <div className="flex-1 min-h-0 flex flex-col md:grid md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full max-w-6xl mx-auto mt-7 pb-4 md:mt-17 md:pb-14 overflow-y-auto scrollbar-none px-4 md:px-8 lg:px-10">
      <Sidebar />
      <TabDetails />
    </div>
  );
}
