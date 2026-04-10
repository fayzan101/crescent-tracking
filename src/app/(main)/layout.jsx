import Header from "@/components/shared/Header";
import Navbar from "@/components/shared/Navbar";
import Sidebar from "@/components/shared/Sidebar";
import { ClientProvider } from "@/context/clientContext";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex overflow-x-hidden">
      
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen z-30 w-64 shrink-0">
        <Sidebar />
      </aside>

      {/* Main Wrapper */}
      <div className="flex-1 lg:ml-64 min-w-0 flex flex-col">
        
        {/* Navbar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 w-full">
          <Navbar />
        </header>

        {/* Main Content */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-x-hidden">
          
          {/* Center Content Controller */}
          <div className="w-full max-w-400 mx-auto">
            
            {/* Card Container */}
            <div className="bg-[#E3EDF9] rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 min-h-[calc(100vh-110px)]">
              
              <ClientProvider>
                <Header />

                <div className="mt-4 md:mt-6 w-full">
                  {children}
                </div>

              </ClientProvider>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
