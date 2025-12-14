// Mock data for Admin Dashboard

export const mockUsers = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    avatar: '👤',
    role: 'user',
    status: 'active',
    isOnline: true,
    joinedAt: '2024-01-15',
    totalMessages: 245,
    roomsJoined: ['Room 1', 'Room 2', 'Room 3'],
    lastActive: '2024-12-11T10:30:00'
  },
  {
    id: 2,
    name: 'Trần Thị B',
    email: 'tranthib@example.com',
    avatar: '👤',
    role: 'user',
    status: 'active',
    isOnline: false,
    joinedAt: '2024-02-20',
    totalMessages: 189,
    roomsJoined: ['Room 1', 'Room 4'],
    lastActive: '2024-12-10T15:20:00'
  },
  {
    id: 3,
    name: 'Lê Văn C',
    email: 'levanc@example.com',
    avatar: '👤',
    role: 'user',
    status: 'locked',
    isOnline: false,
    joinedAt: '2024-03-10',
    totalMessages: 56,
    roomsJoined: ['Room 2'],
    lastActive: '2024-12-09T09:15:00'
  },
  {
    id: 4,
    name: 'Phạm Thị D',
    email: 'phamthid@example.com',
    avatar: '👤',
    role: 'user',
    status: 'active',
    isOnline: true,
    joinedAt: '2024-04-05',
    totalMessages: 412,
    roomsJoined: ['Room 1', 'Room 3', 'Room 4', 'Room 5'],
    lastActive: '2024-12-11T11:45:00'
  },
  {
    id: 5,
    name: 'Hoàng Văn E',
    email: 'hoangvane@example.com',
    avatar: '👤',
    role: 'user',
    status: 'active',
    isOnline: true,
    joinedAt: '2024-05-12',
    totalMessages: 302,
    roomsJoined: ['Room 2', 'Room 3'],
    lastActive: '2024-12-11T11:50:00'
  }
];

export const mockRooms = [
  {
    id: 1,
    name: 'Nhóm Dự Án A',
    type: 'group',
    createdBy: 'Nguyễn Văn A',
    createdAt: '2024-06-01',
    members: ['Nguyễn Văn A', 'Trần Thị B', 'Phạm Thị D'],
    totalMessages: 567,
    isActive: true
  },
  {
    id: 2,
    name: 'Nhóm Marketing',
    type: 'group',
    createdBy: 'Lê Văn C',
    createdAt: '2024-06-15',
    members: ['Lê Văn C', 'Nguyễn Văn A', 'Hoàng Văn E'],
    totalMessages: 234,
    isActive: true
  },
  {
    id: 3,
    name: 'Team Tech',
    type: 'group',
    createdBy: 'Phạm Thị D',
    createdAt: '2024-07-01',
    members: ['Phạm Thị D', 'Nguyễn Văn A', 'Hoàng Văn E'],
    totalMessages: 891,
    isActive: true
  },
  {
    id: 4,
    name: 'Support Group',
    type: 'group',
    createdBy: 'Trần Thị B',
    createdAt: '2024-08-10',
    members: ['Trần Thị B', 'Phạm Thị D'],
    totalMessages: 156,
    isActive: true
  },
  {
    id: 5,
    name: 'General Discussion',
    type: 'group',
    createdBy: 'Hoàng Văn E',
    createdAt: '2024-09-05',
    members: ['Phạm Thị D'],
    totalMessages: 78,
    isActive: false
  }
];

export const mockMessages = [
  { date: '2024-12-05', total: 45, aiMessages: 12 },
  { date: '2024-12-06', total: 67, aiMessages: 18 },
  { date: '2024-12-07', total: 89, aiMessages: 25 },
  { date: '2024-12-08', total: 54, aiMessages: 15 },
  { date: '2024-12-09', total: 72, aiMessages: 20 },
  { date: '2024-12-10', total: 98, aiMessages: 28 },
  { date: '2024-12-11', total: 112, aiMessages: 35 }
];

export const mockStats = {
  totalUsers: 5,
  totalRooms: 5,
  totalMessages: 1926,
  totalAIMessages: 153,
  onlineUsers: 3,
  mostActiveUser: 'Phạm Thị D'
};

export const mockAdminUser = {
  email: 'admin@chatapp.com',
  password: 'admin123',
  role: 'admin',
  name: 'Admin User'
};
