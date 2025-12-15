// Utility functions for date and time formatting

/**
 * Check if two messages should be grouped together (same sender, within 15 minutes)
 */
export const shouldGroupMessages = (currentMsg, previousMsg) => {
  if (!previousMsg) return false;

  // Must be from the same sender
  const currentSenderId = currentMsg.sender_id || currentMsg.user_id;
  const previousSenderId = previousMsg.sender_id || previousMsg.user_id;

  if (currentSenderId !== previousSenderId) return false;

  // Check time difference (15 minutes = 900000 ms)
  const currentTime = new Date(currentMsg.created_at).getTime();
  const previousTime = new Date(previousMsg.created_at).getTime();
  const timeDiff = currentTime - previousTime;

  return timeDiff < 15 * 60 * 1000; // 15 minutes
};

/**
 * Check if we should show a date separator (6 hours gap)
 */
export const shouldShowDateSeparator = (currentMsg, previousMsg) => {
  if (!previousMsg) return true; // Always show for first message

  const currentTime = new Date(currentMsg.created_at).getTime();
  const previousTime = new Date(previousMsg.created_at).getTime();
  const timeDiff = currentTime - previousTime;

  return timeDiff >= 6 * 60 * 60 * 1000; // 6 hours
};

/**
 * Format date separator text (e.g., "Thứ Hai, 15 tháng 12")
 */
export const formatDateSeparator = (date) => {
  const messageDate = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset time for comparison
  const resetTime = (d) => {
    const newDate = new Date(d);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  const messageDateReset = resetTime(messageDate);
  const todayReset = resetTime(today);
  const yesterdayReset = resetTime(yesterday);

  if (messageDateReset.getTime() === todayReset.getTime()) {
    return 'Hôm nay';
  } else if (messageDateReset.getTime() === yesterdayReset.getTime()) {
    return 'Hôm qua';
  } else {
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const dayName = days[messageDate.getDay()];
    const day = messageDate.getDate();
    const month = messageDate.getMonth() + 1;

    return `${dayName}, ${day} tháng ${month}`;
  }
};

/**
 * Format message time (e.g., "14:30")
 */
export const formatMessageTime = (date) => {
  return new Date(date).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Get display name for room (use partner name for private rooms)
 */
export const getRoomDisplayName = (room, currentUserId) => {
  if (room.type === 'PRIVATE') {
    // For private rooms, find the partner (the other person)
    if (room.participants && Array.isArray(room.participants) && room.participants.length > 0) {
      // First, try to find partner by excluding current user
      let partner = room.participants.find(p => p.id !== currentUserId);

      // If not found (API might already filter to only show partner), use first participant
      if (!partner && room.participants.length > 0) {
        partner = room.participants[0];
      }

      if (partner?.name) {
        return partner.name;
      }
    }
    // Fallback: try room.partner if exists
    if (room.partner?.name) {
      return room.partner.name;
    }
    // Last fallback: use room name or default
    return room.name || 'Người dùng';
  }
  // For group rooms, show room name
  return room.name || 'Nhóm chat';
};
