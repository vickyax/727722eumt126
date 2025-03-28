import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TopUsers from './Components/TopUsers';
import PostList from './Components/PostList';

const App = () => {
  return (
    <Router>
      <header className="w-full bg-gradient-to-r from-blue-600 to-purple-700 p-5 text-lg shadow-lg">
        <nav className="text-white text-lg font-bold flex justify-center items-center gap-12 w-full">
          <Link 
            to="/" 
            className="hover:underline transition-all duration-300 hover:text-blue-200"
          >
            🏆 Top Users
          </Link>
          <Link 
            to="/trending" 
            className="hover:underline transition-all duration-300 hover:text-purple-200"
          >
            🔥 Trending
          </Link>
          <Link 
            to="/feed" 
            className="hover:underline transition-all duration-300 hover:text-pink-200"
          >
            📡 Live Feed
          </Link>
        </nav>
      </header>

      <main className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<TopUsers />} />
            <Route path="/trending" element={<PostList type="popular" />} />
            <Route path="/feed" element={<PostList type="latest" />} />
          </Routes>
        </div>
      </main>
    </Router>
  );
};

export default App;