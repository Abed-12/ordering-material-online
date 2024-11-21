import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import SupplierModel from "../Models/Supplier.js";
import env from "dotenv";

env.config();

// ----------------------Add....----------------------------
const registration = async (req, res) => {
    try {
        const { name, email, username, password, supplierPhone, supplierProvide, commercialRegister } = req.body;
        const supplier = await SupplierModel.findOne({ username });
        if (supplier) {
            return res.status(409)
                .json({ message: 'Username is already exist', success: false });
        }
        const supplierModel = new SupplierModel({ name, email, username, password, supplierPhone, supplierProvide, commercialRegister });
        supplierModel.password = await bcrypt.hash(password, 10);
        await supplierModel.save();
        res.status(201)
            .json({
                message: "Registration successfully",
                success: true
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            })
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const supplier = await SupplierModel.findOne({ username });
        const errorMsg = 'Auth failed username or password is wrong';
        if (!supplier) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const isPassEqual = await bcrypt.compare(password, supplier.password);
        if (!isPassEqual) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const jwtToken = jwt.sign(
            { email: supplier.email, _id: supplier._id, role: supplier.role }, // يحتوي على المعلومات التي تريد تضمينها
            process.env.JWT_SECRET, // هو مفتاح سري يستخدم لتوقيع الرمز
            { expiresIn: '24h' } // optional ---> الرمز سينتهي بعد 24 ساعه من انشائه
        )

        res.status(200)
            .json({
                message: "Login Success",
                success: true,
                jwtToken,
                email, 
                role: supplier.role
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror:" + err,
                success: false
            })
    }
}

export { registration, login };
