import { Link } from "react-router-dom";
const User: React.FC = () => {
  return (
    <>
      <div>User page</div>
      <Link to="/">跳转到 Home</Link>
      <Link to="/user">跳转到 User</Link>
    </>
  );
};

export default User;
