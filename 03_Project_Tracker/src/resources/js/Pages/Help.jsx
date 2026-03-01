import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Help({ auth }) {
    const faqs = [
        {
            question: "How do I create a new project?",
            answer: "Click on the 'Projects' link in the navigation, then click the 'New Project' button. Fill in the project name, description, and other details, then click 'Create Project'."
        },
        {
            question: "How do I add tasks to a project?",
            answer: "Open a project by clicking on its name, then click 'Add Task'. Fill in the task details like title, description, due date, and priority level."
        },
        {
            question: "How do I track my progress?",
            answer: "The Dashboard shows your overall progress with statistics cards. Each project page also has a progress bar showing completion status."
        },
        {
            question: "How do I mark a task as complete?",
            answer: "Open a project and find the task you want to complete. Click on the task and change its status to 'Completed', or use the checkbox if available."
        },
        {
            question: "Can I edit my profile information?",
            answer: "Yes, click on your name in the top right corner and select 'Profile' from the dropdown menu. You can update your name, email, and password."
        },
        {
            question: "How do I use the search feature?",
            answer: "On the Projects or Tasks pages, use the search bar to filter items by name. You can also use the status filter to show specific types of tasks."
        }
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-blue-900">
                    Help Center
                </h2>
            }
        >
            <Head title="Help" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-blue-900">
                            How can we help you?
                        </h1>
                        <p className="mt-2 text-blue-600">
                            Find answers to common questions about TaskFlow
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <a href="#faq" className="flex items-center justify-center rounded-xl bg-blue-100 p-4 text-blue-700 transition hover:bg-blue-200">
                            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            FAQs
                        </a>
                        <a href="#contact" className="flex items-center justify-center rounded-xl bg-blue-100 p-4 text-blue-700 transition hover:bg-blue-200">
                            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Contact Support
                        </a>
                        <a href="#guide" className="flex items-center justify-center rounded-xl bg-blue-100 p-4 text-blue-700 transition hover:bg-blue-200">
                            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            User Guide
                        </a>
                    </div>

                    {/* FAQs Section */}
                    <div id="faq" className="overflow-hidden rounded-xl bg-white shadow-md">
                        <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white p-6">
                            <h2 className="text-xl font-semibold text-blue-900">
                                Frequently Asked Questions
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-6">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="border-b border-blue-50 pb-6 last:border-0 last:pb-0">
                                        <h3 className="flex items-center text-md font-semibold text-blue-800">
                                            <svg className="mr-2 h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {faq.question}
                                        </h3>
                                        <p className="mt-2 text-sm text-blue-600">
                                            {faq.answer}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Getting Started Guide */}
                    <div id="guide" className="mt-8 overflow-hidden rounded-xl bg-white shadow-md">
                        <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white p-6">
                            <h2 className="text-xl font-semibold text-blue-900">
                                Getting Started Guide
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="flex rounded-lg bg-blue-50 p-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                                        1
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="font-semibold text-blue-900">Create a Project</h3>
                                        <p className="text-sm text-blue-600">
                                            Start by creating your first project to organize your work.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex rounded-lg bg-blue-50 p-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                                        2
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="font-semibold text-blue-900">Add Tasks</h3>
                                        <p className="text-sm text-blue-600">
                                            Break down your project into actionable tasks.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex rounded-lg bg-blue-50 p-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                                        3
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="font-semibold text-blue-900">Track Progress</h3>
                                        <p className="text-sm text-blue-600">
                                            Monitor your progress from the dashboard.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex rounded-lg bg-blue-50 p-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                                        4
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="font-semibold text-blue-900">Complete Tasks</h3>
                                        <p className="text-sm text-blue-600">
                                            Mark tasks as complete when done.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Support */}
                    <div id="contact" className="mt-8 overflow-hidden rounded-xl bg-white shadow-md">
                        <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white p-6">
                            <h2 className="text-xl font-semibold text-blue-900">
                                Contact Support
                            </h2>
                        </div>
                        <div className="p-6">
                            <p className="text-blue-600">
                                Can't find what you're looking for? Contact our support team for assistance.
                            </p>
                            <a
                                href="mailto:support@taskflow.com"
                                className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                            >
                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Contact Support
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
