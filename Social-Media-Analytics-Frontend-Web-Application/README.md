markdown
Copy

# Social Media Analytics Frontend Documentation

## Overview  
The frontend component of the Social Media Analytics application is built using React and integrates with a custom backend API. It focuses on delivering real-time insights through three main views, prioritizing visual appeal and responsive interactions. The implementation emphasizes component reusability and efficient data handling.

---

## Core Components

### AnalyticsCard (The Swiss Army Knife Component)  
Serves as the foundational building block for displaying both user and post data. Features dynamic styling based on content type and handles various data configurations through props.

```tsx
interface FieldConfig {
  key: string;
  label: string;
  variant?: string;
}

const AnalyticsCard: FC<AnalyticsCardProps> = ({ title, items, fields, type = 'post' }) => (
  <div className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-xl rounded-xl border border-gray-200">
    <h2 className="text-3xl font-bold mb-6 text-blue-600">
      {title}
    </h2>
    <ul className="grid gap-4 grid-cols-1 md:grid-cols-2">
      {items.map((item) => (
        <li 
          key={item.id} 
          className={`p-6 rounded-lg shadow-sm transition-all duration-300 hover:scale-[1.02]`}
        >
          {/* Content rendering logic */}
        </li>
      ))}
    </ul>
  </div>
);

Key Decisions:

    Uses CSS grid for responsive layout

    Implements hover effects for better user engagement

    Supports dynamic field configurations via props

PostList Component

Handles both trending and latest post displays. Implements aggressive polling for the live feed view despite potential performance implications.
tsx
Copy

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

  return <AnalyticsCard ... />;
};

Implementation Notes:

    Uses 5-second polling interval for live updates

    Shares component logic between post types

    Lacks proper error handling for failed API calls

TopUsers Component

Displays leaderboard of most active users. Relies on backend data processing but caches results aggressively.
tsx
Copy

const TopUsers: FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios.get('http://localhost:5000/users')
      .then((res) => setUsers(res.data));
  }, []);

  return <AnalyticsCard ... />;
};

Known Issues:

    No refresh mechanism after initial load

    Static data presentation without user interaction

    Potential staleness in displayed information

Application Structure
Routing Configuration

Centralized navigation using React Router with gradient-styled header:
tsx
Copy

<header className="w-full bg-gradient-to-r from-blue-600 to-purple-700 p-5 text-lg shadow-lg">
  <nav className="text-white text-lg font-bold flex justify-center items-center gap-12 w-full">
    <Link to="/">Top Users</Link>
    <Link to="/trending">Trending</Link>
    <Link to="/feed">Live Feed</Link>
  </nav>
</header>

Visual Features:

    Gradient background for visual impact

    Hover effects on navigation links

    Fixed header across all views

Key Implementation Details
Data Handling Approach

    Implements component-level state management

    Uses axios for API communication

    Passes data through props hierarchy

    Lacks global state management solution

Styling Methodology

    Utilizes Tailwind CSS for utility-first styling

    Implements custom gradient backgrounds

    Uses CSS transitions for interactive elements

    Contains hardcoded color values in components

Performance Considerations

    No memoization of API responses

    Duplicate network calls on route changes

    Potential over-fetching in list components

    Browser-based scroll management

Requirements

    Node.js 16+

    Running backend service on port 5000

Installation
bash
Copy

npm install
npm run dev

Known Issues

    Browser caching may require hard refresh after backend updates

    Mobile responsiveness needs improvement

    No loading states during data fetches

    Error handling for failed API calls not implemented
