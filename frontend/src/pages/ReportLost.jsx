import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { lostAPI } from '../services/api';
import { toast, ToastContainer } from 'react-toastify';
import ImageUpload from '../components/ImageUpload';
import { FaSave } from 'react-icons/fa';

const ReportLost = () => {
    const [formData, setFormData] = useState({
        personName: '',
        age: '',
        gender: 'Male',
        locationLost: '',
        dateLost: '',
        description: '',
        contactPhone: '',
        contactEmail: '',
    });
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!photo) {
            toast.error('Please upload a photo');
            return;
        }

        setLoading(true);

        try {
            const data = new FormData();
            data.append('photo', photo);
            data.append('personName', formData.personName);
            data.append('age', formData.age);
            data.append('gender', formData.gender);
            data.append('locationLost', formData.locationLost);
            data.append('dateLost', formData.dateLost);
            data.append('description', formData.description);
            data.append('contactInfo', JSON.stringify({
                phone: formData.contactPhone,
                email: formData.contactEmail,
            }));

            const response = await lostAPI.create(data);

            toast.success('Lost person report submitted successfully!');
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit report');
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="max-w-4xl mx-auto">
                <div className="card-gradient p-8 animate-fadeIn">
                    <h1 className="text-4xl font-bold gradient-text mb-2">Report Lost Person</h1>
                    <p className="text-gray-600 mb-8">
                        Please provide detailed information to help us find your missing person
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Photo Upload */}
                        <ImageUpload
                            value={null}
                            onChange={setPhoto}
                            label="Upload Clear Photo of the Person *"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Person Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Person's Name *
                                </label>
                                <input
                                    type="text"
                                    name="personName"
                                    value={formData.personName}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>

                            {/* Age */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Age *
                                </label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Enter age"
                                    min="0"
                                    max="150"
                                    required
                                />
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Gender *
                                </label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Location Lost */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Location Where Lost *
                                </label>
                                <input
                                    type="text"
                                    name="locationLost"
                                    value={formData.locationLost}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="City, Area, Landmark"
                                    required
                                />
                            </div>

                            {/* Date Lost */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Date When Lost *
                                </label>
                                <input
                                    type="date"
                                    name="dateLost"
                                    value={formData.dateLost}
                                    onChange={handleChange}
                                    className="input-field"
                                    max={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>

                            {/* Contact Phone */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Your Contact Phone *
                                </label>
                                <input
                                    type="tel"
                                    name="contactPhone"
                                    value={formData.contactPhone}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="+977 9800000000"
                                    required
                                />
                            </div>

                            {/* Contact Email */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Your Contact Email (Optional)
                                </label>
                                <input
                                    type="email"
                                    name="contactEmail"
                                    value={formData.contactEmail}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="your@email.com"
                                />
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Additional Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="input-field"
                                    rows="4"
                                    placeholder="Describe physical features, clothing worn, circumstances of disappearance, etc."
                                    required
                                ></textarea>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary flex items-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaSave />
                                        <span>Submit Report</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReportLost;
