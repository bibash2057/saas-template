import AppSidebar from "#components/sidebar/AppSidebar";
import Navbar from "#components/common/Navbar";
import { ScrollArea } from "#components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "#components/ui/sidebar";
import { Outlet } from "react-router";

const AppLayout = () => {
  return (
    <SidebarProvider className="h-dvh min-h-0">
      <AppSidebar />

      <SidebarInset className="min-h-0 min-w-0">
        <Navbar />

        <ScrollArea className="h-[calc(100dvh-4rem)] w-full">
          <main className="mx-auto w-full max-w-full min-w-0 px-6 pt-4 pb-12">
            <Outlet />
          </main>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;
