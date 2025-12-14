import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminService from '../services/adminService';

export default function useAdminLogin() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        setError('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await AdminService.login(formData.email, formData.password);

            if (res.success) {
                localStorage.setItem("adminToken", res.token);
                localStorage.setItem("adminUser", JSON.stringify(res.user));
                navigate("/admin/dashboard");
            } else {
                setError(res.message);
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return {
        formData,
        error,
        loading,
        handleChange,
        handleSubmit
    };
}