const crypto = require('crypto');
const https = require('https');
const orderService = require('../services/order.service');

const MoMoController = {
  createPayment: async (req, res) => {
    try {
      const accessKey = 'F8BBA842ECF85';
      const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
      const orderInfo = 'Pay with MoMo';
      const partnerCode = 'MOMO';
      const redirectUrl = 'http://localhost:3000/checkout'; // Thay đổi redirectUrl đến trang sản phẩm
      const ipnUrl = 'http://localhost:8083/api/v1/momo/ipn'; // URL nhận kết quả thanh toán từ MoMo
      const requestType = 'payWithMethod';
      const amount = req.body.amount;
      const orderId = req.body.orderId;
      const requestId = orderId;
      const extraData = '';
      const orderGroupId = '';
      const autoCapture = true;
      const lang = 'vi';

      const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
      const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

      const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        lang: lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData: extraData,
        orderGroupId: orderGroupId,
        signature: signature
      });

      const options = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/v2/gateway/api/create',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestBody)
        }
      };

      const momoReq = https.request(options, momoRes => {
        let data = '';

        momoRes.on('data', chunk => {
          data += chunk;
        });

        momoRes.on('end', async () => {
          try {
            const response = JSON.parse(data);

            if (response.resultCode === 0) {
              // Thanh toán MoMo được tạo thành công
              // Cập nhật trạng thái đơn hàng thành Success
              await orderService.updateOrderPaymentStatus(orderId, 'Success');
              console.log(`Order ${orderId} updated to Success.`);

              // Trả về URL thanh toán
              res.json({ paymentUrl: response.payUrl });
            } else {
              res.status(500).json({ message: 'Error creating payment', detail: response });
            }
          } catch (error) {
            res.status(500).json({ message: 'Error parsing MoMo response', error: error.message });
          }
        });
      });

      momoReq.on('error', e => {
        res.status(500).json({ message: 'Request error', detail: e.message });
      });

      momoReq.write(requestBody);
      momoReq.end();

    } catch (error) {
      res.status(500).json({ message: 'Error creating MoMo payment', error: error.message });
    }
  },
};

module.exports = MoMoController;
