const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendVerificationEmail = async (email, verificationCode) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Mã xác nhận tài khoản',
        html: `<h1>Mã xác nhận của bạn là:</h1>
               <p><strong>${verificationCode}</strong></p>
              <p>Vui lòng nhập mã này trong vòng <strong>15 phút</strong> để xác nhận tài khoản của bạn.</p>`

    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send verification email');
    }
};
const sendPasswordResetEmail = async (email, resetCode) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Mã đặt lại mật khẩu của bạn',
        html: `
            <h1>Mã đặt lại mật khẩu của bạn:</h1>
            <p><strong>${resetCode}</strong></p>
            <p>Vui lòng sử dụng mã này để đặt lại mật khẩu của bạn. Mã sẽ hết hạn sau 15 phút.</p>
            <p>Nếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully');
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Failed to send password reset email');
    }
};
const sendOrderConfirmationEmail = async (email, order) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Xác nhận đơn hàng của bạn',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px;">
                <h2 style="color: #4CAF50; text-align: center;">Cảm ơn bạn đã đặt hàng!</h2>
                <p>Chào <strong>${order.recipientName}</strong>,</p>
                <p>Đơn hàng của bạn đã được tạo thành công với mã đơn hàng: <strong>${order._id}</strong>.</p>
                <h3>Thông tin đơn hàng:</h3>
                <ul>
                    ${order.orderDetails.map(
                        (item) => `
                            <li>
                                <strong>${item.productName}</strong> - ${item.quantity} x ${item.price.toLocaleString()} đ
                            </li>
                        `
                    ).join('')}
                </ul>
                <p><strong>Tổng tiền:</strong> ${order.totalAmount.toLocaleString()} đ</p>
                <p><strong>Địa chỉ giao hàng:</strong> ${order.address}</p>
                <p><strong>Phương thức thanh toán:</strong> ${order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : order.paymentMethod}</p>
                <p>Chúng tôi sẽ liên hệ với bạn để xác nhận đơn hàng trong thời gian sớm nhất.</p>
                <hr>
                <p style="text-align: center;">&copy; ${new Date().getFullYear()} Cửa hàng của chúng tôi. Tất cả các quyền được bảo lưu.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Order confirmation email sent successfully');
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
        throw new Error('Failed to send order confirmation email');
    }
};
const sendPaymentSuccessEmail = async (email, order) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Xác nhận thanh toán thành công',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px;">
                <h2 style="color: #4CAF50; text-align: center;">Thanh toán thành công!</h2>
                <p>Chào <strong>${order.recipientName}</strong>,</p>
                <p>Chúng tôi rất vui thông báo rằng đơn hàng của bạn với mã <strong>${order._id}</strong> đã được thanh toán thành công.</p>
                <h3>Thông tin đơn hàng:</h3>
                <ul>
                    ${order.orderDetails.map(
                        (item) => `
                            <li>
                                <strong>${item.productName}</strong> - ${item.quantity} x ${item.price.toLocaleString()} đ
                            </li>
                        `
                    ).join('')}
                </ul>
                <p><strong>Tổng tiền:</strong> 0 đ (Đã thanh toán)</p>
                <p><strong>Phương thức thanh toán:</strong> ${order.paymentMethod}</p>
                <p>Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi!</p>
                <hr>
                <p style="text-align: center;">&copy; ${new Date().getFullYear()} Cửa hàng của chúng tôi. Tất cả các quyền được bảo lưu.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Payment success email sent successfully');
    } catch (error) {
        console.error('Error sending payment success email:', error);
        throw new Error('Failed to send payment success email');
    }
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail,sendOrderConfirmationEmail,sendPaymentSuccessEmail };
