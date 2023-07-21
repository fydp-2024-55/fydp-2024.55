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
        alignItems: "center",
      }}
    >
      <Typography align="left" variant="h4">
        User Profile
      </Typography>
      <div
        style={{
          marginTop: "20%",
          height: "70%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography align="left" variant="h6">
          Username: {username}
        </Typography>
        <Typography align="left" variant="h6">
          Full name: {first_name} {last_name}
        </Typography>
        <Typography align="left" variant="h6">
          Phone number: {phone}
        </Typography>
        <Typography align="left" variant="h6">
          Email: {email}
        </Typography>
      </div>
    </div>
  );
};

export default UserPage;
