export const resetPasswordTemplate = (code: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Password Reset Request</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 0;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
        }
        .header {
            text-align: center;
            padding: 20px 0;
            background-color: #8b5cf6;
            color: white;
        }
        .content {
            padding: 30px;
            background-color: #ffffff;
        }
        .code-container {
            text-align: center;
            margin: 30px 0;
        }
        .code {
            display: inline-block;
            padding: 15px 30px;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 5px;
            background-color: #f5f3ff;
            border: 2px dashed #8b5cf6;
            border-radius: 6px;
            color: #6d28d9;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
            background-color: #f9fafb;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #8b5cf6;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
        }
        .note {
            background-color: #f5f3ff;
            padding: 15px;
            border-radius: 6px;
            border-right: 4px solid #8b5cf6;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>We received a request to reset your password. Please use the following verification code to proceed:</p>
            
            <div class="code-container">
                <div class="code">${code}</div>
            </div>
            
            <div class="note">
                <p><strong>Note:</strong> This code will expire in 10 minutes. For security reasons, please do not share this code with anyone.</p>
            </div>
            
            <p>If you didn't request this password reset, you can safely ignore this email. Your account remains secure.</p>
            
            <p>Thanks,<br>Ma Baba Cloth Store Team</p>
        </div>
        <div class="footer">
            <p>© ${new Date().getFullYear()} Ma Baba Cloth Store. All rights reserved.</p>
            <p>123 Fashion Street, New Delhi, India</p>
            <p style="margin-top: 10px; font-size: 11px; color: #9ca3af;">This is an automated message, please do not reply.</p>
        </div>
    </div>
</body>
</html>
`;
