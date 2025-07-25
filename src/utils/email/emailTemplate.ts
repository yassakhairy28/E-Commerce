export const emailTemplate = (
  subject: string,
  userName: string,
  msg: string,
  otp: string
) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-Commerce Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 500px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .email-header {
            background: rgb(9, 41, 78);
            color: #ffffff;
            padding: 15px;
            font-size: 18px;
            font-weight: bold;
        }
        .email-body {
            padding: 20px;
            color: #333;
        }
        .otp-box {
            display: inline-block;
            background: rgb(9, 41, 78);
            color: #ffffff;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
            margin: 15px 0;
        }
        .email-footer {
            background: #f1f1f1;
            padding: 10px;
            font-size: 12px;
            color: #666;
        }
        .email-footer a {
            color: rgb(9, 41, 78);
            text-decoration: none;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            ${subject}
        </div>
        <div class="email-body">
            <p><strong>Hello, ${userName}</strong></p>
            <p>${msg}</p>
            <div class="otp-box">${otp}</div>
            <p>If you didn’t request this, please ignore this email.</p>
            <p>Best regards,<brE-Commerce Team</p>
        </div>
        <div class="email-footer">
            &copy; 2025 E-Commerce. All rights reserved.<br>
            <a href="#">Contact Support</a> | <a href="#">Unsubscribe</a>
        </div>
    </div>
</body>
</html>
`;
};
