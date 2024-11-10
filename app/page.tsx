'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Post {
  id: number;
  title: string;
  body: string;
}

interface PostInput {
  title: string;
  body: string;
}

const PostManager: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [searchId, setSearchId] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [noResults, setNoResults] = useState<boolean>(false);

  const API_URL = 'http://127.0.0.1:8000/api/posts';

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (searchId.trim() === '') {
      setFilteredPosts(posts);
      setNoResults(false);
    } else {
      const filtered = posts.filter(post => 
        post.id === parseInt(searchId)
      );
      setFilteredPosts(filtered);
      setNoResults(filtered.length === 0);
    }
  }, [searchId, posts]);

  const fetchPosts = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await axios.get(API_URL);
      setPosts(response.data.data);
      setFilteredPosts(response.data.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      alert('Failed to fetch posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    const postData: PostInput = {
      title,
      body
    };

    try {
      setIsLoading(true);
      if (editingId) {
        await axios.put<Post>(`${API_URL}/${editingId}`, postData);
        alert('Post updated successfully');
      } else {
        await axios.post<Post>(API_URL, postData);
        alert('Post created successfully');
      }
      setTitle('');
      setBody('');
      setEditingId(null);
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (post: Post): void => {
    setTitle(post.title);
    setBody(post.body);
    setEditingId(post.id);
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        setIsLoading(true);
        await axios.delete(`${API_URL}/${id}`);
        alert('Post deleted successfully');
        fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      
      <div className="p-[6px]  mb-8 bg-gradient-to-r from-purple-500 via-blue-500 via-green-500 via-yellow-500 to-red-500 bg-[length:200%_200%] animate-gradient-border rounded-lg">
        <span className="rounded-lg p-2">
        <h1 className="text-4xl font-bold text-center text-white">Next Js Crud App</h1>
        </span>
      </div>
      
      {/* Search by ID Section */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold my-2">Search Post by ID</h2>
        <input
          type="number"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="Enter Post ID"
          className="w-full px-4 py-2 rounded-md border border-orange-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        />
      </div>

      {/* Posts List */}
      <h1 className="text-2xl font-bold my-2">Post List</h1>
      <div className="space-y-4 h-[250px] overflow-scroll border p-4 rounded-md border-violet-600">
        {noResults ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="text-xl font-semibold">No post found with ID: {searchId}</p>
            <button 
              onClick={() => setSearchId('')}
              className="mt-4 px-4 py-2 text-sm bg-violet-500 text-white rounded-md hover:bg-violet-600 transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (
          filteredPosts.map((post: Post) => (
            <div key={post.id} className="bg-white px-4 py-2 rounded-lg border hover:bg-violet-200 cursor-pointer">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    ID: {post.id} - {post.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {post.body}
                  </p>
                </div>

                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(post)}
                    className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-200 text-gray-600 font-semibold transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form Section */}
      <h1 className="text-2xl font-bold mt-8 mb-2">{editingId ? 'Update Post' : 'Create Post'}</h1>
      <div className="bg-white p-4 rounded-lg border border-green-600">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="Post Title"
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <textarea
              value={body}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBody(e.target.value)}
              placeholder="Post Body"
              required
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[70px]"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md text-white font-semibold
              ${isLoading 
                ? 'bg-green-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
              } transition-colors duration-200`}
          >
            {editingId ? 'Update Post' : 'Create Post'}
          </button>
        </form>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostManager;