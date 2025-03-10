import React, { useState, useEffect } from 'react';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userProfile, setUserProfile] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    address: ''
  });
  const [wasteRequest, setWasteRequest] = useState({
    wasteType: '',
    quantity: '',
    pickupDate: '',
    address: '',
    additionalNotes: ''
  });
  const [myRequests, setMyRequests] = useState([]);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`http://localhost:5000/api/users/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUserProfile({
            username: data.username || '',
            email: data.email || '',
            phoneNumber: data.phone_number || '',
            address: data.address || ''
          });
          // Pre-fill the waste request address with user's address
          setWasteRequest(prev => ({
            ...prev,
            address: data.address || ''
          }));
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  // Fetch user's requests
  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`http://localhost:5000/api/waste-requests/user/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setMyRequests(data);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchMyRequests();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: userProfile.phoneNumber,
          address: userProfile.address
        }),
      });

      if (response.ok) {
        alert('Profile updated successfully!');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch('http://localhost:5000/api/waste-requests/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...wasteRequest,
          userId,
          status: 'pending'
        }),
      });
      
      if (response.ok) {
        const newRequest = await response.json();
        setMyRequests([newRequest, ...myRequests]);
        alert('Waste collection request submitted successfully!');
        setWasteRequest({
          wasteType: '',
          quantity: '',
          pickupDate: '',
          address: userProfile.address, // Keep the user's address
          additionalNotes: ''
        });
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to submit request');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Profile Information</h3>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  value={userProfile.username}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50"
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={userProfile.email}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  value={userProfile.phoneNumber}
                  onChange={(e) => setUserProfile({...userProfile, phoneNumber: e.target.value})}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  value={userProfile.address}
                  onChange={(e) => setUserProfile({...userProfile, address: e.target.value})}
                  rows="3"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  placeholder="Enter your full address"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        );

      case 'request':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Request Waste Collection</h3>
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Waste Type</label>
                <select
                  value={wasteRequest.wasteType}
                  onChange={(e) => setWasteRequest({...wasteRequest, wasteType: e.target.value})}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                >
                  <option value="">Select waste type</option>
                  <option value="household">Household Waste</option>
                  <option value="recyclable">Recyclable Waste</option>
                  <option value="organic">Organic Waste</option>
                  <option value="hazardous">Hazardous Waste</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity (in kg)</label>
                <input
                  type="number"
                  value={wasteRequest.quantity}
                  onChange={(e) => setWasteRequest({...wasteRequest, quantity: e.target.value})}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                  min="1"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Preferred Pickup Date</label>
                <input
                  type="date"
                  value={wasteRequest.pickupDate}
                  onChange={(e) => setWasteRequest({...wasteRequest, pickupDate: e.target.value})}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Pickup Address</label>
                <textarea
                  value={wasteRequest.address}
                  onChange={(e) => setWasteRequest({...wasteRequest, address: e.target.value})}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
                <textarea
                  value={wasteRequest.additionalNotes}
                  onChange={(e) => setWasteRequest({...wasteRequest, additionalNotes: e.target.value})}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  rows="2"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        );

      case 'history':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">My Collection History</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Request Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Waste Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Driver
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {myRequests.map((request) => (
                    <tr key={request.request_id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(request.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {request.waste_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {request.quantity} kg
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {request.driver_name || 'Not assigned'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">User Dashboard</h2>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('request')}
                className={`${
                  activeTab === 'request'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Request Collection
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Collection History
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;