import { useState, useEffect, FC } from 'react';
import axios from 'axios';
import AnalyticsCard from './AnalyticsCard';

interface Post {
  id: string;
  content: string;
  userName: string;
  commentCount: number;
  likes: number;
}

interface PostListProps {
  type: 'popular' | 'latest';
}

const PostList: FC<PostListProps> = ({ type }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = () => 
      axios.get(`http://localhost:5000/posts?type=${type}`)
        .then((res) => setPosts(res.data));
    
    fetchData();
    if (type === 'latest') {
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
    }
  }, [type]);

  return (
    <AnalyticsCard
      title={type === 'popular' ? '🔥 Trending Posts' : '🆕 Latest Posts'}
      items={posts}
      fields={[
        { key: 'content', label: 'Content', variant: 'h6' },
        { key: 'userName', label: 'Author' },
      ]}
    />
  );
};

export default PostList;