import React from 'react';
import { Link } from 'react-router-dom';

const Faqs = () => {
    const faqData = [
        {
            category: "1. ORDERING",
            items: [
                {
                    question: "1.1 Do I need to open an account in order to purchase?",
                    answer: "No, you don’t need to. You can make purchases and check out as a guest everytime. However, by setting up an account with us, it will allow you to order without having to enter your details every time you shop with us. You can sign up right now, or you can first start shopping and create your account before you check out at the shopping cart page."
                },
                {
                    question: "1.2 How do I / create an account?",
                    answer: "Please click on \"Login/Register\" followed by \"Create An Account\" and fill in your personal particulars."
                },
                {
                    question: "1.3 How do I order?",
                    answer: "Shop for the items you want and add it to your shopping cart. When you have finished, you can proceed to your shopping cart and check out. Check and ensure that all information is correct before confirming your purchases and payment."
                },
                {
                    question: "1.4 I have problems adding items to my shopping cart",
                    answer: "You will be able to add the items as long as it is available. There could be an instance where the item is in someone else’s shopping cart hence the status of the items is reflected as “Temporarily Unavailable”."
                },
                {
                    question: "1.5 How do I pay for my orders?",
                    answer: "We accept payments via Paypal and all major credit and debit cards such as Mastercard, VISA and American Express."
                },
                {
                    question: "1.6 Can I amend and cancel my order?",
                    answer: "Unfortunately we are unable to cancel an order once it has been placed. This will allow us to pack your orders efficiently and to minimize errors. It is advisable to check your order before placing it."
                },
                {
                    question: "1.7 I have a discount code, how can I use it?",
                    answer: "Key in the voucher code at the field \"Voucher Code\" and click \"Add\" in your Shopping Cart page before proceeding to check out. Please note that we are unable to manually apply the voucher code to your order if you have missed keying it during check out. Kindly ensure that all information is correct before confirming your purchase."
                },
                {
                    question: "1.8 How will I know if my order is confirmed?",
                    answer: "After you have placed your order, you will receive an acknowledgement e-mail from us to confirm that your orders have been received. However, do note that orders will only be shipped when your credit card payment has been approved and billing and delivery address is verified. Alternatively, you may check the status of your order in \"My Account\" if you are a registered user."
                }
            ]
        },
        {
            category: "2. SHIPPING & DELIVERY",
            items: [
                {
                    question: "2.1 When will my order be processed?",
                    answer: "All orders will be processed within 2 working days, excluding weekends and public holidays. Time stated is based on Singapore Time (UTC/GMT +8hours)."
                },
                {
                    question: "2.2 How long will it take for me to receive my order?",
                    answer: "The standard courier delivery time frame is approximately 5 working days and the express courier is approximately 2 working days from the time of placing your order. This is applicable only to all Singapore deliveries. For all international deliveries, the time taken is dependent on our logistics partners and their affiliates."
                },
                {
                    question: "2.3 How can I track my delivery?",
                    answer: "Once the order has been dispatched, an email confirmation will be sent to you with the tracking number. You may check and track the delivery status of your orders with our local logistics partner, with your 6-digit Order Number for all Singapore deliveries. For international deliveries, you may track your orders here."
                },
                {
                    question: "2.4 What are the shipping charges like?",
                    answer: "Shipping is FREE for all Singapore deliveries via Standard courier. For international deliveries, you may select your item and proceed to the check out page as charges are based on weight and volume. Upon entering your delivery details, we will auto calculate the delivery charges based on your given address without the need for payment or registration."
                },
                {
                    question: "2.5 Can I change my shipping address after my order has been confirmed?",
                    answer: "Unfortunately, we are unable to redirect orders once your order is confirmed. Therefore, please ensure you provide the correct shipping address."
                },
                {
                    question: "2.6 There is a missing item in my order, what should I do?",
                    answer: "We apologize for sending you an incomplete order. Please contact our Customer Care Team at marketing@company.com and we will get back to you as soon as we can."
                },
                {
                    question: "2.7 I've received a defective item, what should I do?",
                    answer: "We apologize if you had received a defective item from us. Please contact our Customer Care Team at marketing@company.com with a snapshot of the product and we will get back to you as soon as we can."
                },
                {
                    question: "2.8 I've received an incorrect item, what should I do?",
                    answer: "We apologize for sending you the wrong item. Please contact our Customer Care Team at marketing@company.com and we will get back to you as soon as we can."
                },
                {
                    question: "2.9 I've purchased the wrong size or color",
                    answer: "We do not provide exchanges for size or color. We do however, accept returns for products purchased from us. You can refer to our Returns & Exchanges policy here and its procedures."
                },
                {
                    question: "2.10 I have not received my parcel, what should I do?",
                    answer: "Kindly drop an email to our Customer Care Team at marketing@company.com if you have not received your parcel after 10 working days and we will assist you accordingly."
                },
                {
                    question: "2.11 Will there be an additional charge for redelivery?",
                    answer: "There are no additional charges for redelivery up to two times. It is chargeable on the third attempt onwards."
                },
                {
                    question: "2.12 I have yet to receive my parcel within the stipulated time frame. Whom can I contact?",
                    answer: "You may check the status of your parcel via \"Track your order\" at to find out why it might have been delayed. Alternatively, you may drop us an email at marketing@company.com and we will assist you further."
                }
            ]
        }
    ];

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative h-[150px] w-full bg-[url('https://kalles-5.myshopify.com/cdn/shop/files/bg-heading.jpg?v=1717404698&width=1920')] bg-cover bg-center flex flex-col justify-center items-center text-white">
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative z-10 text-center">
                    <h1 className="text-xl font-semibold mb-3 tracking-wider">FAQS</h1>
                    <div className="text-sm font-medium flex items-center justify-center gap-2 text-white/90">
                        <Link to="/" className="hover:text-[#43D1F0] transition-colors">Home</Link>
                        <span>&gt;</span>
                        <span>FAQs</span>
                    </div>
                </div>
            </div>
        
            {/* FAQ Content */}
            <div className="max-w-[1180px] mx-auto py-16 px-4">
                {faqData.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="mb-12">
                        <h2 className="text-[24px] font-bold text-[#222] mb-8 uppercase tracking-wide">
                            {section.category}
                        </h2>
                        <div className="space-y-6">
                            {section.items.map((item, index) => (
                                <div key={index} className="pb-4">
                                    <h3 className="text-[16px] font-bold text-[#222] mb-2 leading-6">
                                        {item.question}
                                    </h3>
                                    <p className="text-[#878787] text-[14px] leading-6">
                                        {item.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Faqs;
