const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const db = require("../config/db");
const path = require("path");

// 🔹 Register User
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        // Get uploaded image path
        const image = req.file ? `/uploads/user/${req.file.filename}` : null;

        await db.query(
            "INSERT INTO users (name, email, password, image) VALUES (?, ?, ?, ?)", 
            [name, email, hashedPassword, image]
        );

        return res.status(201).json({ message: "User registered successfully", image });

    } catch (error) {
        return res.status(500).json({ error: "Registration failed" });
    }
};

// 🔹 Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

        if (!users.length) return res.status(401).json({ error: "Invalid credentials" });

        const validPassword = await bcrypt.compare(password, users[0].password);
        if (!validPassword) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: users[0].id }, "your_secret_key", { expiresIn: "1h" });

        return res.json({ token });

    } catch (error) {
        return res.status(500).json({ error: "Login failed" });
    }
};

// 🔹 Forgot Password - Send Email with Temporary Password & Reset Link
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        // console.log("Received email:", email); // ✅ Log email received

        const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        // console.log("User lookup result:", users); // ✅ Log user data

        if (!users.length) {
            console.log("User not found!");
            return res.status(404).json({ error: "User not found" });
        }

        // Generate temp password
        const tempPassword = Math.random().toString(36).slice(-8);
        // console.log("Generated temp password:", tempPassword); // ✅ Log temp password

        const hashedTempPassword = await bcrypt.hash(tempPassword, 10);
        // console.log("Hashed temp password:", hashedTempPassword); // ✅ Log hashed password

        // Update password in DB
        const updateResult = await db.query("UPDATE users SET password = ? WHERE email = ?", [hashedTempPassword, email]);
        // console.log("Password update result:", updateResult); // ✅ Log DB update result

        // Generate reset link
        const resetToken = jwt.sign({ email }, "your_secret_key", { expiresIn: "15m" });
        const resetLink = `http://localhost:4200/reset-password`;
        // console.log("Generated reset link:", resetLink); // ✅ Log reset link

        // Send email
        await sendEmail(email, tempPassword, resetLink, resetToken);
        // console.log("Email sent successfully to:", email);

        return res.json({ message: "Password reset email sent" });

    } catch (error) {
        console.error("Error in forgotPassword:", error);
        return res.status(500).json({ error: "Failed to reset password" });
    }
};

// 🔹 Reset Password - User updates password from email link
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Verify JWT token
        const decoded = jwt.verify(token, "your_secret_key");
        const email = decoded.email;

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.query("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email]);

        return res.json({ message: "Password updated successfully" });

    } catch (error) {
        return res.status(500).json({ error: "Invalid or expired token" });
    }
};

// 🔹 Email Sending Function
const sendEmail = async (email, tempPassword, resetLink, resetToken) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "tureraomilind358@gmail.com",
            pass: "xzbj msby bwcj xpis",
        },
    });

    const mailOptions = {
        //Mail pass code:- pvtz ehiw wpua zylk

        // Generated app password:- xzbj msby bwcj xpis
        from: "tureraomilind358@gmail.com",
        to: email,
        subject: "Password Reset Request",
        html: `
            <p>Your temporary password is change any time: <strong>${tempPassword}</strong></p>
            <p><strong>Copy The Token and paste it in the password reset form</strong>: <a href="#">${resetToken}</a></p>
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>This link is valid for 15 minutes.</p>
        `,
    };

    await transporter.sendMail(mailOptions);
};


// 🔹 Get All Users
exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query("SELECT id, name, email, image FROM users"); // Exclude password
        return res.json(users);

    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch users" });
    }
};

// 🔹 Get User by ID
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const [users] = await db.query("SELECT id, name, email, image FROM users WHERE id = ?", [id]);

        if (!users.length) return res.status(404).json({ error: "User not found" });

        return res.json(users[0]);

    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch user" });
    }
};

// 🔹 Update User by ID
exports.updateUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, image } = req.body;

        await db.query("UPDATE users SET name = ?, email = ?, image = ? WHERE id = ?", 
            [name, email, image, id]);

        return res.json({ message: "User updated successfully" });

    } catch (error) {
        return res.status(500).json({ error: "Failed to update user" });
    }
};

// 🔹 Delete User by ID
exports.deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);

        if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });

        return res.json({ message: "User deleted successfully" });

    } catch (error) {
        return res.status(500).json({ error: "Failed to delete user" });
    }
};
