import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RoleArea } from "@/components/layout/role-guard";
import { STUDENT_NAV } from "@/constants";

export const Route = createFileRoute("/student")({
  ssr: false,
  component: StudentArea,
});

function StudentArea() {
  return (
    <RoleArea role="student" roleLabel="Candidate portal" nav={STUDENT_NAV} mobileNavCount={4}>
      <Outlet />
    </RoleArea>
  );
}