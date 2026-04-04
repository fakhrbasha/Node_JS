export const resetPasswordTemplate = (resetLink) => {
    return `
    <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
        <div style="max-width:500px; margin:auto; background:#fff; padding:20px; border-radius:10px; text-align:center;">
            
            <h2 style="color:#333;">Reset Your Password 🔐</h2>
            
            <p style="color:#555;">
                We received a request to reset your password.
            </p>

            <p style="color:#777; font-size:14px;">
                Click the button below to set a new password.  
                This link is valid for <b>10 minutes</b>.
            </p>

            <a href="${resetLink}" 
               style="
                    display:inline-block;
                    margin:20px 0;
                    padding:12px 25px;
                    background:#4CAF50;
                    color:#fff;
                    text-decoration:none;
                    border-radius:5px;
                    font-weight:bold;
               ">
               Reset Password
            </a>

            <p style="font-size:12px; color:#999;">
                If you didn’t request this, you can safely ignore this email.
            </p>

        </div>
    </div>
    `
}