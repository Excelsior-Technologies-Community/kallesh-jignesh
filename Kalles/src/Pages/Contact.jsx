import React, { useState } from 'react'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import axios from 'axios'

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    })
    const [status, setStatus] = useState({
        loading: false,
        success: false,
        error: null
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus({ loading: true, success: false, error: null })

        try {
            const response = await axios.post('http://localhost:5000/api/contact', formData)
            if (response.status === 200) {
                setStatus({ loading: false, success: true, error: null })
                setFormData({ name: '', email: '', phone: '', message: '' })
                alert('Message sent successfully!')
            }
        } catch (error) {
            console.error('Error sending message:', error)
            setStatus({ loading: false, success: false, error: 'Failed to send message. Please try again.' })
            alert('Failed to send message.')
        }
    }

    return (
        <div className="w-full">
            {/* Banner Section */}
            <div
                className="relative h-[120px] w-full bg-cover bg-center flex items-center justify-center"
                style={{
                    backgroundImage: "url('https://kalles-5.myshopify.com/cdn/shop/files/shop-category.jpg?v=1745806645&width=1920')"
                }}
            >
                <div className="absolute inset-0 bg-black/40"></div>
                <h1 className="relative z-10 text-xl md:text-2xl font-semibold text-white tracking-widest uppercase">
                    Contact Us
                </h1>
            </div>

            {/* Map Section */}
            <div className="w-full h-[500px]">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.578688753239!2d144.7984852758872!3d-37.77651857198463!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65e6307775903%3A0x629555237890eb9d!2s184%20Main%20Rd%20E%2C%20St%20Albans%20VIC%203021%2C%20Australia!5e0!3m2!1sen!2sin!4v1708492000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>

            {/* Contact Form & Info Section */}
            <div className="w-full md:max-w-[1200px] mx-auto">
                <div className="container mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Contact Form */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold uppercase tracking-wide">DROP US A LINE</h2>
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="space-y-1">
                                    <label htmlFor="name" className="text-sm text-gray-500">Your Name (required)</label>
                                    <input
                                        name="name"
                                        type="text"
                                        id="name"
                                        required
                                        className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-black transition-colors"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="email" className="text-sm text-gray-500">Your Email (required)</label>
                                    <input
                                        name="email"
                                        type="email"
                                        id="email"
                                        required
                                        className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-black transition-colors"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="phone" className="text-sm text-gray-500">Your Phone Number</label>
                                    <input
                                        name="phone"
                                        type="text"
                                        id="phone"
                                        className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-black transition-colors"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="message" className="text-sm text-gray-500">Message (required)</label>
                                    <textarea
                                        name="message"
                                        id="message"
                                        required
                                        rows="4"
                                        className="w-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-black transition-colors"
                                        value={formData.message}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={status.loading}
                                    className="w-full py-3 bg-transparent border border-black rounded-full font-medium text-sm hover:bg-black hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {status.loading ? 'Sending...' : 'Send'}
                                </button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-8">
                            <h2 className="text-2xl font-bold uppercase tracking-wide">CONTACT INFORMATION</h2>
                            <p className="text-gray-500 leading-relaxed text-sm">
                                We love to hear from you on our customer service, merchandise, website or any topics you want to share with us. Your comments and suggestions will be appreciated. Please complete the form below.
                            </p>
                            <div className="space-y-5 text-sm text-gray-500">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 mt-0.5 shrink-0" strokeWidth={1.5} />
                                    <p>184 Main Rd E, St Albans Victoria 3021, Australia</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 shrink-0" strokeWidth={1.5} />
                                    <p>1800-123-222 / 1900-1570-230</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 shrink-0" strokeWidth={1.5} />
                                    <p>contact@company.com</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="w-5 h-5 shrink-0" strokeWidth={1.5} />
                                    <p>Everyday 9:00-17:00</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact
