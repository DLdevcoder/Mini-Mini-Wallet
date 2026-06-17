module.exports = {
  SUCCESS: 200,
  INVALID_PARAMS: { code: 400, message: "Dữ liệu đầu vào không hợp lệ" },
  SYSTEM_ERROR: { code: 500, message: "Lỗi hệ thống" },
  PHONE_EXISTED: { code: 101, message: "Số điện thoại đã được đăng ký" },
  USER_NOT_FOUND: { code: 102, message: "Không tìm thấy người dùng" },
  WRONG_PASSWORD: { code: 103, message: "Mật khẩu không chính xác" },
  INSUFFICIENT_BALANCE: { code: 201, message: "Số dư không đủ" },
  INVALID_AMOUNT: { code: 202, message: "Số tiền chuyển không hợp lệ" },
  POCKET_NOT_FOUND: { code: 203, message: "Không tìm thấy ví" },
  TRANSFER_SELF: { code: 204, message: "Không thể chuyển tiền cho chính mình" },
};
