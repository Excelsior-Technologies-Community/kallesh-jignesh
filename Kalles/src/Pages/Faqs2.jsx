import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';

const Faqs2 = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqData = [
        {
            question: "Do I need to open an account in order to shop with you?",
            answer: "No, you don’t need to. You can make purchases and check out as a guest everytime.\n\nHowever, by setting up an account with us, it will allow you to order without having to enter your details every time you shop with us. You can sign up right now, or you can first start shopping and create your account before you check out at the shopping cart page."
        },
        {
            question: "How do I /create an account?",
            answer: "Please click on \"Login/Register\" followed by \"Create An Account\" and fill in your personal particulars."
        },
        {
            question: "How do I order?",
            answer: "Shop for the items you want and add it to your shopping cart. When you have finished, you can proceed to your shopping cart and check out. Check and ensure that all information is correct before confirming your purchases and payment."
        },
        {
            question: "How do I pay for my orders?",
            answer: "We accept payments via Paypal and all major credit and debit cards such as Mastercard, VISA and American Express."
        },
        {
            question: "Can I amend and cancel my order?",
            answer: "Unfortunately we are unable to cancel an order once it has been placed. This will allow us to pack your orders efficiently and to minimize errors. It is advisable to check your order before placing it."
        },
        {
            question: "I have a discount code, how can I use it?",
            answer: "Unfortunately we are unable to cancel an order once it has been placed. This will allow us to pack your orders efficiently and to minimize errors. It is advisable to check your order before placing it."
        },
        {
            question: "How will I know if my order is confirmed?",
            answer: "After you have placed your order, you will receive an acknowledgement e-mail from us to confirm that your orders have been received. However, do note that orders will only be shipped when your credit card payment has been approved and billing and delivery address is verified. Alternatively, you may check the status of your order in \"My Account\" if you are a registered user."
        },
        {
            question: "I have problems adding items to my shopping cart?",
            answer: "You will be able to add the items as long as it is available. There could be an instance where the item is in someone else’s shopping cart hence the status of the items is reflected as “Temporarily Unavailable”."
        }
    ];

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative h-[250px] w-full bg-[url('https://kalles-5.myshopify.com/cdn/shop/files/bg-heading.jpg?v=1717404698&width=1920')] bg-cover bg-center flex flex-col justify-center items-center text-white mb-16">
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative z-10 text-center">
                    <h1 className="text-xl font-bold mb-3 tracking-wider">FAQs 2</h1>
                    <div className="text-sm font-medium flex items-center justify-center gap-2 text-white/90">
                        <Link to="/" className="hover:text-[#43D1F0] transition-colors">Home</Link>
                        <span>&gt;</span>
                        <span>FAQs 2</span>
                    </div>
                </div>
            </div>

            {/* FAQ Content */}
            <div className="max-w-[1170px] mx-auto px-4 pb-20">
                <div className="space-y-4">
                    {faqData.map((item, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div key={index} className="border border-transparent">
                                <button
                                    className="w-full flex items-center justify-between bg-[#f6f6f6] px-6 py-4 transition-colors hover:bg-gray-100"
                                    onClick={() => toggleAccordion(index)}
                                >
                                    <span className="text-[15px] font-bold text-[#222]">
                                        {item.question}
                                    </span>
                                    <div className="w-[30px] h-[30px] bg-[#222] flex items-center justify-center text-white flex-shrink-0 transition-colors hover:bg-[#43D1F0]">
                                        {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                                    </div>
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <div className="px-6 py-6 text-[#878787] text-[14px] leading-relaxed border border-[#f6f6f6] border-t-0">
                                        {item.answer.split('\n\n').map((paragraph, i) => (
                                            <p key={i} className="mb-4 last:mb-0">
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Faqs2;
