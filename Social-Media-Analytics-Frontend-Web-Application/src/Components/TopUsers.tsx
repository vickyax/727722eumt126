import { useState, useEffect, FC } from 'react';
import axios from 'axios';
import AnalyticsCard from './AnalyticsCard';

interface User {
  id: string;
  name: string;
  postCount: number;
}

const TopUsers: FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios.get('http://localhost:5000/users').then((res) => setUsers(res.data));
  }, []);

  return (
    <AnalyticsCard
      title="Top Users"
      items={users}
      type="user"
      fields={[
        { key: 'name', label: 'Name', variant: 'h6' },
        { key: 'postCount', label: 'Posts' },
      ]}
    />
  );
};

export default TopUsers;