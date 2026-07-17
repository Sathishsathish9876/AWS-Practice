'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  
  // State for form and data
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Validation state
  const [errors, setErrors] = useState<{name?: string; email?: string; password?: string}>({});

  // Fetch users from our NestJS backend
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`);
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = () => {
    router.push('/login');
  };

  const handleEdit = (user: User) => {
    setEditingId(user._id);
    setName(user.name);
    setEmail(user.email);
    setPassword(''); 
    setErrors({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setEmail('');
    setPassword('');
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: {name?: string; email?: string; password?: string} = {};
    let isValid = true;

    if (!name.trim() || name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    if (!editingId) {
      // Creating a new record - password is required
      if (!password || password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters.';
        isValid = false;
      }
    } else {
      // Updating - password is optional, but if provided, must be valid
      if (password && password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters.';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});
    
    try {
      const url = editingId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/users/${editingId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/users`;
        
      const method = editingId ? 'PATCH' : 'POST';
      
      const payload: any = { name, email };
      if (password) {
        payload.password = password;
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        handleCancelEdit();
        fetchUsers();
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to save user. Ensure email is unique.');
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchUsers();
        if (editingId === id) {
          handleCancelEdit();
        }
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Manage your data</p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors border border-gray-700"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 h-fit">
            <h2 className="text-2xl font-semibold mb-6">
              {editingId ? 'Edit Record' : 'Add New Record'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({...errors, name: undefined});
                  }}
                  className={`w-full px-4 py-2 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 text-white transition-colors ${errors.name ? 'border-red-500' : 'border-gray-700'}`}
                  placeholder="Enter your name"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({...errors, email: undefined});
                  }}
                  className={`w-full px-4 py-2 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 text-white transition-colors ${errors.email ? 'border-red-500' : 'border-gray-700'}`}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Password {editingId && <span className="text-gray-500 text-xs">(Leave empty to keep current)</span>}
                </label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({...errors, password: undefined});
                  }}
                  className={`w-full px-4 py-2 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-blue-500 text-white transition-colors ${errors.password ? 'border-red-500' : 'border-gray-700'}`}
                  placeholder="Enter your password"
                />
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>
              
              <div className="flex space-x-3 mt-4">
                <button 
                  type="submit" disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  {loading ? 'Saving...' : (editingId ? 'Update Record' : 'Save Record')}
                </button>
                
                {editingId && (
                  <button 
                    type="button" 
                    onClick={handleCancelEdit}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Data Display Section */}
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-2xl border border-gray-700">
            <h2 className="text-2xl font-semibold mb-6">Records ({users.length})</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-900 text-gray-400">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Created At</th>
                    <th className="px-4 py-3 rounded-tr-lg text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                        No records found. Add some data from the left panel!
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-700/50 transition-colors">
                        <td className="px-4 py-4 font-medium text-white">{user.name}</td>
                        <td className="px-4 py-4 text-gray-300">{user.email}</td>
                        <td className="px-4 py-4 text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 text-right space-x-2">
                          <button 
                            onClick={() => handleEdit(user)}
                            className="text-blue-400 hover:text-blue-300 font-medium px-3 py-1 bg-blue-400/10 rounded-md hover:bg-blue-400/20 transition-colors"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(user._id)}
                            className="text-red-400 hover:text-red-300 font-medium px-3 py-1 bg-red-400/10 rounded-md hover:bg-red-400/20 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
