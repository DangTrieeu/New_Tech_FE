import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminService from "../services/adminService";

export default function useAdminDashboard() {
    const navigate = useNavigate();

    const [stats, setStats] = useState(null);
    const [messageStats, setMessageStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adminUser, setAdminUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        const user = localStorage.getItem("adminUser");

        if (!token) {
            navigate("/admin/login");
            return;
        }

        if (user) {
            setAdminUser(JSON.parse(user));
        }

        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);

        try {
            const [statsResp, messageResp] = await Promise.all([
                AdminService.getStats(),
                AdminService.getMessageStats()
            ]);

            setStats(statsResp.stats);
            setMessageStats(messageResp.messageStats);
        } catch (error) {
            console.error("Error loading dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        navigate("/admin/login");
    }

    return {
        stats,
        messageStats,
        adminUser,
        loading,
        handleLogout,
        navigate
    }
}