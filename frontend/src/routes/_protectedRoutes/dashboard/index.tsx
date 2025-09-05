import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protectedRoutes/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protectedRoutes/dashboard/"!</div>
}
