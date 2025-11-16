import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png"
import { setPaymentLoading } from "../../redux/slices/courseSlice";
import { resetCart } from "../../redux/slices/cartSlice";
import emailjs from "@emailjs/browser";
import { courseEnrollmentEmail } from "../../mailTemplates/courseEnrollmentEmail";
import { paymentSuccessEmail } from "../../mailTemplates/paymentSuccessfullEmail";

const {COURSE_PAYMENT_API, COURSE_VERIFY_API} = studentEndpoints;

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            resolve(true);
        }
        script.onerror= () =>{
            resolve(false);
        }
        document.body.appendChild(script);
    })
}


export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
    // console.log(courses);
    const courseIds = courses.map((course) => course._id)
    const toastId = toast.loading("Loading...");
    try{
        //load the script
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if(!res) {
            toast.error("RazorPay SDK failed to load");
            return;
        }
        
        //initiate the order
        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API, 
        {courses: courseIds},
        {
            Authorization: `Bearer ${token}`,
        })

        if(!orderResponse.data.success) {
            throw new Error(orderResponse.data.message);
        }

        // console.log("PRINTING orderResponse", orderResponse);
        //options
        const options = {
            key: orderResponse.data.data.key,
            currency: orderResponse.data.data.currency,
            amount: `${orderResponse.data.data.amount}`,
            order_id:orderResponse.data.data.id,
            name:"StudyCraze",
            description: "Thank You for Purchasing the Course",
            image:rzpLogo,
            prefill: {
                name:`${userDetails.firstName} ${userDetails.lastName}`,
                email:userDetails.email
            },
            handler: function(response) {
                //verifyPayment
                verifyPayment({...response, courses: courseIds}, courses, userDetails, token, navigate, dispatch);
                //send successful wala mail
                sendPaymentSuccessEmail(response, userDetails, orderResponse.data.data.amount,token );
            }
        }
        //miss hogya tha 
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", function(response) {
            toast.error("oops, payment failed");
            // console.log(response.error);
        })

    }
    catch(error) {
        // console.log("PAYMENT API ERROR.....", error);
        toast.error("Could not make Payment");
    }
    toast.dismiss(toastId);
}

async function sendPaymentSuccessEmail(response, userDetails, amount, token) {
    try{
        // await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
        //     orderId: response.razorpay_order_id,
        //     paymentId: response.razorpay_payment_id,
        //     amount,
        // },{
        //     Authorization: `Bearer ${token}`
        // })

        await emailjs.send(
            process.env.REACT_APP_EMAILJS_SERVICE_ID,
            process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
            {
                email: userDetails?.email,
                subject: `Payment Received`,
                message_html: paymentSuccessEmail(userDetails.firstName + " " + userDetails.lastName, amount/100, response.razorpay_order_id, response.razorpay_payment_id),
            },
            process.env.REACT_APP_EMAILJS_PUBLIC_ID
        );

    }
    catch(error) {
        // console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
    }
}

//verify payment
async function verifyPayment(bodyData, courses, userDetails, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying Payment....");
    dispatch(setPaymentLoading(true));
    try{
        const response  = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
            Authorization:`Bearer ${token}`,
        })
        if(!response.data.success) {
            throw new Error(response.data.message);
        }
        for(const course of courses){
            
            await emailjs.send(
                process.env.REACT_APP_EMAILJS_SERVICE_ID,
                process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
                {
                    email: userDetails?.email,
                    subject: `Successfully Enrolled into ${course.courseName}`,
                    message_html: courseEnrollmentEmail(course.courseName, userDetails.firstName + " " + userDetails.lastName),
                },
                process.env.REACT_APP_EMAILJS_PUBLIC_ID
            );
        }
        
        toast.success("payment Successful, you are addded to the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    }   
    catch(error) {
        // console.log("PAYMENT VERIFY ERROR....", error);
        toast.error("Could not verify Payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}