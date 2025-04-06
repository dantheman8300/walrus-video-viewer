import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ConnectWalletButton } from './ConnectWalletButton';
import { Input } from './ui/input';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/view/${searchQuery.trim()}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto h-16 flex items-center justify-between">
        <div className="flex-1" >
          <Link to="/">
            <span className="text-xl font-bold">Walrus Video Viewer</span>
          </Link>
        </div>
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
          <div className="relative">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos..."
              className="w-full pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </form>
        <div className="flex-1 flex justify-end">
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  );
};

export default Header; 