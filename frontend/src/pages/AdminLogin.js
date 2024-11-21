import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handleError, handleSuccess } from '../utils.js';


function AdminLogin() {

    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    })

    // React تستخدم للتنقل بين المسارات في navigation function يستخدم للحصول على React Router من مكتبة Hook هي عباره عن
    const navigate = useNavigate(); 

    // نقوم بحفظها user القيم التي يقوم بتدخيلها ال
    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value); // console شو بتدخل بعطيك على ال
        const copyLoginInfo = { ...loginInfo }; // نسخ معلومات تسجيل الدخول
        copyLoginInfo[name] = value; // تحديث قيمة معينة
        setLoginInfo(copyLoginInfo); // نقوم بتحديث الحالة باستخدام دالة
    }


    const handleLogin = async (e) => {
        e.preventDefault(); // يمنع إعادة تحميل الصفحة عند ارسال النموذج
        const { email, password } = loginInfo;
        if (!email || !password) { // يتحقق مما اذا كانت القيمة غير موجوده (ان تكون فارغة او غير معرفه)
            return handleError('email and password are required')
        }

        // this code sends login information to a local server using a POST request in JSON format.
        try {
            const url = `http://localhost:8080/auth/admin`; // مكان ارسال الطلب
            const response = await fetch(url, { // HTTP لارسال طلب fetch
                method: "POST", // نوع الطلب
                headers: { 
                    'Content-Type': 'application/json' // نوع البيانات ( هنا بتنسيق json )
                },
                body: JSON.stringify(loginInfo) // وارسالها JSON string  الى loginInfo يتم تحويل  
            });
            const result = await response.json(); // وتخزينها في متغير JSON لتحويل استجابة الخادم ال
            const { success, message, jwtToken, role } = result;
            if (success) {
                handleSuccess(message);
                localStorage.setItem('token', jwtToken); // يقوم بتخزين المعلومات داخل المتصفح ( -Application in browser للتأكد من انه تم الحفظ تذهب الى - key 'token' تحت مفتاح localStorage في jwt هنا خزن قيمة )
                localStorage.setItem('role', role);
                setTimeout(() => { 
                    navigate('/admin/home') // (function) سيتم تنفيذها بعد انتهاء الوقت
                }, 1000) // الوقت الذي سيتم الانتظار فيه قبل تنفيذ الدالة، وهو 1000 مللي ثانية، أي 1 ثانية
            } else if (!success) {
                handleError(message);
            }
            console.log(result);
        } catch (err) {
            handleError(err);
        }
    }

    return (
        <div className='container login'>
            <h1>Admin Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor='email'>Email</label>
                    <input
                        onChange={handleChange}
                        type='email'
                        name='email'
                        placeholder='Enter your email...'
                        value={loginInfo.email}
                    />
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input
                        onChange={handleChange}
                        type='password'
                        name='password'
                        placeholder='Enter your password...'
                        value={loginInfo.password}
                    />
                </div>
                <button type='submit'>Login</button>
            </form>
            <ToastContainer /> {/* يتم استخدامه لعرض رسائل النجاح أو الخطأ أو أي نوع آخر من الإشعارات التي يحتاج المستخدم لرؤيتها */}
        </div>
    )
}

export default AdminLogin;
