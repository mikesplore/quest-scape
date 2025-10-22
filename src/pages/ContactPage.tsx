import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const ContactPage: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      details: 'support@learnhub.com',
      link: 'mailto:support@learnhub.com',
    },
    {
      icon: Phone,
      title: 'Phone',
      details: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
    },
    {
      icon: MapPin,
      title: 'Address',
      details: '123 Learning Street, Education City, EC 12345',
      link: null,
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: 'Mon-Fri: 9:00 AM - 6:00 PM EST',
      link: null,
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast({
        title: 'Message Sent!',
        description: 'We\'ll get back to you as soon as possible.',
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <MessageSquare size={48} className="text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-text-primary mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed">
            Have a question or need assistance? We're here to help! 
            Reach out to our support team and we'll get back to you as soon as possible.
          </p>
        </motion.div>
      </section>

      {/* Contact Info Cards */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <motion.div
              key={info.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-bg-primary p-6 rounded-xl border border-border-primary hover:border-primary transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-primary/10 rounded-full mb-4">
                  <info.icon size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {info.title}
                </h3>
                {info.link ? (
                  <a
                    href={info.link}
                    className="text-text-secondary hover:text-primary transition-colors"
                  >
                    {info.details}
                  </a>
                ) : (
                  <p className="text-text-secondary">{info.details}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-bg-primary p-8 rounded-xl border border-border-primary"
            >
              <h2 className="text-3xl font-bold text-text-primary mb-6">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-text-primary mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    className="w-full"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} className="mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-text-primary mb-4">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  <div className="bg-bg-primary p-6 rounded-xl border border-border-primary">
                    <h4 className="font-semibold text-text-primary mb-2">
                      How long does it take to get a response?
                    </h4>
                    <p className="text-text-secondary">
                      We typically respond within 24 hours during business days. 
                      For urgent matters, please call our support line.
                    </p>
                  </div>
                  
                  <div className="bg-bg-primary p-6 rounded-xl border border-border-primary">
                    <h4 className="font-semibold text-text-primary mb-2">
                      Do you offer technical support?
                    </h4>
                    <p className="text-text-secondary">
                      Yes! Our technical support team is available to help with any 
                      platform-related issues or questions.
                    </p>
                  </div>
                  
                  <div className="bg-bg-primary p-6 rounded-xl border border-border-primary">
                    <h4 className="font-semibold text-text-primary mb-2">
                      Can I schedule a demo?
                    </h4>
                    <p className="text-text-secondary">
                      Absolutely! Mention it in your message and we'll set up a 
                      personalized demo at your convenience.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary to-primary/80 p-8 rounded-xl text-white">
                <h3 className="text-2xl font-bold mb-4">
                  Need Immediate Help?
                </h3>
                <p className="mb-6 opacity-90">
                  Check out our comprehensive help center for instant answers to 
                  common questions and detailed guides.
                </p>
                <a
                  href="/help"
                  className="inline-block px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Visit Help Center
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
