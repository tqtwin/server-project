const http = require('http');
const socketIO = require('socket.io');
const app = require('./src/app');
const ChatController = require('./src/controllers/chatcontroller'); // ChatController để lưu tin nhắn

const server = http.createServer(app);

const io = socketIO(server, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:3001','https://client-user-alpha.vercel.app','https://client-admin-gamma.vercel.app'], // Cho phép origin từ các port client
        methods: ['GET', 'POST'],
        credentials: true, // Đảm bảo gửi cookie và các thông tin xác thực
    }
});

io.on('connection', (socket) => {
    // console.log('User connected:', socket.id);

    // Tham gia group
    socket.on('join group', async (groupId) => {
        try {
            console.log(`User ${socket.id} joining group: ${groupId}`);
            socket.join(groupId);

            // Lấy tin nhắn cũ
            const groupMessages = await ChatController.getMessages({ params: { groupId } }, {
                status: () => ({ json: (data) => data }),
            });

            // Gửi tin nhắn cũ cho người dùng
            socket.emit('previous messages', groupMessages);

            // Debug: liệt kê danh sách socket trong group
            io.in(groupId).allSockets().then((sockets) => {
                console.log(`Sockets in group ${groupId}:`, Array.from(sockets));
            });
        } catch (error) {
            console.error('Error joining group:', error);
            socket.emit('error', { message: 'Không thể tham gia nhóm' });
        }
    });

    // Gửi tin nhắn mới
    socket.on('chat message', async (msg) => {
        try {
            // Kiểm tra tin nhắn có đủ dữ liệu hay không
            if (!msg.text || !msg.groupId || !msg.role) {
                throw new Error('Missing required fields in message');
            }

            // Phát tin nhắn kèm theo role đến tất cả trong group
            io.to(msg.groupId).emit('chat message', {
                text: msg.text,
                senderId: msg.senderId,
                groupId: msg.groupId,
                timestamp: msg.timestamp,
                role: msg.role, // Kèm role vào tin nhắn phát đi
            });

            console.log(`Message emitted to group ${msg.groupId}:`, msg);

            // Lưu tin nhắn vào cơ sở dữ liệu bất đồng bộ
            await ChatController.saveMessage(msg);
        } catch (error) {
            console.error('Error processing chat message:', error);
            socket.emit('error', { message: 'Không thể gửi tin nhắn' });
        }
    });

    // Lấy danh sách nhóm chat
    socket.on('get all groups', async () => {
        try {
            const allGroupChats = await ChatController.getAllGroupChats();
            socket.emit('all groups', allGroupChats);
        } catch (error) {
            console.error('Error fetching all groups:', error);
            socket.emit('error', { message: 'Không thể lấy danh sách nhóm chat' });
        }
    });

    // Ngắt kết nối
    socket.on('disconnect', () => {
        // console.log('User disconnected:', socket.id);
    });
});


const PORT = process.env.PORT || 8083;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
