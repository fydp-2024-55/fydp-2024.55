
interface UserPageProps {
    username: string;
    first_name: string
    last_name: string
    phone: number;
    email: string;
  }
  
  const UserPage: React.FC<UserPageProps> = ({ username, first_name, last_name, phone, email }) => {
    return (
      <div>
        <h2>User Profile</h2>
        <p>Username: {username}</p>
        <p>Full name: {first_name} {last_name}</p>
        <p>Phone number: {phone}</p>
        <p>Email: {email}</p>
      </div>
    );
  };
  
  export default UserPage;