export const resetPasswordTemplate = (link, email) =>{
    return `<div
        style="
            font-family: system-ui, sans-serif, Arial;
            font-size: 14px;
            color: #333;
            padding: 20px 14px;
            background-color: #f5f5f5;
        "
        >
        <div style="max-width: 600px; margin: auto; background-color: #fff">
            <div style="text-align: center; background-color: #333; padding: 14px">
            <a style="text-decoration: none; outline: none" href="https://studycraze.vercel.app/" target="_blank">
                <img
                style="height: 32px; vertical-align: middle"
                height="32px"
                src="https://i.ibb.co/nQmMCsX/Study-Craze.png"
                alt="logo"
                />
            </a>
            </div>
            <div style="padding: 14px">
            <h1 style="font-size: 22px; margin-bottom: 26px">You have requested a password change</h1>
            <p>
                We received a request to reset the password for your account. To proceed, please click the
                link below to create a new password:
            </p>
            <p>
                <a href="${link}">${link}</a>
            </p>
            <p>This link will expire in one hour.</p>
            <p>
                If you didn't request this password reset, please ignore this email or let us know
                immediately. Your account remains secure.
            </p>
            <p>Best regards,<br />StudyCraze Team</p>
            </div>
        </div>
        <div style="max-width: 600px; margin: auto">
            <p style="color: #999">
            The email was sent to ${email}<br />
            You received this email because you are registered with StudyCraze
            </p>
        </div>
        </div>
        `
}