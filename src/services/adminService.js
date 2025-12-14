import {
  mockUsers,
  mockRooms,
  mockMessages,
  mockStats,
  mockAdminUser
} from '../mock/adminMockData';

class AdminService {
  constructor() {
    this.users = [...mockUsers];
    this.rooms = [...mockRooms];
    this.messages = [...mockMessages];
    this.stats = { ...mockStats };
  }

  // Auth
  login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === mockAdminUser.email && password === mockAdminUser.password) {
          const token = 'mock-admin-jwt-token';
          resolve({
            success: true,
            token,
            user: mockAdminUser
          });
        } else {
          reject({ success: false, message: 'Invalid credentials' });
        }
      }, 500);
    });
  }

  // Users
  getUsers() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ users: this.users });
      }, 300);
    });
  }

  getUserById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = this.users.find(u => u.id === id);
        resolve({ user });
      }, 300);
    });
  }

  toggleUserLock(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = this.users.find(u => u.id === userId);
        if (user) {
          user.status = user.status === 'locked' ? 'active' : 'locked';
        }
        resolve({ success: true, user });
      }, 300);
    });
  }

  deleteUser(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.users = this.users.filter(u => u.id !== userId);
        this.stats.totalUsers = this.users.length;
        resolve({ success: true });
      }, 300);
    });
  }

  // Rooms
  getRooms() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ rooms: this.rooms });
      }, 300);
    });
  }

  getRoomById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const room = this.rooms.find(r => r.id === id);
        resolve({ room });
      }, 300);
    });
  }

  deleteRoom(roomId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.rooms = this.rooms.filter(r => r.id !== roomId);
        this.stats.totalRooms = this.rooms.length;
        resolve({ success: true });
      }, 300);
    });
  }

  // Dashboard Stats
  getStats() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Update online users count
        this.stats.onlineUsers = this.users.filter(u => u.isOnline).length;
        resolve({ stats: this.stats });
      }, 300);
    });
  }

  getMessageStats() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ messageStats: this.messages });
      }, 300);
    });
  }

  // Simulate realtime updates
  simulateRealtimeUpdate() {
    // Randomly toggle user online status
    const randomUser = this.users[Math.floor(Math.random() * this.users.length)];
    if (randomUser && randomUser.status === 'active') {
      randomUser.isOnline = !randomUser.isOnline;
    }

    // Randomly add messages
    if (Math.random() > 0.7) {
      const today = this.messages[this.messages.length - 1];
      today.total += Math.floor(Math.random() * 5) + 1;
      today.aiMessages += Math.floor(Math.random() * 2);
      this.stats.totalMessages = this.messages.reduce((sum, m) => sum + m.total, 0);
      this.stats.totalAIMessages = this.messages.reduce((sum, m) => sum + m.aiMessages, 0);
    }

    return this.stats;
  }
}

export default new AdminService();
