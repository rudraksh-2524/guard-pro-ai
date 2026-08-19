import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RoleArea } from "@/components/layout/role-guard";
import { ADMIN_NAV } from "@/constants";

export const Route = createFileRoute("/admin")({
  ssr: false,
  component: AdminArea,
});

function AdminArea() {
  return (
    <RoleArea role="admin" roleLabel="Administration" nav={ADMIN_NAV} mobileNavCount={4}>
      <Outlet />
    </RoleArea>
  );
}