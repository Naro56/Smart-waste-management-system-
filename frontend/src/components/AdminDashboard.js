import React, { useState } from 'react';
import {
  FaUser,
  FaTruck,
  FaTrash,
  FaClipboardList,
  FaMapMarkerAlt,
  FaBell
} from 'react-icons/fa';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [drivers, setDrivers] = useState([
    {
      user_id: 1,
      username: 'driver1',
      email: 'driver1@smartwaste.com',
      phone_number: '9876543210',
      license_number: 'DL001',
      vehicle_number: 'WM001',
      availability_status: 'available',
      current_location: 'Zone A'
    },
    {
      user_id: 2,
      username: 'driver2',
      email: 'driver2@smartwaste.com',
      phone_number: '9876543211',
      license_number: 'DL002',
      vehicle_number: 'WM002',
      availability_status: 'available',
      current_location: 'Zone B'
    },
    {
      user_id: 3,
      username: 'driver3',
      email: 'driver3@smartwaste.com',
      phone_number: '9876543212',
      license_number: 'DL003',
      vehicle_number: 'WM003',
      availability_status: 'busy',
      current_location: 'Zone C'
    },
    {
      user_id: 4,
      username: 'driver4',
      email: 'driver4@smartwaste.com',
      phone_number: '9876543213',
      license_number: 'DL004',
      vehicle_number: 'WM004',
      availability_status: 'available',
      current_location: 'Zone D'
    },
    {
      user_id: 5,
      username: 'driver5',
      email: 'driver5@smartwaste.com',
      phone_number: '9876543214',
      license_number: 'DL005',
      vehicle_number: 'WM005',
      availability_status: 'offline',
      current_location: 'Zone E'
    }
  ]);

  const [adminProfile] = useState({
    name: 'Admin User',
    email: 'admin@smartwaste.com',
    phone: '1234567890',
    role: 'Administrator',
    joinDate: '2024-01-01'
  });

  const [wasteRequests] = useState([
    {
      id: 1,
      userId: 'USER001',
      location: '123 Main St',
      wasteType: 'Household',
      status: 'Pending',
      requestDate: '2024-03-15'
    },
    {
      id: 2,
      userId: 'USER002',
      location: '456 Oak Ave',
      wasteType: 'Recyclable',
      status: 'Assigned',
      requestDate: '2024-03-14'
    },
    {
      id: 3,
      userId: 'USER003',
      location: '789 Pine Rd',
      wasteType: 'Organic',
      status: 'Completed',
      requestDate: '2024-03-13'
    }
  ]);

  const [bins] = useState([
    {
      id: 'BIN001',
      location: 'Zone A - Street 1',
      type: 'General Waste',
      capacity: '100L',
      fillLevel: '75%',
      lastEmptied: '2024-03-14'
    },
    {
      id: 'BIN002',
      location: 'Zone B - Street 2',
      type: 'Recyclable',
      capacity: '100L',
      fillLevel: '45%',
      lastEmptied: '2024-03-15'
    },
    {
      id: 'BIN003',
      location: 'Zone C - Street 3',
      type: 'Organic',
      capacity: '100L',
      fillLevel: '90%',
      lastEmptied: '2024-03-13'
    }
  ]);

  const [notifications] = useState([
    {
      id: 1,
      type: 'alert',
      message: 'Bin BIN003 is nearly full',
      timestamp: '2024-03-15 10:30'
    },
    {
      id: 2,
      type: 'info',
      message: 'New waste collection request received',
      timestamp: '2024-03-15 09:45'
    },
    {
      id: 3,
      type: 'success',
      message: 'Driver completed collection at Zone B',
      timestamp: '2024-03-15 09:15'
    }
  ]);

  const handleRemoveDriver = (driverId) => {
    if (window.confirm('Are you sure you want to remove this driver?')) {
      setDrivers(drivers.filter(driver => driver.user_id !== driverId));
    }
  };

  const renderProfile = () => {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-6">Admin Profile</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 sm:col-span-1">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1 text-sm text-gray-900">{adminProfile.name}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{adminProfile.email}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <p className="mt-1 text-sm text-gray-900">{adminProfile.phone}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <p className="mt-1 text-sm text-gray-900">{adminProfile.role}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Join Date</label>
              <p className="mt-1 text-sm text-gray-900">{adminProfile.joinDate}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDriversTable = () => {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Driver Management</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Driver Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {drivers.map((driver) => (
                  <tr key={driver.user_id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{driver.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{driver.email}</div>
                      <div className="text-sm text-gray-500">{driver.phone_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">License: {driver.license_number}</div>
                      <div className="text-sm text-gray-500">Vehicle: {driver.vehicle_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${driver.availability_status === 'available' ? 'bg-green-100 text-green-800' : 
                          driver.availability_status === 'busy' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {driver.availability_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {driver.current_location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => handleRemoveDriver(driver.user_id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderWasteRequests = () => {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Waste Collection Requests</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waste Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {wasteRequests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{request.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.userId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.wasteType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${request.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                        request.status === 'Assigned' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-blue-100 text-blue-800'}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.requestDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderBinManagement = () => {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Bin Management</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bin ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fill Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Emptied</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bins.map((bin) => (
                <tr key={bin.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bin.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bin.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bin.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bin.capacity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          parseInt(bin.fillLevel) > 80 ? 'bg-red-600' :
                          parseInt(bin.fillLevel) > 50 ? 'bg-yellow-400' :
                          'bg-green-600'
                        }`}
                        style={{ width: bin.fillLevel }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 mt-1">{bin.fillLevel}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bin.lastEmptied}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderAnalytics = () => {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-blue-800 text-lg font-medium">Total Collections</h4>
            <p className="text-3xl font-bold text-blue-600">156</p>
            <p className="text-sm text-blue-600">This month</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-green-800 text-lg font-medium">Active Bins</h4>
            <p className="text-3xl font-bold text-green-600">48</p>
            <p className="text-sm text-green-600">Currently monitored</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="text-yellow-800 text-lg font-medium">Pending Requests</h4>
            <p className="text-3xl font-bold text-yellow-600">12</p>
            <p className="text-sm text-yellow-600">Awaiting assignment</p>
          </div>
        </div>
      </div>
    );
  };

  const renderNotifications = () => {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Notifications</h3>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div 
              key={notification.id}
              className={`p-4 rounded-lg ${
                notification.type === 'alert' ? 'bg-red-50' :
                notification.type === 'success' ? 'bg-green-50' :
                'bg-blue-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className={`text-sm ${
                  notification.type === 'alert' ? 'text-red-800' :
                  notification.type === 'success' ? 'text-green-800' :
                  'text-blue-800'
                }`}>
                  {notification.message}
                </div>
                <div className="text-xs text-gray-500">{notification.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfile();
      case 'drivers':
        return renderDriversTable();
      case 'requests':
        return renderWasteRequests();
      case 'bins':
        return renderBinManagement();
      case 'analytics':
        return renderAnalytics();
      case 'notifications':
        return renderNotifications();
      default:
        return renderProfile();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>
          </div>
          <nav className="mt-4">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center px-4 py-2 w-full ${
                activeTab === 'profile' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaUser className="mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('drivers')}
              className={`flex items-center px-4 py-2 w-full ${
                activeTab === 'drivers' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaTruck className="mr-2" />
              Drivers
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex items-center px-4 py-2 w-full ${
                activeTab === 'requests' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaClipboardList className="mr-2" />
              Waste Requests
            </button>
            <button
              onClick={() => setActiveTab('bins')}
              className={`flex items-center px-4 py-2 w-full ${
                activeTab === 'bins' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaTrash className="mr-2" />
              Bin Management
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center px-4 py-2 w-full ${
                activeTab === 'analytics' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaMapMarkerAlt className="mr-2" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center px-4 py-2 w-full ${
                activeTab === 'notifications' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FaBell className="mr-2" />
              Notifications
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;