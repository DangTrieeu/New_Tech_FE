import React from 'react';
import Table from '../../atoms/Table/Table';
import Badge from '../../atoms/Badge/Badge';
import Avatar from '../../atoms/Avatar/Avatar';
import Button from '../../atoms/Button/Button';
import { Lock, Unlock, Trash2 } from 'lucide-react';

const UserTable = ({ users, onUserClick, onToggleLock, onDelete }) => {
  const statusVariant = {
    'active': 'success',
    'locked': 'danger',
    'inactive': 'warning'
  };

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>Người dùng</Table.Head>
          <Table.Head>Email</Table.Head>
          <Table.Head>Vai trò</Table.Head>
          <Table.Head>Trạng thái</Table.Head>
          <Table.Head>Tin nhắn</Table.Head>
          <Table.Head>Phòng</Table.Head>
          <Table.Head>Hoạt động cuối</Table.Head>
          <Table.Head>Thao tác</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {users.map((user) => (
          <Table.Row key={user.id} onClick={() => onUserClick(user)}>
            <Table.Cell>
              <div className="flex items-center gap-3">
                <Avatar 
                  emoji={user.avatar} 
                  size="small" 
                  isOnline={user.isOnline} 
                />
                <span className="font-medium">{user.name}</span>
              </div>
            </Table.Cell>
            <Table.Cell>{user.email}</Table.Cell>
            <Table.Cell>
              <span className="capitalize">{user.role}</span>
            </Table.Cell>
            <Table.Cell>
              <Badge variant={statusVariant[user.status]}>
                {user.status}
              </Badge>
            </Table.Cell>
            <Table.Cell>{user.totalMessages}</Table.Cell>
            <Table.Cell>{user.roomsJoined}</Table.Cell>
            <Table.Cell className="text-xs">
              {new Date(user.lastActive).toLocaleDateString('vi-VN')}
            </Table.Cell>
            <Table.Cell>
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => onToggleLock(user.id)}
                  style={{ padding: '0.375rem', display: 'flex', alignItems: 'center' }}
                >
                  {user.status === 'locked' ? (
                    <Unlock size={16} />
                  ) : (
                    <Lock size={16} />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => onDelete(user.id)}
                  style={{ padding: '0.375rem', display: 'flex', alignItems: 'center', color: '#ef4444' }}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default UserTable;
