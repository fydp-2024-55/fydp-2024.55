import { Typography } from "@material-ui/core";
import "./UserPage.css";

interface UserPageProps {
  username: string;
  first_name: string;
  last_name: string;
  phone: number;
  email: string;
}

const UserPage: React.FC<UserPageProps> = ({
  username,
  first_name,
  last_name,
  phone,
  email,
}) => {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography align="left" variant="h4">
        User Profile
      </Typography>
      <p>Username: {username}</p>
      <p>
        Full name: {first_name} {last_name}
      </p>
      <p>Phone number: {phone}</p>
      <p>Email: {email}</p>
    </div>
  );
};

export default UserPage;
