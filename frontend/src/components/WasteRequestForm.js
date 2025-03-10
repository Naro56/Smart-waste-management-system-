import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const WasteRequestForm = () => {
    const navigate = useNavigate();
    const [wasteTypes, setWasteTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        waste_type_id: '',
        quantity: '',
        total_amount: 0
    });

    useEffect(() => {
        fetchWasteTypes();
    }, []);

    const fetchWasteTypes = async () => {
        try {
            const response = await axios.get('/api/waste/types');
            setWasteTypes(response.data.data);
        } catch (error) {
            console.error('Error fetching waste types:', error);
            setError('Failed to fetch waste types');
        }
    };

    const calculateCost = async () => {
        if (!formData.waste_type_id || !formData.quantity) return;

        try {
            const response = await axios.post('/api/waste/calculate-cost', {
                waste_type_id: formData.waste_type_id,
                quantity: formData.quantity
            });
            setFormData(prev => ({ ...prev, total_amount: response.data.data.total_cost }));
        } catch (error) {
            console.error('Error calculating cost:', error);
            setError('Failed to calculate cost');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/waste/submit-request', formData);
            
            if (response.data.success) {
                navigate(`/payment-upload/${response.data.data.request_id}`);
            }
        } catch (error) {
            console.error('Error submitting request:', error);
            setError('Failed to submit request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Waste Collection Request</h2>
            
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                        Waste Type
                    </label>
                    <select
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.waste_type_id}
                        onChange={(e) => {
                            setFormData(prev => ({
                                ...prev,
                                waste_type_id: e.target.value
                            }));
                            calculateCost();
                        }}
                        required
                    >
                        <option value="">Select Waste Type</option>
                        {wasteTypes.map(type => (
                            <option key={type.type_id} value={type.type_id}>
                                {type.waste_type} - ₹{type.price_per_unit}/{type.unit_measure}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                        Quantity (kg)
                    </label>
                    <input
                        type="number"
                        min="0"
                        step="0.1"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.quantity}
                        onChange={(e) => {
                            setFormData(prev => ({
                                ...prev,
                                quantity: e.target.value
                            }));
                            calculateCost();
                        }}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">
                        Total Amount
                    </label>
                    <div className="text-2xl font-bold text-green-600">
                        ₹{formData.total_amount}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Submit Request'}
                </button>
            </form>
        </div>
    );
};

export default WasteRequestForm;