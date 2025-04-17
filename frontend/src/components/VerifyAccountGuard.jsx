import { Navigate, useLocation } from "react-router-dom"

const VerifyAccountGuard = ({ children }) => {
  const location = useLocation()
  const email = location.state?.email

  if (!email) {
    return <Navigate to="/register" replace />
  }

  return children
}

export default VerifyAccountGuard