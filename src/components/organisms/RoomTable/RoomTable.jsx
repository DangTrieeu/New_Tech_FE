import React from 'react';
import Table from '../../atoms/Table/Table';
import Badge from '../../atoms/Badge/Badge';
import Button from '../../atoms/Button/Button';
import { Trash2, Users, MessageCircle } from 'lucide-react';

const RoomTable = ({ rooms, onRoomClick, onDelete }) => {
  const typeVariant = {
    'public': 'success',
    'private': 'primary'
  };

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.Head>Tên phòng</Table.Head>
          <Table.Head>Loại</Table.Head>
          <Table.Head>Thành viên</Table.Head>
          <Table.Head>Tin nhắn</Table.Head>
          <Table.Head>Người tạo</Table.Head>
          <Table.Head>Ngày tạo</Table.Head>
          <Table.Head>Trạng thái</Table.Head>
          <Table.Head>Thao tác</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {rooms.map((room) => (
          <Table.Row key={room.id} onClick={() => onRoomClick(room)}>
            <Table.Cell>
              <span className="font-medium">{room.name}</span>
            </Table.Cell>
            <Table.Cell>
              <Badge variant={typeVariant[room.type]}>
                {room.type}
              </Badge>
            </Table.Cell>
            <Table.Cell>
              <div className="flex items-center gap-1">
                <Users size={14} />
                <span>{room.members.length}</span>
              </div>
            </Table.Cell>
            <Table.Cell>
              <div className="flex items-center gap-1">
                <MessageCircle size={14} />
                <span>{room.totalMessages}</span>
              </div>
            </Table.Cell>
            <Table.Cell>{room.createdBy}</Table.Cell>
            <Table.Cell className="text-xs">
              {new Date(room.createdAt).toLocaleDateString('vi-VN')}
            </Table.Cell>
            <Table.Cell>
              <Badge variant={room.isActive ? 'success' : 'warning'}>
                {room.isActive ? 'Hoạt động' : 'Không hoạt động'}
              </Badge>
            </Table.Cell>
            <Table.Cell>
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => onDelete(room.id)}
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

export default RoomTable;
